const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function preco(valor: number) {
  return brl.format(valor);
}

export function tempo(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function dataLocal(iso: string) {
  // "2026-10-28" vira meia-noite local, não UTC
  return iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
}

export function data(iso: string) {
  return dataLocal(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function mesAno(iso: string) {
  return dataLocal(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

export function dataExtensa(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}
