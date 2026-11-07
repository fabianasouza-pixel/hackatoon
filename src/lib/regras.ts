/** Regras de negócio das peças únicas. Mudar aqui muda o site inteiro. */

/** Tempo que uma peça fica guardada para quem a colocou na sacola. */
export const RESERVA_MINUTOS = 20;
export const RESERVA_MS = RESERVA_MINUTOS * 60 * 1000;

/** Quantas peças uma cliente pode segurar ao mesmo tempo (evita "segurar a vitrine"). */
export const MAX_RESERVAS_POR_CLIENTE = 3;

/** Abaixo disso a sacola avisa que a reserva está acabando. */
export const AVISO_FIM_RESERVA_MS = 2 * 60 * 1000;
