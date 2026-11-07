"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { House, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { Assinatura } from "./Marca";
import { useLoja } from "@/lib/store";
import { useConta } from "@/lib/conta";
import { tempo } from "@/lib/formato";
import { AVISO_FIM_RESERVA_MS } from "@/lib/regras";
import s from "./Cabecalho.module.css";

const LINKS = [
  { href: "/vitrine", rotulo: "Vitrine" },
  { href: "/acervo", rotulo: "Acervo" },
  { href: "/encomenda", rotulo: "Encomende a sua" },
  { href: "/#renata", rotulo: "Quem faz" },
];

export function Cabecalho() {
  const caminho = usePathname();
  const { minhasReservas, agora, pronto } = useLoja();
  const [aberto, setAberto] = useState(false);
  const conta = useConta();

  useEffect(() => setAberto(false), [caminho]);

  const qtd = pronto ? minhasReservas.length : 0;
  const proxima = minhasReservas[0];
  const falta = proxima ? proxima.reservadaAte - agora : 0;
  const urgente = qtd > 0 && falta < AVISO_FIM_RESERVA_MS;

  return (
    <header className={s.cabecalho}>
      <div className={`envoltorio ${s.barra}`}>
        <Link href="/" className={s.marca} aria-label="Renata Ferré Jóias, página inicial">
          <Assinatura />
        </Link>

        {/* Fabiana: atalho para a página inicial, ao lado da logo */}
        <Link
          href="/"
          className={s.inicio}
          aria-label="Página inicial"
          aria-current={caminho === "/" ? "page" : undefined}
          title="Página inicial"
        >
          <House size={20} strokeWidth={1.5} aria-hidden />
        </Link>

        <nav className={s.nav} aria-label="Principal" data-aberto={aberto || undefined} id="menu-principal">
          <ul>
            {LINKS.map((l) => {
              const ativo = l.href !== "/#renata" && caminho.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} aria-current={ativo ? "page" : undefined}>
                    {l.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.acoes}>
          {/* Ana: conta da cliente */}
          <Link
            href="/conta"
            className={s.conta}
            aria-current={caminho === "/conta" ? "page" : undefined}
            aria-label={conta ? `Minha conta, ${conta.nome.split(" ")[0]}` : "Criar conta"}
          >
            <UserRound size={20} strokeWidth={1.5} aria-hidden />
            <span className={s.contaTexto}>{conta ? conta.nome.split(" ")[0] : "Criar conta"}</span>
          </Link>
          <Link
            href="/sacola"
            className={s.sacola}
            data-urgente={urgente || undefined}
            aria-label={
              qtd === 0
                ? "Sacola vazia"
                : `Sacola: ${qtd} ${qtd === 1 ? "peça reservada" : "peças reservadas"}, a primeira expira em ${tempo(falta)}`
            }
          >
            <ShoppingBag size={20} strokeWidth={1.5} aria-hidden />
            {qtd > 0 && (
              <>
                <span className={s.qtd}>{qtd}</span>
                <span className={`${s.timer} numero`} aria-hidden>
                  {tempo(falta)}
                </span>
              </>
            )}
          </Link>
          <button
            type="button"
            className={s.menu}
            aria-expanded={aberto}
            aria-controls="menu-principal"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <X size={22} strokeWidth={1.5} aria-hidden /> : <Menu size={22} strokeWidth={1.5} aria-hidden />}
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
