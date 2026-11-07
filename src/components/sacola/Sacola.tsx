"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import QRCode from "qrcode";
import { useLoja, type Pedido } from "@/lib/store";
import { preco, tempo } from "@/lib/formato";
import { MAX_RESERVAS_POR_CLIENTE, RESERVA_MS } from "@/lib/regras";
import {
  FAIXAS_CORREIOS,
  FAIXAS_MOTOBOY,
  RAIO_MOTOBOY_KM,
  consultarCep,
  faixaPara,
  rotuloFaixa,
  type ModoEntrega,
} from "@/lib/frete";
import { codigoPix } from "@/lib/pix";
import { Cerimonia } from "./Cerimonia";
import s from "./Sacola.module.css";

type Dados = Record<string, string>;
type Erros = Partial<Record<string, string>>;

/** Situação da consulta do CEP. `km` null = rua não localizada, frete combinado pelo WhatsApp. */
type Cep =
  | { estado: "ocioso" }
  | { estado: "buscando" }
  | { estado: "ok"; km: number | null }
  | { estado: "erro"; mensagem: string };

function validar(d: Dados, cep: Cep): Erros {
  const e: Erros = {};
  if (!d.nome?.trim()) e.nome = "Escreva seu nome completo.";
  if (!/^\S+@\S+\.\S+$/.test(d.email ?? "")) e.email = "Confira o e-mail: ele precisa ter @ e domínio, como nome@email.com.";
  if ((d.telefone ?? "").replace(/\D/g, "").length < 10) e.telefone = "Informe o WhatsApp com DDD.";
  if ((d.cep ?? "").replace(/\D/g, "").length !== 8) e.cep = "O CEP tem 8 números.";
  else if (cep.estado === "erro") e.cep = cep.mensagem;
  if (!d.endereco?.trim()) e.endereco = "Informe a rua.";
  if (!d.numero?.trim()) e.numero = "Informe o número.";
  if (!d.cidade?.trim()) e.cidade = "Informe a cidade e o estado.";
  if (d.entrega === "motoboy" && cep.estado === "ok" && cep.km !== null && cep.km > RAIO_MOTOBOY_KM)
    e.entrega = `O motoboy atende até ${RAIO_MOTOBOY_KM} km. Escolha os Correios.`;
  if (d.pagamento === "cartao") {
    if ((d.cartao ?? "").replace(/\D/g, "").length < 13) e.cartao = "O número do cartão parece incompleto.";
    if (!/^\d{2}\/\d{2}$/.test(d.validade ?? "")) e.validade = "Use o formato MM/AA.";
    if (!/^\d{3,4}$/.test(d.cvv ?? "")) e.cvv = "São 3 ou 4 números no verso.";
  }
  return e;
}

const ROTULOS: Record<string, string> = {
  nome: "Nome",
  email: "E-mail",
  telefone: "WhatsApp",
  cep: "CEP",
  endereco: "Rua",
  numero: "Número",
  cidade: "Cidade",
  entrega: "Entrega",
  cartao: "Número do cartão",
  validade: "Validade",
  cvv: "CVV",
};

const NOMES_ENTREGA: Record<ModoEntrega, string> = { motoboy: "Motoboy", correios: "Correios" };

function novoCodigo() {
  return `P-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function Sacola() {
  const { minhasReservas, agora, liberar, finalizarCompra, pronto } = useLoja();
  const [dados, setDados] = useState<Dados>({ entrega: "correios", pagamento: "pix" });
  const [erros, setErros] = useState<Erros>({});
  const [etapa, setEtapa] = useState<"revisao" | "pix" | "processando">("revisao");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [cep, setCep] = useState<Cep>({ estado: "ocioso" });
  const [pix, setPix] = useState<{ codigo: string; pedido: string; qr: string } | null>(null);
  const [copiado, setCopiado] = useState(false);
  const resumoErros = useRef<HTMLDivElement>(null);
  const blocoPix = useRef<HTMLDivElement>(null);

  // CEP completo: busca o endereço e a distância do ateliê
  const digitosCep = (dados.cep ?? "").replace(/\D/g, "");
  useEffect(() => {
    if (digitosCep.length !== 8) {
      setCep({ estado: "ocioso" });
      return;
    }
    const controle = new AbortController();
    setCep({ estado: "buscando" });
    consultarCep(digitosCep, controle.signal)
      .then((r) => {
        if (!r.ok) {
          setCep({
            estado: "erro",
            mensagem: r.erro === "nao-encontrado" ? "Não encontramos esse CEP. Confira os números." : "Não conseguimos consultar o CEP agora. Preencha o endereço e a Renata confirma o frete.",
          });
          return;
        }
        const { endereco, km } = r;
        setCep({ estado: "ok", km });
        setDados((d) => ({
          ...d,
          endereco: endereco.rua ? [endereco.rua, endereco.bairro].filter(Boolean).join(", ") : (d.endereco ?? ""),
          cidade: endereco.cidade ? `${endereco.cidade} / ${endereco.uf}` : (d.cidade ?? ""),
          // fora do raio do motoboy: volta para os Correios
          entrega: d.entrega === "motoboy" && km !== null && km > RAIO_MOTOBOY_KM ? "correios" : d.entrega,
        }));
        setErros((e) => ({ ...e, cep: undefined, endereco: undefined, cidade: undefined }));
      })
      .catch(() => {
        /* consulta cancelada: o CEP mudou */
      });
    return () => controle.abort();
  }, [digitosCep]);

  // Gera o QR Code do Pix
  useEffect(() => {
    if (!pix || pix.qr) return;
    QRCode.toDataURL(pix.codigo, { margin: 1, width: 480, color: { dark: "#2d1f17", light: "#fffaf5" } }).then((qr) =>
      setPix((p) => (p ? { ...p, qr } : p)),
    );
  }, [pix]);

  if (pedido) return <Cerimonia pedido={pedido} />;

  const subtotal = minhasReservas.reduce((acc, r) => acc + r.peca.preco, 0);
  const km = cep.estado === "ok" ? cep.km : null;
  const modo = (dados.entrega === "motoboy" ? "motoboy" : "correios") as ModoEntrega;
  const faixa = km !== null ? faixaPara(modo, km) : null;
  const frete = faixa?.valor;
  const total = subtotal + (frete ?? 0);
  const motoboyForaDoRaio = km !== null && km > RAIO_MOTOBOY_KM;

  const campo = (nome: string) => ({
    id: nome,
    name: nome,
    value: dados[nome] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDados((d) => ({ ...d, [nome]: e.target.value })),
    "aria-invalid": erros[nome] ? true : undefined,
    "aria-describedby": erros[nome] ? `${nome}-erro` : undefined,
    className: "entrada",
    disabled: etapa !== "revisao",
  });
  const erro = (nome: string) =>
    erros[nome] ? (
      <p id={`${nome}-erro`} className="erro-campo">
        {erros[nome]}
      </p>
    ) : null;

  function confirmar(codigoPedido?: string) {
    setEtapa("processando");
    // Simula a confirmação do pagamento
    window.setTimeout(() => {
      const res = finalizarCompra(
        {
          nome: dados.nome.trim(),
          email: dados.email.trim(),
          telefone: dados.telefone.trim(),
          entrega: modo,
          cep: dados.cep?.trim(),
          cidade: dados.cidade?.trim(),
          endereco: `${dados.endereco.trim()}, ${dados.numero.trim()}`,
          frete,
          distanciaKm: km !== null ? Math.round(km * 10) / 10 : undefined,
          // só a forma de pagamento: número, validade e CVV do cartão não são guardados
          pagamento: dados.pagamento === "cartao" ? "cartao" : "pix",
        },
        codigoPedido,
      );
      if (res.ok) setPedido(res.pedido);
      else {
        setEtapa("revisao");
        setPix(null);
        setFalha("Suas reservas expiraram antes da confirmação do pagamento. Volte à vitrine para ver se as peças ainda estão disponíveis.");
      }
    }, 1800);
  }

  function pagar(e: React.FormEvent) {
    e.preventDefault();
    const encontrados = validar(dados, cep);
    setErros(encontrados);
    setFalha(null);
    if (Object.keys(encontrados).length) {
      requestAnimationFrame(() => resumoErros.current?.focus());
      return;
    }
    if (dados.pagamento === "pix") {
      const codigoPedido = novoCodigo();
      setPix({ codigo: codigoPix(total, codigoPedido), pedido: codigoPedido, qr: "" });
      setCopiado(false);
      setEtapa("pix");
      requestAnimationFrame(() => blocoPix.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
      return;
    }
    confirmar();
  }

  async function copiarPix() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.codigo);
      setCopiado(true);
    } catch {
      /* sem permissão: o código continua visível para copiar à mão */
    }
  }

  if (!pronto) return <section className="envoltorio cabeca-pagina" aria-busy="true"><h1>Sua sacola</h1></section>;

  if (!minhasReservas.length) {
    return (
      <section className={`envoltorio cabeca-pagina ${s.vazia}`}>
        <h1>Sua sacola</h1>
        <p className="lede">{falha ?? "Está vazia. Quando você reserva uma peça, ela fica guardada aqui só para você."}</p>
        <div className={s.vaziaAcoes}>
          <Link href="/vitrine" className="botao">Ver a vitrine</Link>
          <Link href="/encomenda" className="botao botao--contorno">Encomendar a sua</Link>
        </div>
      </section>
    );
  }

  const primeira = minhasReservas[0];

  return (
    <div className="envoltorio">
      <header className="cabeca-pagina">
        <h1>Sua sacola</h1>
        <p className="lede">
          Finalize em até <strong className="numero">{tempo(primeira.reservadaAte - agora)}</strong> para garantir{" "}
          {minhasReservas.length > 1 ? "todas as peças" : "a peça"}. Cada reserva tem seu próprio tempo.
        </p>
      </header>

      <div className={s.grade}>
        <section aria-labelledby="titulo-pecas" className={s.pecas}>
          <h2 id="titulo-pecas" className="sr-only">Peças reservadas</h2>
          <ul className={s.lista}>
            {minhasReservas.map(({ peca, reservadaAte }) => {
              const falta = reservadaAte - agora;
              return (
                <li key={peca.numero} className={s.item} data-urgente={falta < 120_000 || undefined}>
                  <Link href={`/peca/${peca.numero}`} className={s.miniatura}>
                    <Image src={peca.foto.src} alt="" fill sizes="120px" style={{ objectFit: "cover", objectPosition: peca.foto.foco }} />
                  </Link>
                  <div className={s.itemTexto}>
                    <p className={`${s.itemNumero} numero`}>Nº {peca.numero}</p>
                    <p className={s.itemNome}>
                      <Link href={`/peca/${peca.numero}`}>{peca.nome}</Link>
                    </p>
                    <p className={`${s.itemPreco} numero`}>{preco(peca.preco)}</p>
                  </div>
                  <div className={s.itemTempo}>
                    <p className={`${s.relogio} numero`} role="timer" aria-label={`Reserva termina em ${tempo(falta)}`}>
                      {tempo(falta)}
                    </p>
                    <div className={s.barra} aria-hidden>
                      <span style={{ transform: `scaleX(${falta / RESERVA_MS})` }} />
                    </div>
                    <button type="button" className={s.liberar} onClick={() => liberar(peca.numero)}>
                      Liberar peça
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className={s.regra}>
            Você pode guardar até {MAX_RESERVAS_POR_CLIENTE} peças ao mesmo tempo. Se o tempo acabar, a peça volta para a
            vitrine e outra cliente pode levá-la.
          </p>
        </section>

        <form className={s.checkout} onSubmit={pagar} noValidate aria-labelledby="titulo-checkout">
          <h2 id="titulo-checkout">Finalizar compra</h2>

          {Object.keys(erros).some((k) => erros[k]) && (
            <div ref={resumoErros} tabIndex={-1} className={s.resumoErros} role="alert">
              <p>Faltam alguns dados:</p>
              <ul>
                {Object.keys(erros)
                  .filter((k) => erros[k])
                  .map((k) => (
                    <li key={k}>
                      <a href={`#${k === "entrega" ? "entrega-motoboy" : k}`}>{ROTULOS[k]}</a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {falha && <p className={s.resumoErros} role="alert">{falha}</p>}

          <fieldset className={s.grupo}>
            <legend>Seus dados</legend>
            <div className="campo">
              <label htmlFor="nome">Nome completo</label>
              <input {...campo("nome")} autoComplete="name" />
              {erro("nome")}
            </div>
            <div className={s.dupla}>
              <div className="campo">
                <label htmlFor="email">E-mail</label>
                <input {...campo("email")} type="email" autoComplete="email" />
                {erro("email")}
              </div>
              <div className="campo">
                <label htmlFor="telefone">WhatsApp</label>
                <input {...campo("telefone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 90000-0000" />
                {erro("telefone")}
              </div>
            </div>
          </fieldset>

          <fieldset className={s.grupo}>
            <legend>Entrega</legend>
            <div className={s.dupla}>
              <div className="campo">
                <label htmlFor="cep">CEP</label>
                <input {...campo("cep")} inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" />
                {erro("cep")}
                {!erros.cep && cep.estado === "buscando" && <p className={s.dica} role="status">Buscando endereço…</p>}
                {!erros.cep && cep.estado === "erro" && <p className={s.dica} role="status">{cep.mensagem}</p>}
              </div>
              <div className="campo">
                <label htmlFor="cidade">Cidade / UF</label>
                <input {...campo("cidade")} autoComplete="address-level2" />
                {erro("cidade")}
              </div>
            </div>
            <div className={s.ruaNumero}>
              <div className="campo">
                <label htmlFor="endereco">Rua e bairro</label>
                <input {...campo("endereco")} autoComplete="address-line1" />
                {erro("endereco")}
              </div>
              <div className="campo">
                <label htmlFor="numero">Número</label>
                <input {...campo("numero")} autoComplete="address-line2" placeholder="120, ap 32" />
                {erro("numero")}
              </div>
            </div>

            <div className="escolhas" role="radiogroup" aria-label="Forma de entrega">
              {(["motoboy", "correios"] as const).map((m) => {
                const f = km !== null ? faixaPara(m, km) : null;
                const fora = m === "motoboy" && motoboyForaDoRaio;
                return (
                  <label key={m} className={`escolha ${s.opcaoEntrega}`}>
                    <input
                      id={`entrega-${m}`}
                      type="radio"
                      name="entrega"
                      value={m}
                      checked={dados.entrega === m}
                      disabled={fora || etapa !== "revisao"}
                      onChange={() => {
                        setDados((d) => ({ ...d, entrega: m }));
                        setErros((e) => ({ ...e, entrega: undefined }));
                      }}
                    />
                    <span>
                      <strong>{NOMES_ENTREGA[m]}</strong>
                      <small>
                        {fora
                          ? `Fora do raio de ${RAIO_MOTOBOY_KM} km`
                          : f
                            ? `${preco(f.valor)} · ${f.prazo}`
                            : cep.estado === "ok"
                              ? "Valor combinado no WhatsApp"
                              : "Informe o CEP para ver o valor"}
                      </small>
                    </span>
                  </label>
                );
              })}
            </div>
            {erro("entrega")}
            {km !== null && <p className={s.dica}>Seu endereço fica a {km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km do ateliê.</p>}

            <details className={s.tabelaFrete}>
              <summary>Ver valores por distância</summary>
              <div className={s.tabelas}>
                {(
                  [
                    ["Motoboy", FAIXAS_MOTOBOY],
                    ["Correios", FAIXAS_CORREIOS],
                  ] as const
                ).map(([nome, faixas]) => (
                  <table key={nome}>
                    <caption>{nome}</caption>
                    <tbody>
                      {faixas.map((f, i) => (
                        <tr key={i} data-atual={(faixa === f) || undefined}>
                          <th scope="row">{rotuloFaixa(faixas, i)}</th>
                          <td className="numero">{preco(f.valor)}</td>
                          <td>{f.prazo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            </details>
          </fieldset>

          <fieldset className={s.grupo}>
            <legend>Pagamento</legend>
            <div className="escolhas">
              {[
                ["pix", "Pix"],
                ["cartao", "Cartão de crédito"],
              ].map(([v, r]) => (
                <label key={v} className="escolha">
                  <input
                    type="radio"
                    name="pagamento"
                    value={v}
                    checked={dados.pagamento === v}
                    disabled={etapa !== "revisao"}
                    onChange={() => setDados((d) => ({ ...d, pagamento: v }))}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {dados.pagamento === "cartao" && (
              <>
                <div className="campo">
                  <label htmlFor="cartao">Número do cartão</label>
                  <input {...campo("cartao")} inputMode="numeric" autoComplete="cc-number" />
                  {erro("cartao")}
                </div>
                <div className={s.dupla}>
                  <div className="campo">
                    <label htmlFor="validade">Validade</label>
                    <input {...campo("validade")} placeholder="MM/AA" autoComplete="cc-exp" />
                    {erro("validade")}
                  </div>
                  <div className="campo">
                    <label htmlFor="cvv">CVV</label>
                    <input {...campo("cvv")} inputMode="numeric" autoComplete="cc-csc" />
                    {erro("cvv")}
                  </div>
                </div>
              </>
            )}
          </fieldset>

          <div className={s.totais}>
            <div>
              <span>Peças ({minhasReservas.length})</span>
              <span className="numero">{preco(subtotal)}</span>
            </div>
            <div>
              <span>Frete{faixa ? ` · ${NOMES_ENTREGA[modo]}` : ""}</span>
              <span className={frete !== undefined ? "numero" : undefined}>
                {frete !== undefined ? preco(frete) : cep.estado === "ok" || cep.estado === "erro" ? "A combinar" : "Informe o CEP"}
              </span>
            </div>
            <div className={s.total}>
              <span>Total</span>
              <span className="numero">{preco(total)}</span>
            </div>
          </div>

          {etapa === "revisao" ? (
            <button type="submit" className="botao botao--largo">
              <Lock size={15} aria-hidden /> {dados.pagamento === "pix" ? "Pagar com Pix" : "Pagar"} {preco(total)}
            </button>
          ) : pix ? (
            <div ref={blocoPix} className={s.pix} aria-live="polite">
              <p className={s.pixTitulo}>
                Pague <strong className="numero">{preco(total)}</strong> com Pix
              </p>
              <div className={s.qr}>
                {pix.qr ? <img src={pix.qr} alt="QR Code do Pix" width={240} height={240} /> : <span aria-busy="true" />}
              </div>
              <p className={s.dica}>Abra o app do seu banco, escolha Pix e aponte a câmera para o código. Ou copie o código abaixo.</p>
              <div className={s.copiaCola}>
                <input className="entrada numero" readOnly value={pix.codigo} aria-label="Código Pix copia e cola" onFocus={(e) => e.currentTarget.select()} />
                <button type="button" className="botao botao--contorno" onClick={copiarPix}>
                  {copiado ? "Copiado" : "Copiar"}
                </button>
              </div>
              <button
                type="button"
                className="botao botao--largo"
                onClick={() => confirmar(pix.pedido)}
                disabled={etapa === "processando"}
                aria-busy={etapa === "processando"}
              >
                {etapa === "processando" ? "Confirmando pagamento…" : "Já fiz o Pix"}
              </button>
              {etapa === "pix" && (
                <button
                  type="button"
                  className={s.voltar}
                  onClick={() => {
                    setEtapa("revisao");
                    setPix(null);
                  }}
                >
                  Voltar e mudar os dados
                </button>
              )}
            </div>
          ) : (
            <button type="button" className="botao botao--largo" disabled aria-busy>
              Confirmando pagamento…
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
