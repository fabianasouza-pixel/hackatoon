"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useLoja, type Lancamento } from "@/lib/store";
import { data, mesAno, preco } from "@/lib/formato";
import s from "./Caixa.module.css";

const ORIGENS = {
  entrada: ["WhatsApp", "Feira", "Instagram", "Encomenda", "Outro"],
  saida: ["Material", "Embalagem", "Frete", "Feira", "Outro"],
} as const;

type Movimento = {
  id: string;
  tipo: Lancamento["tipo"];
  origem: string;
  descricao: string;
  valor: number;
  data: string;
  /** Venda feita pelo site: entra sozinha e não pode ser apagada aqui. */
  doSite: boolean;
};

/** Data de hoje no fuso de quem usa, no formato "2026-11-07". */
function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "1.250,50" → 1250.5 */
function lerValor(texto: string) {
  return Number(texto.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
}

/** "2026-11" → "Novembro" (ano atual) ou "Dezembro de 2025" */
function nomeDoMes(mes: string, anoAtual: string) {
  const nome = mesAno(`${mes}-01`);
  const curto = mes.slice(0, 4) === anoAtual ? nome.replace(/ de \d{4}$/, "") : nome;
  return curto.charAt(0).toUpperCase() + curto.slice(1);
}

const VAZIO = { tipo: "entrada" as Lancamento["tipo"], origem: "", descricao: "", valor: "", data: "" };

/** Fluxo de caixa: vendas do site entram sozinhas; vendas de fora e gastos a vendedora lança aqui. */
export function Caixa() {
  const { pedidos, lancamentos, adicionarLancamento, removerLancamento, pronto } = useLoja();
  /** "2026-11" ou "tudo"; null = mês atual. */
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const [campos, setCampos] = useState(VAZIO);
  const [erro, setErro] = useState<string | null>(null);
  const [lancado, setLancado] = useState(false);

  if (!pronto) return null;

  const mesAtual = hoje().slice(0, 7);
  const periodo = escolhido ?? mesAtual;
  const todos: Movimento[] = [
    ...pedidos.map((p) => ({
      id: p.codigo,
      tipo: "entrada" as const,
      origem: "Site",
      descricao: `Pedido ${p.codigo}${p.cliente ? `, ${p.cliente.nome}` : ""}`,
      valor: p.total,
      data: p.criadoEm.slice(0, 10),
      doSite: true,
    })),
    ...lancamentos.map((l) => ({ ...l, doSite: false })),
  ];
  const movimentos = todos
    .filter((m) => periodo === "tudo" || m.data.startsWith(periodo))
    .sort((a, b) => b.data.localeCompare(a.data));
  // Um botão por mês com movimento (e sempre o mês atual), do mais recente para o mais antigo
  const meses = [...new Set([mesAtual, ...todos.map((m) => m.data.slice(0, 7))])].sort().reverse();

  const soma = (lista: Movimento[]) => lista.reduce((t, m) => t + m.valor, 0);
  const site = soma(movimentos.filter((m) => m.doSite));
  const outras = soma(movimentos.filter((m) => !m.doSite && m.tipo === "entrada"));
  const gastos = soma(movimentos.filter((m) => m.tipo === "saida"));
  const saldo = site + outras - gastos;

  function mudar<K extends keyof typeof VAZIO>(campo: K, valor: (typeof VAZIO)[K]) {
    setCampos((c) => ({ ...c, [campo]: valor, ...(campo === "tipo" ? { origem: "" } : {}) }));
    setErro(null);
    setLancado(false);
  }

  function lancar(e: React.FormEvent) {
    e.preventDefault();
    const valor = lerValor(campos.valor);
    if (!campos.origem) return setErro(campos.tipo === "entrada" ? "Escolha onde foi a venda." : "Escolha com o que foi o gasto.");
    if (!campos.descricao.trim()) return setErro("Escreva uma descrição curta.");
    if (!valor || valor <= 0) return setErro("Informe o valor.");
    const dataLancamento = campos.data || hoje();
    adicionarLancamento({
      tipo: campos.tipo,
      origem: campos.origem,
      descricao: campos.descricao.trim(),
      valor,
      data: dataLancamento,
    });
    // Mostra o mês do lançamento, para ele aparecer no resumo e na lista
    if (periodo !== "tudo") setEscolhido(dataLancamento.slice(0, 7));
    setCampos({ ...VAZIO, tipo: campos.tipo });
    setLancado(true);
  }

  return (
    <section className={s.secao} aria-labelledby="titulo-caixa">
      <div className={s.cabeca}>
        <h2 id="titulo-caixa">Fluxo de caixa</h2>
        <fieldset className={s.periodo}>
          <legend className="sr-only">Período</legend>
          <div className="escolhas">
            {meses.map((m) => (
              <label key={m} className="escolha">
                <input type="radio" name="periodo-caixa" checked={periodo === m} onChange={() => setEscolhido(m)} />
                <span>{nomeDoMes(m, mesAtual.slice(0, 4))}</span>
              </label>
            ))}
            <label className="escolha">
              <input type="radio" name="periodo-caixa" checked={periodo === "tudo"} onChange={() => setEscolhido("tudo")} />
              <span>Tudo</span>
            </label>
          </div>
        </fieldset>
      </div>

      <dl className={s.resumo}>
        <div>
          <dt>Vendas no site</dt>
          <dd className="numero">{preco(site)}</dd>
        </div>
        <div>
          <dt>Outras vendas</dt>
          <dd className="numero">{preco(outras)}</dd>
        </div>
        <div>
          <dt>Gastos</dt>
          <dd className="numero">{gastos > 0 ? `− ${preco(gastos)}` : preco(0)}</dd>
        </div>
        <div className={s.saldo} data-negativo={saldo < 0 || undefined}>
          <dt>Saldo</dt>
          <dd className="numero">{preco(saldo)}</dd>
        </div>
      </dl>

      <form className={s.form} onSubmit={lancar} noValidate>
        <h3>Lançar no caixa</h3>
        <fieldset className={s.grupo}>
          <legend>Tipo</legend>
          <div className="escolhas">
            <label className="escolha">
              <input type="radio" name="tipo-lancamento" checked={campos.tipo === "entrada"} onChange={() => mudar("tipo", "entrada")} />
              <span>Venda</span>
            </label>
            <label className="escolha">
              <input type="radio" name="tipo-lancamento" checked={campos.tipo === "saida"} onChange={() => mudar("tipo", "saida")} />
              <span>Gasto</span>
            </label>
          </div>
        </fieldset>

        <fieldset className={s.grupo}>
          <legend>{campos.tipo === "entrada" ? "Onde vendeu" : "Com o quê"}</legend>
          <div className="escolhas">
            {ORIGENS[campos.tipo].map((o) => (
              <label key={o} className="escolha">
                <input type="radio" name="origem-lancamento" checked={campos.origem === o} onChange={() => mudar("origem", o)} />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={s.linha}>
          <div className={`campo ${s.descricao}`}>
            <label htmlFor="descricao-lancamento">Descrição</label>
            <input
              id="descricao-lancamento"
              className="entrada"
              value={campos.descricao}
              onChange={(e) => mudar("descricao", e.target.value)}
              placeholder={campos.tipo === "entrada" ? "Ex.: Anel búzio para a Carla" : "Ex.: Chapa de latão"}
            />
          </div>
          <div className="campo">
            <label htmlFor="valor-lancamento">Valor (R$)</label>
            <input id="valor-lancamento" className="entrada" inputMode="decimal" value={campos.valor} onChange={(e) => mudar("valor", e.target.value)} placeholder="250,00" />
          </div>
          <div className="campo">
            <label htmlFor="data-lancamento">Data</label>
            <input id="data-lancamento" type="date" className="entrada" value={campos.data || hoje()} onChange={(e) => mudar("data", e.target.value)} />
          </div>
        </div>

        {erro && (
          <p className={s.erro} role="alert">
            {erro}
          </p>
        )}
        {lancado && (
          <p className={s.ok} role="status">
            Lançado no caixa.
          </p>
        )}

        <button type="submit" className="botao">
          {campos.tipo === "entrada" ? "Lançar venda" : "Lançar gasto"}
        </button>
      </form>

      {movimentos.length === 0 ? (
        <p className={s.vazio}>
          {periodo !== "tudo" ? "Nenhum movimento neste mês ainda." : "Nenhum movimento ainda."} As vendas do site entram aqui sozinhas.
        </p>
      ) : (
        <ul className={s.movimentos}>
          {movimentos.map((m) => (
            <li key={m.id} className={s.movimento}>
              <span className={`${s.data} numero`}>{data(m.data)}</span>
              <span className={s.origem} data-site={m.doSite || undefined} data-tipo={m.tipo}>
                {m.origem}
              </span>
              <span className={s.texto}>{m.descricao}</span>
              <span className={`${s.valor} numero`} data-tipo={m.tipo}>
                {m.tipo === "saida" ? "− " : "+ "}
                {preco(m.valor)}
              </span>
              {m.doSite ? (
                <span className={s.semAcao} aria-hidden />
              ) : (
                <button
                  type="button"
                  className={s.remover}
                  onClick={() => {
                    if (window.confirm(`Apagar "${m.descricao}" do caixa?`)) removerLancamento(m.id);
                  }}
                >
                  <Trash2 size={16} aria-hidden />
                  <span className="sr-only">Apagar {m.descricao}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
