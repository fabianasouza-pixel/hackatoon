"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLoja } from "@/lib/store";
import { dataExtensa } from "@/lib/formato";
import { FotoPeca } from "../FotoPeca";
import { CartaoKraft } from "../CartaoKraft";
import { AcoesReserva } from "../AcoesReserva";
import { CartaoPeca } from "../CartaoPeca";
import s from "./Home.module.css";

function useVitrine() {
  const { registro, catalogo } = useLoja();
  const aVenda = catalogo.filter((p) => registro(p.numero).situacao !== "vendida");
  // Destaque: a mais nova que ainda pode ser reservada
  const destaque = aVenda.find((p) => registro(p.numero).situacao === "disponivel") ?? aVenda[0];
  return { aVenda, destaque, outras: aVenda.filter((p) => p !== destaque) };
}

/** Vitrine de hoje: destaque + as demais peças à venda, numa seção só. */
export function VitrineDoDia() {
  const { destaque, outras } = useVitrine();
  const hoje = dataExtensa(new Date());

  return (
    <section id="hoje" className={`envoltorio ${s.hero}`} aria-labelledby="titulo-hoje">
      <div className={s.heroTitulo}>
        <div>
          <p className={s.heroData} suppressHydrationWarning>
            {hoje}
          </p>
          <h2 id="titulo-hoje">Na vitrine hoje</h2>
        </div>
      </div>

      {destaque ? (
        <>
          <div className={s.heroPeca}>
            <Link href={`/peca/${destaque.numero}`} className={s.heroFoto} aria-label={`Ver detalhes: ${destaque.nome}`}>
              <FotoPeca peca={destaque} prioridade proporcao="livre" sizes="(max-width: 900px) 100vw, 60vw" />
            </Link>
            <CartaoKraft peca={destaque} className={s.heroCartao}>
              <p className={s.heroDescricao}>{destaque.descricao}</p>
              <AcoesReserva peca={destaque} />
            </CartaoKraft>
          </div>

          {outras.length > 0 && (
            <div className={s.outras}>
              <div className={s.trilho}>
                {outras.map((p) => (
                  <CartaoPeca key={p.numero} peca={p} />
                ))}
              </div>
              <Link href="/vitrine" className="link-seta">
                Ver toda a vitrine <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className={s.vazia}>
          <p>A vitrine está vazia agora. Novas peças entram assim que saem da bancada.</p>
          <div className={s.vaziaAcoes}>
            <Link href="/acervo" className="botao botao--contorno">Ver o acervo</Link>
            <Link href="/encomenda" className="botao">Encomendar a sua</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function JaTemDona() {
  const { vendidas } = useLoja();
  const lista = vendidas().slice(0, 4);
  if (!lista.length) return null;
  return (
    <section className={`envoltorio ${s.acervo}`} aria-labelledby="titulo-acervo">
      <div className={s.secaoTopo}>
        <div>
          <h2 id="titulo-acervo">Do acervo da Renata</h2>
        </div>
        <Link href="/acervo" className="link-seta">
          Ver o acervo <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
        </Link>
      </div>
      <div className={s.gradeAcervo}>
        {lista.map(({ peca }) => (
          <CartaoPeca key={peca.numero} peca={peca} sizes="(max-width: 700px) 45vw, 22vw" />
        ))}
      </div>
    </section>
  );
}
