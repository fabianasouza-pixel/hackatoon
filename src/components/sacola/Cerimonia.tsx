"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLoja, type Pedido } from "@/lib/store";
import { preco } from "@/lib/formato";
import { linkWhatsapp } from "@/lib/contato";
import s from "./Cerimonia.module.css";

/** Pagamento confirmado: a peça comprada em tela inteira e os próximos passos. */
export function Cerimonia({ pedido }: { pedido: Pedido }) {
  const { buscar } = useLoja();
  const titulo = useRef<HTMLHeadingElement>(null);
  const [visivel, setVisivel] = useState(false);

  const pecas = pedido.numeros.map((n) => buscar(n)).filter((p) => p !== undefined);
  const itens = pedido.itens ?? pecas.map((p) => ({ numero: p.numero, nome: p.nome, preco: p.preco }));
  const varias = itens.length > 1;
  const primeiroNome = pedido.cliente?.nome.split(" ")[0];
  const entrega = pedido.cliente?.entrega;
  const frete = pedido.cliente?.frete;

  const mensagem = `Olá, Renata! Acabei de comprar ${itens.map((i) => `${i.nome} (nº ${i.numero})`).join(", ")}. Pedido ${pedido.codigo}.`;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    titulo.current?.focus();
    const t = window.setTimeout(() => setVisivel(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className={s.tela} aria-labelledby="titulo-confirmado" data-sangra-rodape>
      <div className={s.fundo} aria-hidden data-qtd={Math.min(pecas.length, 3)}>
        {pecas.slice(0, 3).map((p, i) => (
          <div key={p.numero} className={s.fundoFoto}>
            <Image src={p.foto.src} alt="" fill priority={i === 0} sizes={pecas.length > 1 ? "34vw" : "100vw"} style={{ objectPosition: p.foto.foco }} />
          </div>
        ))}
      </div>

      <div className={s.coluna} data-visivel={visivel || undefined}>
        <p className={`${s.codigo} numero`}>Pedido {pedido.codigo}</p>
        <h1 id="titulo-confirmado" ref={titulo} tabIndex={-1}>
          {varias ? "Agora elas são suas" : "Agora ela é sua"}
          {primeiroNome ? `, ${primeiroNome}` : ""}.
        </h1>
        <p className={s.lede}>
          Pagamento confirmado.{" "}
          {entrega === "motoboy"
            ? "A Renata avisa pelo WhatsApp quando o motoboy sair."
            : entrega === "retirada"
              ? "A Renata vai combinar a retirada com você pelo WhatsApp."
              : "A Renata manda o código de rastreio pelo WhatsApp quando a peça for postada."}
        </p>

        <ul className={s.resumo}>
          {itens.map((i) => (
            <li key={i.numero}>
              <span>
                {i.nome} <span className={`${s.num} numero`}>Nº {i.numero}</span>
              </span>
              <span className="numero">{preco(i.preco)}</span>
            </li>
          ))}
          {(entrega === "motoboy" || entrega === "correios") && (
            <li>
              <span>Frete · {entrega === "motoboy" ? "Motoboy" : "Correios"}</span>
              <span className={frete !== undefined ? "numero" : undefined}>{frete !== undefined ? preco(frete) : "A combinar"}</span>
            </li>
          )}
          {(varias || frete !== undefined) && (
            <li className={s.total}>
              <span>Total</span>
              <span className="numero">{preco(pedido.total)}</span>
            </li>
          )}
        </ul>

        <div className={s.acoes}>
          <a className="botao botao--areia botao--largo" href={linkWhatsapp(mensagem)} target="_blank" rel="noopener noreferrer">
            Falar com a Renata no WhatsApp
          </a>
          <Link href="/vitrine" className={`botao botao--largo ${s.secundario}`}>
            Comprar de novo
          </Link>
        </div>

        <Link href="/acervo" className={s.link}>
          Ver {varias ? "as peças" : "a peça"} no acervo
        </Link>
      </div>
    </section>
  );
}
