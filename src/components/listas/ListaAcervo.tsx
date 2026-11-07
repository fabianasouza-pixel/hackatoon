"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Categoria } from "@/data/pecas";
import { useLoja } from "@/lib/store";
import { CartaoPeca } from "../CartaoPeca";
import { Filtros } from "./Filtros";
import s from "./Listas.module.css";

export function ListaAcervo() {
  const { vendidas } = useLoja();
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const todas = vendidas();
  const contagem = todas.reduce<Record<string, number>>((acc, { peca }) => ({ ...acc, [peca.categoria]: (acc[peca.categoria] ?? 0) + 1 }), {});
  const lista = todas.filter(({ peca }) => categoria === "todas" || peca.categoria === categoria);

  return (
    <>
      <header className={`envoltorio cabeca-pagina ${s.cabeca}`}>
        <h1>Acervo</h1>
        <p className="lede">
          Peças que já encontraram dona. Não estão mais à venda: ficam aqui como memória do ateliê e como ponto de partida
          para a sua encomenda.
        </p>
      </header>

      <div className={`envoltorio ${s.barra}`}>
        <Filtros valor={categoria} aoMudar={setCategoria} contagem={contagem} nome="categoria-acervo" />
        <Link href="/encomenda" className="link-seta">
          Encomendar uma peça <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
        </Link>
      </div>

      <div className="envoltorio">
        {lista.length ? (
          <div className={`${s.grade} ${s.gradeAcervo}`}>
            {lista.map(({ peca }) => (
              <CartaoPeca key={peca.numero} peca={peca} sizes="(max-width: 700px) 45vw, (max-width: 1100px) 30vw, 22vw" />
            ))}
          </div>
        ) : (
          <div className={s.vazio}>
            <p className={s.vazioTitulo}>Nenhuma peça desta categoria no acervo ainda.</p>
            <div className={s.vazioAcoes}>
              <Link href="/vitrine" className="botao botao--contorno">Ver a vitrine</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
