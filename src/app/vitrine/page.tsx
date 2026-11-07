import type { Metadata } from "next";
import { ListaVitrine } from "@/components/listas/ListaVitrine";

export const metadata: Metadata = {
  title: "Vitrine",
  description: "Peças únicas à venda agora. Ao reservar, a peça fica guardada só para você.",
};

export default function PaginaVitrine() {
  return <ListaVitrine />;
}
