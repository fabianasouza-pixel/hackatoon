"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLoja, type Pedido, type StatusPedido } from "@/lib/store";
import { preco } from "@/lib/formato";
import { formatarWhatsapp, linkWhatsapp } from "@/lib/contato";
import s from "./Pedidos.module.css";

const POR_PAGINA = 5;

const FILTROS: { id: StatusPedido | "todos"; nome: string }[] = [
  { id: "todos", nome: "Todos" },
  { id: "preparar", nome: "Não enviados" },
  { id: "enviado", nome: "Enviados" },
  { id: "entregue", nome: "Entregues" },
];

function statusDe(p: Pedido): StatusPedido {
  return p.status ?? "preparar";
}

function rotuloStatus(status: StatusPedido, retirada: boolean) {
  if (status === "preparar") return retirada ? "A preparar" : "Não enviado";
  if (status === "enviado") return retirada ? "Pronto para retirar" : "Enviado";
  return "Entregue";
}

function dataHora(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

/** "(11) 98765-4321" → "5511987654321", para o link do WhatsApp. */
function numeroWhatsapp(telefone: string) {
  const d = telefone.replace(/\D/g, "");
  return d.startsWith("55") && d.length > 11 ? d : `55${d}`;
}

export function Pedidos() {
  const { pedidos, pronto } = useLoja();
  const [filtro, setFiltro] = useState<StatusPedido | "todos">("todos");
  const [mostrar, setMostrar] = useState(POR_PAGINA);

  if (!pronto) return null;

  const contagem = (id: StatusPedido | "todos") =>
    id === "todos" ? pedidos.length : pedidos.filter((p) => statusDe(p) === id).length;
  const filtrados = filtro === "todos" ? pedidos : pedidos.filter((p) => statusDe(p) === filtro);
  const visiveis = filtrados.slice(0, mostrar);
  const faltam = filtrados.length - visiveis.length;
  const totalVendido = pedidos.reduce((soma, p) => soma + p.total, 0);

  return (
    <section className={s.secao} aria-labelledby="titulo-pedidos">
      <div className={s.cabeca}>
        <h2 id="titulo-pedidos">Pedidos</h2>
        {pedidos.length > 0 && (
          <p className={s.resumo}>
            <span className="numero">{pedidos.length}</span> {pedidos.length === 1 ? "pedido" : "pedidos"} ·{" "}
            <span className="numero">{preco(totalVendido)}</span> em vendas
          </p>
        )}
      </div>

      {pedidos.length === 0 ? (
        <p className={s.vazio}>Nenhuma compra feita ainda. Quando uma cliente finalizar a sacola, o pedido aparece aqui.</p>
      ) : (
        <>
          <fieldset className={s.filtros}>
            <legend className="sr-only">Filtrar pedidos</legend>
            <div className="escolhas">
              {FILTROS.map((f) => (
                <label key={f.id} className="escolha">
                  <input
                    type="radio"
                    name="filtro-pedidos"
                    checked={filtro === f.id}
                    onChange={() => {
                      setFiltro(f.id);
                      setMostrar(POR_PAGINA);
                    }}
                  />
                  <span>
                    {f.nome} <span className={`${s.contagem} numero`}>{contagem(f.id)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {filtrados.length === 0 ? (
            <p className={s.vazio}>Nenhum pedido nesta situação.</p>
          ) : (
            <ul className={s.lista}>
              {visiveis.map((p) => (
                <li key={p.codigo}>
                  <CartaoPedido pedido={p} />
                </li>
              ))}
            </ul>
          )}

          {faltam > 0 && (
            <button type="button" className={`botao botao--contorno ${s.verMais}`} onClick={() => setMostrar((m) => m + POR_PAGINA)}>
              Ver mais ({faltam})
            </button>
          )}
        </>
      )}
    </section>
  );
}

function CartaoPedido({ pedido }: { pedido: Pedido }) {
  const { buscar, mudarStatusPedido } = useLoja();
  const c = pedido.cliente;
  const retirada = c?.entrega === "retirada";
  const status = statusDe(pedido);
  const itens = pedido.itens ?? pedido.numeros.map((n) => ({ numero: n, nome: buscar(n)?.nome ?? `Peça nº ${n}`, preco: buscar(n)?.preco ?? 0 }));
  const qtd = itens.length;

  return (
    <details className={s.pedido}>
      <summary className={s.linha}>
        <span className={s.identificacao}>
          <span className={`${s.codigo} numero`}>{pedido.codigo}</span>
          <span className={s.data}>{dataHora(pedido.criadoEm)}</span>
        </span>
        <span className={s.cliente}>
          {c?.nome ?? "Cliente não registrada"}
          <span className={s.qtd}>
            {qtd} {qtd === 1 ? "peça" : "peças"}
          </span>
        </span>
        <span className={`${s.total} numero`}>{preco(pedido.total)}</span>
        <span className={s.status} data-status={status}>
          {rotuloStatus(status, retirada)}
        </span>
        <span className={s.abrir}>
          <span className={s.abrirTexto}>Ver detalhes</span>
          <ChevronDown size={18} strokeWidth={1.6} aria-hidden />
        </span>
      </summary>

      <div className={s.corpo}>
        <div className={s.bloco}>
          <h3>Peças</h3>
          <ul className={s.itens}>
            {itens.map((i) => {
              const peca = buscar(i.numero);
              return (
                <li key={i.numero} className={s.item}>
                  <span className={s.itemFoto}>
                    {peca && <Image src={peca.foto.src} alt="" fill sizes="56px" style={{ objectFit: "cover", objectPosition: peca.foto.foco }} />}
                  </span>
                  <span className={s.itemTexto}>
                    {peca ? <Link href={`/peca/${i.numero}`}>{i.nome}</Link> : i.nome}
                    <span className="numero">Nº {i.numero}</span>
                  </span>
                  <span className="numero">{preco(i.preco)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {c ? (
          <dl className={s.dados}>
            <div>
              <dt>Cliente</dt>
              <dd>{c.nome}</dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                <a href={linkWhatsapp(`Olá, ${c.nome.split(" ")[0]}! Aqui é a Renata, sobre o seu pedido ${pedido.codigo}.`, numeroWhatsapp(c.telefone))} target="_blank" rel="noreferrer">
                  {formatarWhatsapp(c.telefone)}
                </a>
              </dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>
                {retirada ? (
                  "Retirar com a Renata"
                ) : (
                  <>
                    {c.entrega === "motoboy" ? "Motoboy" : "Correios"}
                    {c.distanciaKm !== undefined && ` · ${c.distanciaKm.toLocaleString("pt-BR")} km`}
                    <br />
                    {c.endereco}
                    <br />
                    {c.cidade} · CEP {c.cep}
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Frete</dt>
              <dd>{c.frete !== undefined ? preco(c.frete) : c.entrega === "motoboy" || c.entrega === "correios" ? "A combinar" : "—"}</dd>
            </div>
            <div>
              <dt>Pagamento</dt>
              <dd>{c.pagamento === "cartao" ? "Cartão de crédito" : "Pix"}</dd>
            </div>
          </dl>
        ) : (
          <p className={s.vazio}>Este pedido foi feito antes de o site guardar os dados da cliente.</p>
        )}

        <fieldset className={s.mudarStatus}>
          <legend>Situação do pedido</legend>
          <div className="escolhas">
            {(["preparar", "enviado", "entregue"] as const).map((st) => (
              <label key={st} className="escolha">
                <input type="radio" name={`status-${pedido.codigo}`} checked={status === st} onChange={() => mudarStatusPedido(pedido.codigo, st)} />
                <span>{rotuloStatus(st, retirada)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}
