import type { Metadata } from "next";
import { ListaAcervo } from "@/components/listas/ListaAcervo";

export const metadata: Metadata = {
  title: "Acervo",
  description: "Peças da Renata Ferré que já têm dona. Inspiração para a sua encomenda.",
};

export default function PaginaAcervo() {
  return <ListaAcervo />;
}
