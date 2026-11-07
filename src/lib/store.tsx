"use client";

/**
 * "Servidor" de mentira: guarda o estado de cada peça única no localStorage.
 * Quando houver back-end, este arquivo é o único que precisa trocar.
 *
 * Ciclo de uma peça:  disponível → reservada (20 min) → vendida (vai para o acervo)
 *                                   ↘ expirou → disponível
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PECAS, type Peca } from "@/data/pecas";
import { MAX_RESERVAS_POR_CLIENTE, RESERVA_MS } from "./regras";

export type Situacao = "disponivel" | "reservada" | "vendida";

export type Registro = {
  situacao: Situacao;
  /** Só em "reservada": quando a reserva acaba (epoch ms). */
  reservadaAte?: number;
  /** De quem é a reserva ou a compra. */
  dona?: "eu" | "outra";
  /** ISO, só em "vendida". */
  vendidaEm?: string;
};

/** Andamento do pedido, controlado pela vendedora em /vendedora. */
export type StatusPedido = "preparar" | "enviado" | "entregue";

/** O que a cliente preenche no checkout. Dados do cartão nunca são guardados. */
export type DadosCompra = {
  nome: string;
  email: string;
  telefone: string;
  /** "envio" e "retirada" só existem em pedidos antigos. */
  entrega: "motoboy" | "correios" | "envio" | "retirada";
  cep?: string;
  cidade?: string;
  endereco?: string;
  /** Valor do frete; ausente quando ficou para combinar pelo WhatsApp. */
  frete?: number;
  distanciaKm?: number;
  pagamento: "pix" | "cartao";
};

export type ItemPedido = { numero: string; nome: string; preco: number };

export type Pedido = {
  codigo: string;
  numeros: string[];
  total: number;
  criadoEm: string;
  /** Retrato das peças no momento da compra (pedidos antigos não têm). */
  itens?: ItemPedido[];
  cliente?: DadosCompra;
  status?: StatusPedido;
};

export type Aviso = { id: string; numero: string; tipo: "expirou" | "comprada-por-outra" };

/** Movimento lançado à mão no caixa da vendedora: venda fora do site (WhatsApp, feira…) ou gasto. */
export type Lancamento = {
  id: string;
  tipo: "entrada" | "saida";
  /** De onde veio a venda ou com o que foi o gasto: "WhatsApp", "Feira", "Material"… */
  origem: string;
  descricao: string;
  valor: number;
  /** "2026-11-07" */
  data: string;
};

type Banco = {
  versao: 2;
  registros: Record<string, Registro>;
  pedidos: Pedido[];
  avisos: Aviso[];
  /** Peças cadastradas pela vendedora na área /vendedora (mais nova primeiro). */
  extras?: Peca[];
  /** Caixa: vendas fora do site e gastos lançados pela vendedora. */
  lancamentos?: Lancamento[];
};

/** Dados que a vendedora preenche; o resto (número, data) é gerado. */
export type NovaPeca = Pick<Peca, "nome" | "categoria" | "materiais" | "preco" | "descricao" | "medidas"> & {
  foto: string;
};

function catalogoDe(b: Banco): Peca[] {
  return [...(b.extras ?? []), ...PECAS];
}
function buscarEm(b: Banco, numero: string) {
  return catalogoDe(b).find((p) => p.numero === numero);
}

export type ErroReserva = "indisponivel" | "limite";

const CHAVE = "rf-joias:banco";

function bancoInicial(agora: number | null): Banco {
  const registros: Record<string, Registro> = {};
  for (const p of PECAS) {
    if (p.situacaoInicial === "vendida") {
      registros[p.numero] = { situacao: "vendida", dona: "outra", vendidaEm: p.vendidaEm };
    } else if (agora && p.simularReservaDeOutraMin) {
      registros[p.numero] = {
        situacao: "reservada",
        dona: "outra",
        reservadaAte: agora + p.simularReservaDeOutraMin * 60_000,
      };
    } else {
      registros[p.numero] = { situacao: "disponivel" };
    }
  }
  return { versao: 2, registros, pedidos: [], avisos: [] };
}

function ler(): Banco | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const banco = JSON.parse(bruto) as Banco;
    if (banco.versao !== 2) return null;
    // Peças novas adicionadas ao catálogo depois do último acesso
    const base = bancoInicial(null);
    banco.registros = { ...base.registros, ...banco.registros };
    // O catálogo manda: peça marcada como vendida nele aparece vendida para todo mundo
    for (const p of PECAS) {
      if (p.situacaoInicial === "vendida" && banco.registros[p.numero]?.situacao !== "vendida") {
        banco.registros[p.numero] = base.registros[p.numero];
      }
    }
    return banco;
  } catch {
    return null;
  }
}

function gravar(banco: Banco) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(banco));
    return true;
  } catch {
    /* modo privado ou armazenamento cheio: o site continua funcionando na memória */
    return false;
  }
}

/** Devolve reservas vencidas para a vitrine. Retorna o mesmo objeto se nada mudou. */
function varrerExpiradas(banco: Banco, agora: number): Banco {
  let mudou = false;
  const registros = { ...banco.registros };
  const avisos = [...banco.avisos];
  for (const [numero, r] of Object.entries(registros)) {
    if (r.situacao === "reservada" && (r.reservadaAte ?? 0) <= agora) {
      registros[numero] = { situacao: "disponivel" };
      if (r.dona === "eu") avisos.push({ id: `${numero}-${agora}`, numero, tipo: "expirou" });
      mudou = true;
    }
  }
  return mudou ? { ...banco, registros, avisos } : banco;
}

function codigo(prefixo: string, usados: string[] = []) {
  let c = "";
  do c = `${prefixo}-${Math.floor(1000 + Math.random() * 9000)}`;
  while (usados.includes(c));
  return c;
}

type Loja = {
  pronto: boolean;
  /** Todas as peças: as da vendedora + o catálogo fixo. */
  catalogo: Peca[];
  buscar: (numero: string) => Peca | undefined;
  /** Peças que a vendedora cadastrou (podem ser removidas). */
  minhasPublicadas: Peca[];
  adicionarPeca: (dados: NovaPeca) => { ok: true; peca: Peca } | { ok: false; erro: "espaco" };
  removerPeca: (numero: string) => void;
  agora: number;
  registro: (numero: string) => Registro;
  restante: (numero: string) => number;
  minhasReservas: { peca: Peca; reservadaAte: number }[];
  avisos: Aviso[];
  pedidos: Pedido[];
  reservar: (numero: string) => { ok: true } | { ok: false; erro: ErroReserva };
  liberar: (numero: string) => void;
  /** `codigo`: o mesmo que foi usado no Pix, se ainda estiver livre. */
  finalizarCompra: (dados: DadosCompra, codigo?: string) => { ok: true; pedido: Pedido } | { ok: false; erro: "sem-reservas" };
  mudarStatusPedido: (codigo: string, status: StatusPedido) => void;
  lancamentos: Lancamento[];
  adicionarLancamento: (dados: Omit<Lancamento, "id">) => void;
  removerLancamento: (id: string) => void;
  dispensarAviso: (id: string) => void;
  vendidas: () => { peca: Peca; registro: Registro }[];
  demo: {
    outraReserva: () => string | null;
    outraCompra: () => string | null;
    expirarMinhas: () => void;
    restaurar: () => void;
  };
};

const LojaContext = createContext<Loja | null>(null);

export function LojaProvider({ children }: { children: React.ReactNode }) {
  const [banco, setBanco] = useState<Banco>(() => bancoInicial(null));
  const [pronto, setPronto] = useState(false);
  const [agora, setAgora] = useState(0);
  const bancoRef = useRef(banco);
  bancoRef.current = banco;

  // Carrega do localStorage depois da hidratação
  useEffect(() => {
    const t = Date.now();
    setBanco(varrerExpiradas(ler() ?? bancoInicial(t), t));
    setAgora(t);
    setPronto(true);
  }, []);

  // Persiste
  useEffect(() => {
    if (pronto) gravar(banco);
  }, [banco, pronto]);

  // Outra aba do mesmo navegador mexeu na loja
  useEffect(() => {
    function aoMudar(e: StorageEvent) {
      if (e.key !== CHAVE) return;
      const novo = ler();
      if (novo) setBanco(novo);
    }
    window.addEventListener("storage", aoMudar);
    return () => window.removeEventListener("storage", aoMudar);
  }, []);

  // Relógio: só anda enquanto existir alguma reserva
  const temReserva = Object.values(banco.registros).some((r) => r.situacao === "reservada");
  useEffect(() => {
    if (!pronto || !temReserva) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setAgora(t);
      setBanco((b) => varrerExpiradas(b, t));
    }, 1000);
    return () => window.clearInterval(id);
  }, [pronto, temReserva]);

  const registro = useCallback(
    (numero: string): Registro => banco.registros[numero] ?? { situacao: "disponivel" },
    [banco.registros],
  );

  const restante = useCallback(
    (numero: string) => {
      const r = banco.registros[numero];
      return r?.situacao === "reservada" && r.reservadaAte ? Math.max(0, r.reservadaAte - agora) : 0;
    },
    [banco.registros, agora],
  );

  const minhasReservas = useMemo(
    () =>
      Object.entries(banco.registros)
        .filter(([, r]) => r.situacao === "reservada" && r.dona === "eu")
        .map(([numero, r]) => ({ peca: buscarEm(banco, numero)!, reservadaAte: r.reservadaAte! }))
        .filter((x) => x.peca)
        .sort((a, b) => a.reservadaAte - b.reservadaAte),
    [banco],
  );

  const reservar = useCallback((numero: string) => {
    const b = varrerExpiradas(bancoRef.current, Date.now());
    const r = b.registros[numero];
    if (!r || r.situacao !== "disponivel") return { ok: false as const, erro: "indisponivel" as const };
    const minhas = Object.values(b.registros).filter((x) => x.situacao === "reservada" && x.dona === "eu");
    if (minhas.length >= MAX_RESERVAS_POR_CLIENTE) return { ok: false as const, erro: "limite" as const };
    const t = Date.now();
    setAgora(t);
    setBanco({
      ...b,
      registros: { ...b.registros, [numero]: { situacao: "reservada", dona: "eu", reservadaAte: t + RESERVA_MS } },
      avisos: b.avisos.filter((a) => a.numero !== numero),
    });
    return { ok: true as const };
  }, []);

  const liberar = useCallback((numero: string) => {
    setBanco((b) => {
      const r = b.registros[numero];
      if (r?.situacao !== "reservada" || r.dona !== "eu") return b;
      return { ...b, registros: { ...b.registros, [numero]: { situacao: "disponivel" } } };
    });
  }, []);

  const finalizarCompra = useCallback((dados: DadosCompra, sugerido?: string) => {
    const t = Date.now();
    const b = varrerExpiradas(bancoRef.current, t);
    const numeros = Object.entries(b.registros)
      .filter(([, r]) => r.situacao === "reservada" && r.dona === "eu")
      .map(([n]) => n);
    if (numeros.length === 0) {
      setBanco(b);
      return { ok: false as const, erro: "sem-reservas" as const };
    }
    const hoje = new Date(t).toISOString();
    const registros = { ...b.registros };
    for (const n of numeros) registros[n] = { situacao: "vendida", dona: "eu", vendidaEm: hoje };
    const itens: ItemPedido[] = numeros.map((n) => {
      const p = buscarEm(b, n);
      return { numero: n, nome: p?.nome ?? `Peça nº ${n}`, preco: p?.preco ?? 0 };
    });
    const pedido: Pedido = {
      codigo:
        sugerido && !b.pedidos.some((x) => x.codigo === sugerido) ? sugerido : codigo("P", b.pedidos.map((x) => x.codigo)),
      numeros,
      total: itens.reduce((s, i) => s + i.preco, 0) + (dados.frete ?? 0),
      criadoEm: hoje,
      itens,
      cliente: dados,
      status: "preparar",
    };
    setBanco({ ...b, registros, pedidos: [pedido, ...b.pedidos] });
    return { ok: true as const, pedido };
  }, []);

  const mudarStatusPedido = useCallback((cod: string, status: StatusPedido) => {
    setBanco((b) => ({ ...b, pedidos: b.pedidos.map((p) => (p.codigo === cod ? { ...p, status } : p)) }));
  }, []);

  const adicionarLancamento = useCallback((dados: Omit<Lancamento, "id">) => {
    const novo: Lancamento = { ...dados, id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}` };
    setBanco((b) => ({ ...b, lancamentos: [novo, ...(b.lancamentos ?? [])] }));
  }, []);

  const removerLancamento = useCallback((id: string) => {
    setBanco((b) => ({ ...b, lancamentos: (b.lancamentos ?? []).filter((l) => l.id !== id) }));
  }, []);

  const dispensarAviso = useCallback((id: string) => {
    setBanco((b) => ({ ...b, avisos: b.avisos.filter((a) => a.id !== id) }));
  }, []);

  const vendidas = useCallback(
    () =>
      catalogoDe(banco)
        .filter((p) => banco.registros[p.numero]?.situacao === "vendida")
        .map((peca) => ({ peca, registro: banco.registros[peca.numero] }))
        .sort((a, b) => (b.registro.vendidaEm ?? "").localeCompare(a.registro.vendidaEm ?? "")),
    [banco],
  );

  const demo = useMemo(
    () => ({
      outraReserva() {
        const livres = catalogoDe(bancoRef.current).filter((p) => bancoRef.current.registros[p.numero]?.situacao === "disponivel");
        if (!livres.length) return null;
        const p = livres[Math.floor(Math.random() * livres.length)];
        const t = Date.now();
        setAgora(t);
        setBanco((b) => ({
          ...b,
          registros: { ...b.registros, [p.numero]: { situacao: "reservada", dona: "outra", reservadaAte: t + RESERVA_MS } },
        }));
        return p.nome;
      },
      outraCompra() {
        const alvo = catalogoDe(bancoRef.current).find((p) => {
          const r = bancoRef.current.registros[p.numero];
          return r?.situacao === "reservada" && r.dona === "outra";
        });
        if (!alvo) return null;
        setBanco((b) => ({
          ...b,
          registros: {
            ...b.registros,
            [alvo.numero]: { situacao: "vendida", dona: "outra", vendidaEm: new Date().toISOString() },
          },
        }));
        return alvo.nome;
      },
      expirarMinhas() {
        const t = Date.now();
        setBanco((b) => {
          const registros = { ...b.registros };
          for (const [n, r] of Object.entries(registros)) {
            if (r.situacao === "reservada" && r.dona === "eu") registros[n] = { ...r, reservadaAte: t - 1 };
          }
          return varrerExpiradas({ ...b, registros }, t);
        });
      },
      restaurar() {
        const t = Date.now();
        setAgora(t);
        // O caixa e as peças da vendedora são dela: a demonstração não apaga
        setBanco((b) => ({ ...bancoInicial(t), extras: b.extras, lancamentos: b.lancamentos }));
      },
    }),
    [],
  );

  const catalogo = useMemo(() => catalogoDe(banco), [banco]);
  const buscar = useCallback((numero: string) => catalogo.find((p) => p.numero === numero), [catalogo]);

  const adicionarPeca = useCallback((dados: NovaPeca) => {
    const b = bancoRef.current;
    const maior = Math.max(0, ...catalogoDe(b).map((p) => Number(p.numero) || 0));
    const numero = String(maior + 1).padStart(3, "0");
    const peca: Peca = {
      numero,
      nome: dados.nome,
      categoria: dados.categoria,
      materiais: dados.materiais,
      tecnica: "",
      medidas: dados.medidas,
      peso: "",
      preco: dados.preco,
      descricao: dados.descricao,
      foto: { src: dados.foto, alt: `${dados.nome}, peça feita à mão por Renata Ferré` },
      publicadaEm: new Date().toISOString().slice(0, 10),
      situacaoInicial: "disponivel",
    };
    const novo: Banco = {
      ...b,
      extras: [peca, ...(b.extras ?? [])],
      registros: { ...b.registros, [numero]: { situacao: "disponivel" } },
    };
    // Grava já, para avisar se a foto não couber no armazenamento do navegador
    if (!gravar(novo)) return { ok: false as const, erro: "espaco" as const };
    setBanco(novo);
    return { ok: true as const, peca };
  }, []);

  const removerPeca = useCallback((numero: string) => {
    setBanco((b) => {
      const registros = { ...b.registros };
      delete registros[numero];
      return { ...b, extras: (b.extras ?? []).filter((p) => p.numero !== numero), registros };
    });
  }, []);

  const valor: Loja = {
    pronto,
    catalogo,
    buscar,
    minhasPublicadas: banco.extras ?? [],
    adicionarPeca,
    removerPeca,
    agora,
    registro,
    restante,
    minhasReservas,
    avisos: banco.avisos,
    pedidos: banco.pedidos,
    reservar,
    liberar,
    finalizarCompra,
    mudarStatusPedido,
    lancamentos: banco.lancamentos ?? [],
    adicionarLancamento,
    removerLancamento,
    dispensarAviso,
    vendidas,
    demo,
  };

  return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

export function useLoja() {
  const ctx = useContext(LojaContext);
  if (!ctx) throw new Error("useLoja precisa estar dentro de <LojaProvider>");
  return ctx;
}
