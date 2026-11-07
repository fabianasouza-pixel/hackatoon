"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Peca } from "@/data/pecas";
import s from "./FotoPeca.module.css";

type Props = {
  peca: Peca;
  /** Peça vendida (acervo): sem o reflexo de vidro da vitrine. */
  arquivo?: boolean;
  prioridade?: boolean;
  sizes?: string;
  /** "livre": sem proporção fixa, a foto ocupa a altura que o pai der (recorte em cover). */
  proporcao?: "retrato" | "quadrado" | "alta" | "livre";
  className?: string;
  children?: React.ReactNode;
};

/** Foto da peça dentro de uma vitrine: moldura de ouro envelhecido e reflexo de vidro que segue o ponteiro. */
export function FotoPeca({ peca, arquivo, prioridade, sizes = "(max-width: 800px) 100vw, 50vw", proporcao = "retrato", className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const quadro = useRef(0);

  function mover(e: React.PointerEvent) {
    if (arquivo || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(quadro.current);
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    quadro.current = requestAnimationFrame(() => {
      el.style.setProperty("--lx", `${x}%`);
      el.style.setProperty("--ly", `${y}%`);
    });
  }

  return (
    <div
      ref={ref}
      className={`${s.vitrine} ${className ?? ""}`}
      data-arquivo={arquivo || undefined}
      data-proporcao={proporcao}
      onPointerMove={mover}
    >
      <div className={s.foto}>
        <Image
          src={peca.foto.src}
          alt={peca.foto.alt}
          fill
          sizes={sizes}
          priority={prioridade}
          style={{ objectFit: "cover", objectPosition: peca.foto.foco ?? "50% 50%" }}
        />
        <span className={s.vidro} aria-hidden />
        {children}
      </div>
    </div>
  );
}
