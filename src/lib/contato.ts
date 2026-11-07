/** Contato da Renata. WhatsApp só com dígitos: 55 + DDD + número. */
export const WHATSAPP_RENATA = "5511981405192";

export const INSTAGRAM_RENATA = "renata.ferre.joias";
export const LINK_INSTAGRAM = `https://www.instagram.com/${INSTAGRAM_RENATA}/`;

/** "5511912345678" → "(11) 91234-5678" */
export function formatarWhatsapp(digitos: string) {
  const d = digitos.replace(/\D/g, "").replace(/^55/, "");
  if (d.length < 10) return d;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  const corte = resto.length - 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export function linkWhatsapp(mensagem: string, numero = WHATSAPP_RENATA) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
