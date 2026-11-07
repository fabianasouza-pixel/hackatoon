import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cinzel, Jost } from "next/font/google";
import { LojaProvider } from "@/lib/store";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { Avisos } from "@/components/Avisos";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Renata Ferré Jóias", template: "%s · Renata Ferré Jóias" },
  description: "Joias únicas feitas à mão por Renata Ferré, em latão, cobre e búzios. Peças únicas, com alma e raízes.",
};

export const viewport: Viewport = {
  themeColor: "#762c2d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${cinzel.variable} ${jost.variable}`}>
      <body>
        <LojaProvider>
          <a href="#conteudo" className="pular">Pular para o conteúdo</a>
          <Cabecalho />
          <main id="conteudo">{children}</main>
          <Rodape />
          <Avisos />
        </LojaProvider>
      </body>
    </html>
  );
}
