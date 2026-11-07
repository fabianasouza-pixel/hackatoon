import type { Metadata } from "next";
import { MinhaConta } from "@/components/conta/MinhaConta";

export const metadata: Metadata = {
  title: "Minha conta",
  description: "Crie sua conta na Renata Ferré Jóias para receber novidades da vitrine.",
};

export default function PaginaConta() {
  return <MinhaConta />;
}
