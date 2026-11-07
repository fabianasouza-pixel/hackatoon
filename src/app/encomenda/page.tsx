import type { Metadata } from "next";
import { FormEncomenda } from "@/components/encomenda/FormEncomenda";

export const metadata: Metadata = {
  title: "Encomende a sua",
  description: "Conte sua ideia e a Renata Ferré cria uma joia única para você.",
};

export default async function PaginaEncomenda({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return <FormEncomenda referenciaInicial={ref} />;
}
