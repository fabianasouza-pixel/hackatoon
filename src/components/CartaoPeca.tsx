"use client";

import Link from "next/link";
import type { Peca } from "@/data/pecas";
import { useLoja } from "@/lib/store";
import { preco } from "@/lib/formato";
import { FotoPeca } from "./FotoPeca";
import { CartaoKraft } from "./CartaoKraft";
import { EstadoPeca } from "./EstadoPeca";
import s from "./CartaoPeca.module.css";

/** Item de grade: foto da peça com a ficha logo abaixo. */
export function CartaoPeca({ peca, sizes }: { peca: Peca; sizes?: string }) {
  const { registro } = useLoja();
  const r = registro(peca.numero);
  const vendida = r.situacao === "vendida";

  return (
    <article className={s.item} data-vendida={vendida || undefined}>
      <Link href={`/peca/${peca.numero}`} className={s.link}>
        <span className="sr-only">Ver {peca.nome}</span>
      </Link>
      <FotoPeca peca={peca} arquivo={vendida} sizes={sizes ?? "(max-width: 700px) 85vw, (max-width: 1100px) 45vw, 30vw"} />
      <CartaoKraft peca={peca} tamanho="pequeno" comoTitulo="h3" className={s.etiqueta}>
        {/* No acervo a peça só é exposta: sem valor, sem data */}
        {!vendida && (
          <div className={s.rodape}>
            <span className={`${s.preco} numero`}>{preco(peca.preco)}</span>
            <EstadoPeca numero={peca.numero} compacto />
          </div>
        )}
      </CartaoKraft>
    </article>
  );
}
