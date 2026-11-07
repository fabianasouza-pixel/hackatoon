import s from "./Carimbo.module.css";

function mesCurto(iso: string) {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(" de ", " ").replace(".", "");
}

/** Carimbo marsala de acervo, batido no cartão kraft quando a peça é vendida. */
export function Carimbo({ numero, vendidaEm, animar = false, tamanho = "normal" }: { numero: string; vendidaEm?: string; animar?: boolean; tamanho?: "normal" | "pequeno" }) {
  return (
    <span className={s.carimbo} data-animar={animar || undefined} data-tamanho={tamanho}>
      <span className={s.linha1}>Acervo</span>
      <span className={`${s.linha2} numero`}>
        <span className="sr-only">vendida em </span>
        {vendidaEm ? mesCurto(vendidaEm) : `Nº ${numero}`}
      </span>
    </span>
  );
}
