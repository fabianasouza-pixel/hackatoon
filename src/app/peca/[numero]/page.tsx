import type { Metadata } from "next";
import { PECAS, buscarPeca } from "@/data/pecas";
import { DetalhePeca } from "@/components/peca/DetalhePeca";

type Props = { params: Promise<{ numero: string }> };

export function generateStaticParams() {
  return PECAS.map((p) => ({ numero: p.numero }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const peca = buscarPeca((await params).numero);
  if (!peca) return { title: "Peça" };
  return { title: `${peca.nome} · Nº ${peca.numero}`, description: peca.descricao };
}

export default async function PaginaPeca({ params }: Props) {
  // Peças da área da vendedora ficam no navegador; o componente resolve no cliente
  const { numero } = await params;
  return <DetalhePeca numero={numero} />;
}
