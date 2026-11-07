"use client";

import { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { useLoja } from "@/lib/store";
import s from "./Demonstracao.module.css";

/**
 * Painel só para apresentar as regras sem back-end: simula o que outras
 * clientes fariam ao mesmo tempo. Remover quando a loja for ao ar.
 */
export function Demonstracao() {
  const { demo } = useLoja();
  const [aberto, setAberto] = useState(false);
  const [msg, setMsg] = useState("");

  function rodar(acao: () => string | null | void, ok: (r: string) => string, vazio: string) {
    const r = acao();
    setMsg(typeof r === "string" ? ok(r) : r === null ? vazio : ok(""));
  }

  return (
    <div className={s.demo}>
      {aberto && (
        <div className={s.painel} role="dialog" aria-label="Modo demonstração">
          <div className={s.topo}>
            <p className={s.titulo}>Modo demonstração</p>
            <button type="button" className={s.fechar} onClick={() => setAberto(false)}>
              <X size={18} aria-hidden />
              <span className="sr-only">Fechar</span>
            </button>
          </div>
          <p className={s.explica}>Sem back-end, estes botões fazem o papel de outras clientes comprando ao mesmo tempo que você.</p>
          <div className={s.botoes}>
            <button type="button" onClick={() => rodar(demo.outraReserva, (n) => `Outra cliente reservou: ${n}.`, "Não há peça disponível para reservar.")}>
              Outra cliente reserva uma peça
            </button>
            <button type="button" onClick={() => rodar(demo.outraCompra, (n) => `Outra cliente pagou: ${n}. Foi para o acervo.`, "Nenhuma peça está reservada por outra cliente.")}>
              Outra cliente paga a reserva dela
            </button>
            <button type="button" onClick={() => rodar(demo.expirarMinhas, () => "Suas reservas expiraram e as peças voltaram para a vitrine.", "")}>
              Expirar minhas reservas agora
            </button>
            <button type="button" onClick={() => rodar(demo.restaurar, () => "Loja restaurada ao estado inicial.", "")}>
              Restaurar a loja
            </button>
          </div>
          <p className={s.msg} role="status" aria-live="polite">{msg}</p>
        </div>
      )}
      <button type="button" className={s.gatilho} aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
        <FlaskConical size={16} strokeWidth={1.6} aria-hidden />
        <span className={s.gatilhoTexto}>Demonstração</span>
      </button>
    </div>
  );
}
