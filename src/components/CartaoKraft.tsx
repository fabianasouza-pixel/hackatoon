import type { Peca } from "@/data/pecas";
import { CATEGORIAS } from "@/data/pecas";
import s from "./CartaoKraft.module.css";

type Props = {
  peca: Peca;
  tamanho?: "grande" | "pequeno";
  comoTitulo?: "h1" | "h2" | "h3";
  children?: React.ReactNode;
  className?: string;
};

/** Ficha da peça: número, nome e materiais, em tipografia limpa (sem papel). */
export function CartaoKraft({ peca, tamanho = "grande", comoTitulo = "h2", children, className }: Props) {
  const Titulo = comoTitulo;
  const categoria = CATEGORIAS.find((c) => c.id === peca.categoria)?.nome;
  return (
    <div className={`${s.cartao} ${className ?? ""}`} data-tamanho={tamanho}>
      <p className={`${s.numero} numero`}>
        <span className="sr-only">Peça número </span>Nº {peca.numero} <span aria-hidden>·</span> {categoria}
      </p>
      <Titulo className={s.nome}>{peca.nome}</Titulo>
      <p className={s.materiais}>{peca.materiais.join(", ")}</p>
      {children}
    </div>
  );
}
