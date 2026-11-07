import type { Metadata } from "next";
import { AreaVendedora } from "@/components/vendedora/AreaVendedora";

export const metadata: Metadata = {
  title: "Área da vendedora",
  robots: { index: false, follow: false },
};

export default function PaginaVendedora() {
  return <AreaVendedora />;
}
