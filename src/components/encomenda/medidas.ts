/**
 * Tabelas de medida usadas na encomenda.
 *
 * Aro (padrão brasileiro): o número do aro é a volta do dedo em milímetros
 * menos 40. Aro 10 = 50 mm de circunferência; aro 33 = 73 mm.
 * O diâmetro interno é a circunferência dividida por π.
 *
 * Bracelete: faixas de referência pela volta do pulso. Não há padrão único
 * entre marcas; a Renata confirma a medida antes de fazer a peça.
 */

export type Aro = { aro: number; circunferencia: number; diametro: number };

export const ARO_MIN = 10;
export const ARO_MAX = 30;

export const AROS: Aro[] = Array.from({ length: ARO_MAX - ARO_MIN + 1 }, (_, i) => {
  const aro = ARO_MIN + i;
  const circunferencia = aro + 40;
  return { aro, circunferencia, diametro: circunferencia / Math.PI };
});

export type TamanhoBracelete = { id: string; nome: string; pulso: string };

export const BRACELETES: TamanhoBracelete[] = [
  { id: "P", nome: "P", pulso: "14 a 15 cm" },
  { id: "M", nome: "M", pulso: "15,5 a 16,5 cm" },
  { id: "G", nome: "G", pulso: "17 a 18 cm" },
  { id: "GG", nome: "GG", pulso: "18,5 a 19,5 cm" },
];

export const mm = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: n % 1 ? 1 : 0 });
