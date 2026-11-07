"use client";

/**
 * Conta da cliente, guardada só no navegador (DEMONSTRAÇÃO, sem back-end).
 * Quando houver servidor, troque `ler`/`gravar` por chamadas à API.
 */

import { useSyncExternalStore } from "react";

export type Conta = {
  nome: string;
  /** Só dígitos, com DDD: 11987654321 */
  whatsapp: string;
  email: string;
  /** AAAA-MM-DD */
  nascimento: string;
  indicacao: boolean;
  /** Quem indicou (só quando indicacao = true). */
  indicadaPor?: string;
  criadaEm: string;
};

const CHAVE = "rf-joias:conta";
const EVENTO = "rf-joias:conta-mudou";

function ler(): Conta | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Conta) : null;
  } catch {
    return null;
  }
}

let cache: { bruto: string | null; conta: Conta | null } = { bruto: null, conta: null };
function instantaneo(): Conta | null {
  let bruto: string | null = null;
  try {
    bruto = window.localStorage.getItem(CHAVE);
  } catch {}
  if (bruto !== cache.bruto) cache = { bruto, conta: ler() };
  return cache.conta;
}

function assinar(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener("storage", aviso);
  };
}

export function salvarConta(conta: Conta): boolean {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(conta));
    window.dispatchEvent(new Event(EVENTO));
    return true;
  } catch {
    return false;
  }
}

export function sairDaConta() {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

/** Conta atual; `undefined` enquanto o navegador ainda não carregou (servidor). */
export function useConta(): Conta | null | undefined {
  return useSyncExternalStore(assinar, instantaneo, () => undefined);
}

/** 11987654321 → (11) 98765-4321 */
export function formatarWhatsapp(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
