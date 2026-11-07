"use client";

import { useLoja } from "@/lib/store";
import { tempo } from "@/lib/formato";
import { Buzio } from "./Marca";
import s from "./EstadoPeca.module.css";

/** Estado da peça sempre visível: disponível, reservada (com tempo) ou no acervo. */
export function EstadoPeca({ numero, compacto = false }: { numero: string; compacto?: boolean }) {
  const { registro, restante, pronto } = useLoja();
  const r = registro(numero);
  const falta = restante(numero);

  if (r.situacao === "vendida") {
    return (
      <p className={s.estado} data-estado="vendida">
        <span className={s.ponto} aria-hidden />
        No acervo
      </p>
    );
  }

  if (r.situacao === "reservada" && pronto) {
    const minha = r.dona === "eu";
    return (
      <p className={s.estado} data-estado={minha ? "minha" : "reservada"}>
        <span className={s.ponto} aria-hidden />
        {minha ? "Na sua sacola" : "Reservada"}
        <span className={`${s.tempo} numero`} role="timer" aria-label={`${tempo(falta)} restantes`}>
          {tempo(falta)}
        </span>
      </p>
    );
  }

  return (
    <p className={s.estado} data-estado="disponivel">
      <Buzio size={11} className={s.buzio} />
      Disponível{!compacto && " · peça única"}
    </p>
  );
}
