"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLoja } from "@/lib/store";
import { preco, tempo } from "@/lib/formato";
import { MAX_RESERVAS_POR_CLIENTE, RESERVA_MS } from "@/lib/regras";
import type { Peca } from "@/data/pecas";
import { EstadoPeca } from "./EstadoPeca";
import { Carimbo } from "./Carimbo";
import s from "./AcoesReserva.module.css";

/** Preço, estado e o botão certo para cada situação da peça única. */
export function AcoesReserva({ peca }: { peca: Peca }) {
  const { registro, restante, reservar, liberar, pronto } = useLoja();
  const [erro, setErro] = useState<string | null>(null);
  const r = registro(peca.numero);
  const falta = restante(peca.numero);

  function aoReservar() {
    const res = reservar(peca.numero);
    if (res.ok) return setErro(null);
    setErro(
      res.erro === "limite"
        ? `Você já tem ${MAX_RESERVAS_POR_CLIENTE} peças guardadas na sacola. Finalize a compra ou libere uma delas para reservar esta.`
        : "Outra cliente reservou esta peça segundos antes de você. Se ela não pagar, a peça volta para a vitrine.",
    );
  }

  if (r.situacao === "vendida") {
    return (
      <div className={s.acoes}>
        <div className={s.linhaPreco}>
          <Carimbo numero={peca.numero} />
        </div>
        <p className={s.texto}>Esta peça já tem dona e não está mais à venda. A Renata pode criar uma peça nova com a mesma inspiração, só para você.</p>
        <Link className="botao botao--largo" href={`/encomenda?ref=${peca.numero}`}>
          Encomendar uma inspirada nesta
        </Link>
      </div>
    );
  }

  const minha = pronto && r.situacao === "reservada" && r.dona === "eu";
  const deOutra = pronto && r.situacao === "reservada" && r.dona === "outra";

  return (
    <div className={s.acoes}>
      <div className={s.linhaPreco}>
        <p className={`${s.preco} numero`}>{preco(peca.preco)}</p>
        <EstadoPeca numero={peca.numero} />
      </div>

      {minha && (
        <>
          <div className={s.barra} aria-hidden>
            <span style={{ transform: `scaleX(${falta / RESERVA_MS})` }} />
          </div>
          <p className={s.texto}>
            Guardada para você por mais <strong className="numero">{tempo(falta)}</strong>. Depois disso ela volta para a vitrine.
          </p>
          <Link className="botao botao--largo" href="/sacola">
            Finalizar compra <ArrowRight size={16} aria-hidden />
          </Link>
          <button type="button" className={s.secundario} onClick={() => liberar(peca.numero)}>
            Liberar peça para outra pessoa
          </button>
        </>
      )}

      {deOutra && (
        <>
          <button type="button" className="botao botao--largo" disabled>
            Reservada por outra cliente
          </button>
          <p className={s.texto}>
            Se o pagamento dela não for concluído em <strong className="numero">{tempo(falta)}</strong>, a peça volta para a vitrine e você poderá reservar.
          </p>
        </>
      )}

      {!minha && !deOutra && (
        <button type="button" className="botao botao--largo" onClick={aoReservar}>
          Reservar esta peça
        </button>
      )}

      {erro && (
        <p className={s.erro} role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
