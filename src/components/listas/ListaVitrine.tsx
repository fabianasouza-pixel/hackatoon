"use client";

import Link from "next/link";
import { useState } from "react";
import type { Categoria } from "@/data/pecas";
import { useLoja } from "@/lib/store";
import { CartaoPeca } from "../CartaoPeca";
import { Filtros } from "./Filtros";
import s from "./Listas.module.css";

type Ordem = "recentes" | "menor" | "maior";

export function ListaVitrine() {
  const { registro, catalogo } = useLoja();
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [ordem, setOrdem] = useState<Ordem>("recentes");

  const aVenda = catalogo.filter((p) => registro(p.numero).situacao !== "vendida");
  const contagem = aVenda.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.categoria]: (acc[p.categoria] ?? 0) + 1 }), {});
  const lista = aVenda
    .filter((p) => categoria === "todas" || p.categoria === categoria)
    .sort((a, b) =>
      ordem === "menor" ? a.preco - b.preco : ordem === "maior" ? b.preco - a.preco : b.publicadaEm.localeCompare(a.publicadaEm) || b.numero.localeCompare(a.numero),
    );
  const livres = aVenda.filter((p) => registro(p.numero).situacao === "disponivel").length;

  return (
    <>
      <header className={`envoltorio cabeca-pagina ${s.cabeca}`}>
        <h1>Vitrine</h1>
        <p className="lede">
          <span className="numero">{livres}</span> {livres === 1 ? "peça disponível" : "peças disponíveis"} agora. Cada uma existe uma vez só: quando
          ganha dona, sai da vitrine.
        </p>
      </header>

      <div className={`envoltorio ${s.barra}`}>
        <Filtros valor={categoria} aoMudar={setCategoria} contagem={contagem} nome="categoria-vitrine" />
        <label className={s.ordem}>
          <span className="rotulo">Ordenar</span>
          <select className="entrada" value={ordem} onChange={(e) => setOrdem(e.target.value as Ordem)}>
            <option value="recentes">Mais recentes</option>
            <option value="menor">Menor preço</option>
            <option value="maior">Maior preço</option>
          </select>
        </label>
      </div>

      <div className="envoltorio">
        {lista.length ? (
          <div className={s.grade}>
            {lista.map((p) => (
              <CartaoPeca key={p.numero} peca={p} />
            ))}
          </div>
        ) : (
          <div className={s.vazio}>
            <p className={s.vazioTitulo}>Nenhuma peça desta categoria na vitrine agora.</p>
            <p>Veja as que já têm dona no acervo ou peça uma feita para você.</p>
            <div className={s.vazioAcoes}>
              <Link href="/acervo" className="botao botao--contorno">Ver o acervo</Link>
              <Link href="/encomenda" className="botao">Encomendar a sua</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
