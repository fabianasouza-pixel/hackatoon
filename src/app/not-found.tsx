import Link from "next/link";

export default function NaoEncontrada() {
  return (
    <section className="envoltorio cabeca-pagina" style={{ minHeight: "50vh" }}>
      <h1>Peça não encontrada</h1>
      <p className="lede">Este número de registro não existe ou a página mudou de endereço.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <Link href="/vitrine" className="botao">Ver a vitrine</Link>
        <Link href="/acervo" className="botao botao--contorno">Ver o acervo</Link>
      </div>
    </section>
  );
}
