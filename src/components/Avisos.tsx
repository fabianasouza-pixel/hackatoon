"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLoja } from "@/lib/store";
import { AVISO_FIM_RESERVA_MS } from "@/lib/regras";
import { tempo } from "@/lib/formato";
import s from "./Avisos.module.css";

/** Avisos de reserva: faltando pouco tempo e reserva expirada. */
export function Avisos() {
  const { avisos, dispensarAviso, minhasReservas, agora, registro, reservar, buscar } = useLoja();
  const avisadas = useRef(new Set<string>());
  const [acabando, setAcabando] = useState<string | null>(null);

  useEffect(() => {
    const prox = minhasReservas.find((r) => r.reservadaAte - agora < AVISO_FIM_RESERVA_MS);
    if (prox && !avisadas.current.has(prox.peca.numero)) {
      avisadas.current.add(prox.peca.numero);
      setAcabando(prox.peca.numero);
    }
    if (acabando && !minhasReservas.some((r) => r.peca.numero === acabando)) setAcabando(null);
  }, [minhasReservas, agora, acabando]);

  const reservaAcabando = minhasReservas.find((r) => r.peca.numero === acabando);

  if (!avisos.length && !reservaAcabando) return null;

  return (
    <div className={s.pilha} role="region" aria-label="Avisos da sacola" aria-live="polite">
      {reservaAcabando && (
        <div className={s.aviso} data-tipo="acabando">
          <p>
            Faltam <strong className="numero">{tempo(reservaAcabando.reservadaAte - agora)}</strong> para a reserva de{" "}
            <em>{reservaAcabando.peca.nome}</em> acabar.
          </p>
          <div className={s.linha}>
            <Link href="/sacola" className={s.acao}>Finalizar agora</Link>
            <button type="button" className={s.fechar} onClick={() => setAcabando(null)}>
              <X size={16} aria-hidden />
              <span className="sr-only">Dispensar aviso</span>
            </button>
          </div>
        </div>
      )}
      {avisos.map((a) => {
        const peca = buscar(a.numero);
        if (!peca) return null;
        const livre = registro(a.numero).situacao === "disponivel";
        return (
          <div key={a.id} className={s.aviso}>
            <p>
              Sua reserva de <em>{peca.nome}</em> expirou e a peça voltou para a vitrine.
            </p>
            <div className={s.linha}>
              {livre ? (
                <button type="button" className={s.acao} onClick={() => reservar(a.numero)}>
                  Reservar de novo
                </button>
              ) : (
                <span className={s.nota}>Outra cliente já reservou.</span>
              )}
              <button type="button" className={s.fechar} onClick={() => dispensarAviso(a.id)}>
                <X size={16} aria-hidden />
                <span className="sr-only">Dispensar aviso</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
