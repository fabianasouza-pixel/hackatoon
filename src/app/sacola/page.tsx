import type { Metadata } from "next";
import { Sacola } from "@/components/sacola/Sacola";

export const metadata: Metadata = { title: "Sacola" };

export default function PaginaSacola() {
  return <Sacola />;
}
