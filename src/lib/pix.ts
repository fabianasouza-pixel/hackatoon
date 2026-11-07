/**
 * Pix "copia e cola" estático (padrão BR Code do Banco Central), com valor e identificador do pedido.
 *
 * ⚠️ CONFIRMAR COM A RENATA: a chave Pix abaixo é provisória (o WhatsApp dela).
 * Se a chave dela for CPF, e-mail ou aleatória, troque aqui antes de publicar o site.
 */
export const PIX = {
  chave: "+5511981405192",
  /** Até 25 letras, sem acento. */
  nome: "RENATA FERRE JOIAS",
  /** Até 15 letras, sem acento. */
  cidade: "SAO PAULO",
};

function campo(id: string, valor: string) {
  return id + String(valor.length).padStart(2, "0") + valor;
}

function semAcento(texto: string, max: number) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, max);
}

/** CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no fim do BR Code. */
function crc16(texto: string) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Código que o banco lê (no QR ou colado no app). `id` vira o identificador da transação. */
export function codigoPix(valor: number, id: string) {
  const conta = campo("00", "br.gov.bcb.pix") + campo("01", PIX.chave);
  const txid = id.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";
  const corpo =
    campo("00", "01") +
    campo("26", conta) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("54", valor.toFixed(2)) +
    campo("58", "BR") +
    campo("59", semAcento(PIX.nome, 25)) +
    campo("60", semAcento(PIX.cidade, 15)) +
    campo("62", campo("05", txid)) +
    "6304";
  return corpo + crc16(corpo);
}
