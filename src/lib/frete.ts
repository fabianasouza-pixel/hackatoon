/**
 * Frete por distância em linha reta (raio) a partir do ateliê.
 *
 * ⚠️ CONFIRMAR COM A RENATA: o ponto de saída (ORIGEM) e todos os valores
 * abaixo são provisórios. Basta trocar aqui que o checkout inteiro atualiza.
 */

/** Ponto de saída das entregas. Provisório: Praça da Sé, São Paulo. */
export const ORIGEM = { lat: -23.5505, lon: -46.6333 };

export type Faixa = { ateKm: number; valor: number; prazo: string };

/** Motoboy: só dentro do raio da última faixa. */
export const FAIXAS_MOTOBOY: Faixa[] = [
  { ateKm: 5, valor: 15, prazo: "No mesmo dia" },
  { ateKm: 10, valor: 25, prazo: "No mesmo dia" },
  { ateKm: 20, valor: 38, prazo: "Até o dia seguinte" },
  { ateKm: 30, valor: 55, prazo: "Até o dia seguinte" },
];

/** Correios: para qualquer distância. */
export const FAIXAS_CORREIOS: Faixa[] = [
  { ateKm: 100, valor: 22, prazo: "2 a 4 dias úteis" },
  { ateKm: 500, valor: 32, prazo: "3 a 6 dias úteis" },
  { ateKm: 1500, valor: 45, prazo: "5 a 9 dias úteis" },
  { ateKm: Infinity, valor: 58, prazo: "7 a 12 dias úteis" },
];

export type ModoEntrega = "motoboy" | "correios";

export function faixaPara(modo: ModoEntrega, km: number): Faixa | null {
  const faixas = modo === "motoboy" ? FAIXAS_MOTOBOY : FAIXAS_CORREIOS;
  return faixas.find((f) => km <= f.ateKm) ?? null;
}

export const RAIO_MOTOBOY_KM = FAIXAS_MOTOBOY[FAIXAS_MOTOBOY.length - 1].ateKm;

/** "até 5 km", "5 a 10 km", "acima de 1500 km" */
export function rotuloFaixa(faixas: Faixa[], i: number) {
  const de = i === 0 ? 0 : faixas[i - 1].ateKm;
  const ate = faixas[i].ateKm;
  if (ate === Infinity) return `Acima de ${de.toLocaleString("pt-BR")} km`;
  return de === 0 ? `Até ${ate.toLocaleString("pt-BR")} km` : `${de.toLocaleString("pt-BR")} a ${ate.toLocaleString("pt-BR")} km`;
}

function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export type Endereco = { rua: string; bairro: string; cidade: string; uf: string };

export type ResultadoCep =
  | { ok: true; endereco: Endereco; km: number | null }
  | { ok: false; erro: "nao-encontrado" | "rede" };

/**
 * CEP → endereço (BrasilAPI) → coordenada da rua (Photon, OpenStreetMap) → distância do ateliê.
 * `km` fica null quando não dá para localizar a rua; aí o frete é combinado pelo WhatsApp.
 */
export async function consultarCep(cep: string, sinal?: AbortSignal): Promise<ResultadoCep> {
  const digitos = cep.replace(/\D/g, "");
  let endereco: Endereco;
  try {
    const r = await fetch(`https://brasilapi.com.br/api/cep/v2/${digitos}`, { signal: sinal });
    if (r.status === 404) return { ok: false, erro: "nao-encontrado" };
    if (!r.ok) return { ok: false, erro: "rede" };
    const d = await r.json();
    endereco = { rua: d.street ?? "", bairro: d.neighborhood ?? "", cidade: d.city ?? "", uf: d.state ?? "" };
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    return { ok: false, erro: "rede" };
  }

  let km: number | null = null;
  try {
    const busca = [endereco.rua, endereco.bairro, endereco.cidade, endereco.uf, "Brasil"].filter(Boolean).join(", ");
    const url = `https://photon.komoot.io/api/?limit=1&lat=${ORIGEM.lat}&lon=${ORIGEM.lon}&q=${encodeURIComponent(busca)}`;
    const r = await fetch(url, { signal: sinal });
    if (r.ok) {
      const d = await r.json();
      const coord = d.features?.[0]?.geometry?.coordinates as [number, number] | undefined;
      if (coord) km = distanciaKm(ORIGEM, { lon: coord[0], lat: coord[1] });
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
  }
  return { ok: true, endereco, km };
}
