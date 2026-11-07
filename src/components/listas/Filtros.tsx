"use client";

import { CATEGORIAS, type Categoria } from "@/data/pecas";
import s from "./Listas.module.css";

export function Filtros({
  valor,
  aoMudar,
  contagem,
  nome,
}: {
  valor: Categoria | "todas";
  aoMudar: (c: Categoria | "todas") => void;
  contagem: Record<string, number>;
  nome: string;
}) {
  const total = Object.values(contagem).reduce((a, b) => a + b, 0);
  const opcoes = [{ id: "todas" as const, nome: "Todas" }, ...CATEGORIAS];
  return (
    <fieldset className={s.filtros}>
      <legend className="sr-only">Filtrar por categoria</legend>
      <div className="escolhas">
        {opcoes.map((o) => {
          const n = o.id === "todas" ? total : (contagem[o.id] ?? 0);
          return (
            <label key={o.id} className="escolha">
              <input type="radio" name={nome} value={o.id} checked={valor === o.id} onChange={() => aoMudar(o.id)} />
              <span>
                {o.nome} <span className={`${s.contagem} numero`}>{n}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
