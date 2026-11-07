"use client";

import Link from "next/link";
import { CATEGORIAS } from "@/data/pecas";
import { useLoja } from "@/lib/store";
import { data } from "@/lib/formato";
import { FotoPeca } from "../FotoPeca";
import { CartaoKraft } from "../CartaoKraft";
import { AcoesReserva } from "../AcoesReserva";
import { CartaoPeca } from "../CartaoPeca";
import s from "./DetalhePeca.module.css";

export function DetalhePeca({ numero }: { numero: string }) {
  const { registro, catalogo, buscar, pronto } = useLoja();
  const peca = buscar(numero);
  const r = registro(numero);
  if (!peca) {
    // Peça cadastrada pela vendedora: só existe depois de carregar o navegador
    if (!pronto) return null;
    return (
      <div className="envoltorio" style={{ paddingBlock: "4rem", display: "grid", gap: "1.25rem", justifyItems: "start" }}>
        <h1>Peça não encontrada</h1>
        <p>Ela pode ter sido removida da vitrine.</p>
        <Link href="/vitrine" className="botao">Ver a vitrine</Link>
      </div>
    );
  }
  const vendida = r.situacao === "vendida";
  const categoria = CATEGORIAS.find((c) => c.id === peca.categoria)?.nome;

  const outras = catalogo.filter((p) => p.numero !== numero && registro(p.numero).situacao !== "vendida").slice(0, 3);
  const parecidas = catalogo.filter((p) => p.numero !== numero && registro(p.numero).situacao === "vendida" && p.categoria === peca.categoria).slice(0, 3);

  return (
    <>
      <nav className={`envoltorio ${s.trilha}`} aria-label="Você está em">
        <Link href={vendida ? "/acervo" : "/vitrine"}>{vendida ? "Acervo" : "Vitrine"}</Link>
        <span aria-hidden>/</span>
        <span className="numero" aria-current="page">
          Nº {peca.numero}
        </span>
      </nav>

      <article className={`envoltorio ${s.peca}`}>
        <div className={s.foto}>
          <FotoPeca peca={peca} arquivo={vendida} prioridade proporcao="alta" sizes="(max-width: 900px) 100vw, 55vw" />
        </div>

        <div className={s.info}>
          <CartaoKraft peca={peca} comoTitulo="h1" className={s.cartao}>
            <AcoesReserva peca={peca} />
          </CartaoKraft>

          <section className={s.bloco} aria-labelledby="sobre">
            <h2 id="sobre">Sobre a peça</h2>
            <p>{peca.descricao}</p>
          </section>

          <section className={s.bloco} aria-labelledby="ficha">
            <h2 id="ficha">Ficha</h2>
            <dl className={s.ficha}>
              <dt>Registro</dt>
              <dd className="numero">Nº {peca.numero}</dd>
              <dt>Categoria</dt>
              <dd>{categoria}</dd>
              <dt>Materiais</dt>
              <dd>{peca.materiais.join(", ")}</dd>
              {peca.tecnica && (
                <>
                  <dt>Técnica</dt>
                  <dd>{peca.tecnica}</dd>
                </>
              )}
              {peca.medidas && (
                <>
                  <dt>Medidas</dt>
                  <dd className="numero">{peca.medidas}</dd>
                </>
              )}
              {peca.peso && (
                <>
                  <dt>Peso</dt>
                  <dd className="numero">{peca.peso}</dd>
                </>
              )}
              {!vendida && (
                <>
                  <dt>Na vitrine desde</dt>
                  <dd className="numero">{data(peca.publicadaEm)}</dd>
                </>
              )}
            </dl>
          </section>

          {!vendida && (
            <p className={s.regra}>
              Peça única, feita à mão: pequenas marcas e variações fazem parte dela. Ao reservar, ela fica guardada só para
              você enquanto finaliza a compra. Se o pagamento não for concluído a tempo, volta para a vitrine.
            </p>
          )}
        </div>
      </article>

      {vendida && parecidas.length > 0 && (
        <section className={`envoltorio ${s.mais}`} aria-labelledby="titulo-parecidas">
          <h2 id="titulo-parecidas">Mais {categoria?.toLowerCase()} do acervo</h2>
          <div className={s.maisGrade}>
            {parecidas.map((p) => (
              <CartaoPeca key={p.numero} peca={p} />
            ))}
          </div>
        </section>
      )}

      {outras.length > 0 && (
        <section className={`envoltorio ${s.mais}`} aria-labelledby="titulo-outras">
          <h2 id="titulo-outras">{vendida ? "À venda agora" : "Outras peças na vitrine"}</h2>
          <div className={s.maisGrade}>
            {outras.map((p) => (
              <CartaoPeca key={p.numero} peca={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
