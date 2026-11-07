import Link from "next/link";
import { Assinatura } from "./Marca";
import { INSTAGRAM_RENATA, LINK_INSTAGRAM, WHATSAPP_RENATA, formatarWhatsapp } from "@/lib/contato";
import s from "./Rodape.module.css";

export function Rodape() {
  return (
    <footer className={s.rodape}>
      <div className="faixa" aria-hidden />
      <div className={`envoltorio ${s.grade}`}>
        <div className={s.marca}>
          <Assinatura />
          <p className={s.slogan}>Peças únicas, com alma e raízes.</p>
          <ul className={s.contato}>
            <li>
              WhatsApp{" "}
              <a href={`https://wa.me/${WHATSAPP_RENATA}`} target="_blank" rel="noopener noreferrer" className="numero">
                {formatarWhatsapp(WHATSAPP_RENATA)}
              </a>
            </li>
            <li>
              Instagram{" "}
              <a href={LINK_INSTAGRAM} target="_blank" rel="noopener noreferrer">
                @{INSTAGRAM_RENATA}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Rodapé" className={s.links}>
          <p className={s.titulo}>Loja</p>
          <ul>
            <li><Link href="/vitrine">Vitrine</Link></li>
            <li><Link href="/acervo">Acervo</Link></li>
            <li><Link href="/encomenda">Encomende a sua</Link></li>
            <li><Link href="/sacola">Sacola</Link></li>
          </ul>
        </nav>

        <div className={s.links}>
          <p className={s.titulo}>Como funciona</p>
          <ul>
            <li>Cada peça existe uma vez só.</li>
            <li>Na sacola, ela fica guardada só para você.</li>
            <li>Depois de vendida, ela vai para o acervo.</li>
          </ul>
        </div>
      </div>
      <div className={`envoltorio ${s.base}`}>
        <p>© {new Date().getFullYear()} Renata Ferré Jóias</p>
        <p><Link href="/vendedora">Área da vendedora</Link></p>
      </div>
    </footer>
  );
}
