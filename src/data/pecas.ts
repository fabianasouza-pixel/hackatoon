/**
 * Catálogo de DEMONSTRAÇÃO.
 * As fotos são reais (Renata Ferré), mas preços, medidas, pesos, datas e
 * quais peças estão vendidas são exemplos até termos os dados reais.
 */

export type Categoria = "colares" | "brincos" | "braceletes" | "aneis" | "rituais";

export const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: "colares", nome: "Colares" },
  { id: "brincos", nome: "Brincos" },
  { id: "braceletes", nome: "Braceletes" },
  { id: "aneis", nome: "Anéis" },
  /** Peças de axé: ferramentas de orixás e paramentas, feitas sob encomenda para rituais. */
  { id: "rituais", nome: "Ferramentas e paramentas" },
];

export type Peca = {
  /** Número de registro único da peça. Também é o endereço: /peca/058 */
  numero: string;
  nome: string;
  categoria: Categoria;
  materiais: string[];
  tecnica: string;
  medidas: string;
  peso: string;
  preco: number;
  descricao: string;
  foto: { src: string; alt: string; foco?: string };
  publicadaEm: string;
  /** Situação inicial vinda do "servidor" (mock). */
  situacaoInicial: "disponivel" | "vendida";
  vendidaEm?: string;
  /** Só para a demonstração: começa reservada por outra cliente por N minutos. */
  simularReservaDeOutraMin?: number;
};

export const PECAS: Peca[] = [
  {
    numero: "059",
    nome: "Brincos Laroyê",
    categoria: "brincos",
    materiais: ["Cobre"],
    tecnica: "Recorte, escovado e gravação letra a letra com punção",
    medidas: "Lâminas de 9 cm",
    peso: "14 g o par",
    preco: 320,
    descricao:
      "Duas lâminas longas de cobre escovado, gravadas letra por letra com a saudação Laroyê. Leves, balançam junto com o movimento do rosto.",
    foto: {
      src: "/pecas/brincos-laroye.jpg",
      alt: "Par de brincos longos de cobre escovado gravados com a palavra LAROYE, pendurados num expositor sobre um tronco de madeira, com novelos de sisal ao fundo",
      foco: "50% 40%",
    },
    publicadaEm: "2026-11-07",
    situacaoInicial: "disponivel",
  },
  {
    numero: "057",
    nome: "Anel Sankofa",
    categoria: "aneis",
    materiais: ["Latão"],
    tecnica: "Chapa martelada e recorte vazado",
    medidas: "Aro ajustável 16 a 20 · frente 4,5 cm",
    peso: "16 g",
    preco: 420,
    descricao:
      "Chapa larga de latão que abraça o dedo, com a espiral sankofa recortada na frente. Sankofa é o símbolo adinkra de voltar às raízes para seguir adiante.",
    foto: {
      src: "/pecas/anel-sankofa.jpg",
      alt: "Anel largo de latão com uma espiral sankofa recortada, usado na mão",
      foco: "50% 50%",
    },
    publicadaEm: "2026-11-07",
    situacaoInicial: "disponivel",
  },
  {
    numero: "056",
    nome: "Bracelete Raio",
    categoria: "braceletes",
    materiais: ["Cobre"],
    tecnica: "Cobre martelado e recortado",
    medidas: "Abertura ajustável · raio 6 cm",
    peso: "22 g",
    preco: 390,
    descricao:
      "Duas hastes de cobre se cruzam no pulso e se fecham num raio recortado. A superfície guarda as marcas do martelo.",
    foto: {
      src: "/pecas/bracelete-raio.jpg",
      alt: "Bracelete de cobre com um raio recortado, no pulso",
      foco: "50% 55%",
    },
    publicadaEm: "2026-11-07",
    situacaoInicial: "disponivel",
  },
  {
    numero: "055",
    nome: "Anel Búzio e Cobre",
    categoria: "aneis",
    materiais: ["Cobre", "Búzio natural"],
    tecnica: "Cobre martelado, búzio engastado",
    medidas: "Aro 18 · búzio 3 cm",
    peso: "12 g",
    preco: 280,
    descricao:
      "Um búzio grande, de brilho escuro, preso a uma chapa de cobre martelada com um recorte em degrau. Peça de presença, para usar sozinha.",
    foto: {
      src: "/pecas/anel-buzio-cobre.jpg",
      alt: "Anel de cobre martelado com um búzio grande, usado na mão",
      foco: "50% 40%",
    },
    publicadaEm: "2026-11-06",
    situacaoInicial: "disponivel",
    simularReservaDeOutraMin: 7,
  },
  {
    numero: "054",
    nome: "Brincos Lâmina",
    categoria: "brincos",
    materiais: ["Latão"],
    tecnica: "Latão martelado e recortado",
    medidas: "Comprimento 7 cm",
    peso: "9 g o par",
    preco: 240,
    descricao:
      "Triângulos de latão martelado, montados em camadas que se movem com o rosto. Saem do ateliê presos no cartão kraft da marca.",
    foto: {
      src: "/pecas/brincos-laminas.jpg",
      alt: "Brincos geométricos de latão martelado presos em cartões kraft da Renata Ferré, sobre uma fatia de madeira",
      foco: "50% 55%",
    },
    publicadaEm: "2026-11-06",
    situacaoInicial: "disponivel",
  },

  /* ---- Acervo: já vendidas ---- */
  {
    numero: "052",
    nome: "Anel Laroyê e Saravá",
    categoria: "aneis",
    materiais: ["Prata 925"],
    tecnica: "Chapa polida, gravação à mão",
    medidas: "Aro aberto ajustável",
    peso: "10 g",
    preco: 380,
    descricao:
      "Uma chapa que dá a volta no dedo e se cruza na frente, com Laroyê gravado numa ponta e Saravá na outra. Na foto, ainda na bancada da Renata.",
    foto: {
      src: "/pecas/anel-laroye-sarava.jpg",
      alt: "Anel aberto prateado com as palavras Laroyê e Saravá gravadas, no polegar, sobre a bancada de madeira",
      foco: "50% 55%",
    },
    publicadaEm: "2026-10-19",
    situacaoInicial: "vendida",
    vendidaEm: "2026-10-21",
  },
  {
    numero: "058",
    nome: "Colar Arco e Espelho",
    categoria: "rituais",
    materiais: ["Latão", "Aro de aço revestido"],
    tecnica: "Recorte e lixamento à mão",
    medidas: "Aro 44 cm · pingentes até 7 cm",
    peso: "38 g",
    preco: 680,
    descricao:
      "Um arco com flecha e um espelho recortados em latão pendem de um aro fino, separados por um guizo dourado. Os pingentes se movem soltos e batem de leve quando você anda.",
    foto: {
      src: "/pecas/colar-arco-espelho-estudio.jpg",
      alt: "Colar de aro fino com pingentes de latão em forma de arco e flecha e de espelho e um guizo no centro, sobre pedra escura e tecido",
      foco: "50% 60%",
    },
    publicadaEm: "2026-11-07",
    situacaoInicial: "vendida",
    vendidaEm: "2026-11-07",
  },
  {
    numero: "048",
    nome: "Paramenta de Cobre e Búzios",
    categoria: "rituais",
    materiais: ["Cobre", "Búzios", "Ráfia natural", "Miçangas", "Chifre"],
    tecnica: "Chapa de cobre, ráfia e búzios amarrados à mão",
    medidas: "Conjunto sob medida",
    peso: "Conjunto",
    preco: 1800,
    descricao:
      "Conjunto em cobre feito sob encomenda: coroa com franja de miçangas vermelhas, espada com cabo de chifre, um par de braceletes e um chifre com crina, todos arrematados com ráfia e búzios.",
    foto: {
      src: "/pecas/paramenta-cobre.jpg",
      alt: "Paramenta de cobre: coroa com franja de miçangas vermelhas sobre um busto, espada com cabo de chifre, dois braceletes e um chifre com crina, com ráfia e búzios",
      foco: "50% 40%",
    },
    publicadaEm: "2026-09-18",
    situacaoInicial: "vendida",
    vendidaEm: "2026-09-20",
  },
  {
    numero: "053",
    nome: "Braceletes Ninho",
    categoria: "braceletes",
    materiais: ["Cobre", "Ráfia natural", "Búzio"],
    tecnica: "Chapa de cobre, ráfia enrolada à mão",
    medidas: "Altura 5,5 cm · par",
    peso: "48 g o par",
    preco: 560,
    descricao:
      "Um par de braceletes largos de cobre. No centro de cada um, um búzio repousa num ninho de ráfia enrolada à mão.",
    foto: {
      src: "/pecas/braceletes-ninho.jpg",
      alt: "Dois braceletes largos de cobre com búzio cercado de ráfia natural",
      foco: "50% 45%",
    },
    publicadaEm: "2026-10-26",
    situacaoInicial: "vendida",
    vendidaEm: "2026-10-28",
  },
  {
    numero: "051",
    nome: "Bracelete Búzio Enlaçado",
    categoria: "braceletes",
    materiais: ["Cobre", "Fio de cobre", "Búzio"],
    tecnica: "Espiral de cobre, búzio amarrado com fio",
    medidas: "Espiral ajustável",
    peso: "26 g",
    preco: 360,
    descricao:
      "Uma fita de cobre que dá a volta no braço em espiral, com um búzio amarrado por fios de cobre na frente.",
    foto: {
      src: "/pecas/bracelete-enlacado.jpg",
      alt: "Bracelete em espiral de cobre com búzio amarrado com fio de cobre, apoiado numa cabaça",
      foco: "50% 40%",
    },
    publicadaEm: "2026-10-12",
    situacaoInicial: "vendida",
    vendidaEm: "2026-10-15",
  },
  {
    numero: "050",
    nome: "Bracelete Guardiã",
    categoria: "braceletes",
    materiais: ["Latão", "Búzios", "Fio de cobre"],
    tecnica: "Chapa larga de latão, búzios amarrados",
    medidas: "Altura 7 cm",
    peso: "54 g",
    preco: 640,
    descricao:
      "Chapa larga de latão escovado que cobre o pulso, com búzios amarrados nas pontas da abertura.",
    foto: {
      src: "/pecas/bracelete-guardia.jpg",
      alt: "Bracelete largo de latão com búzios nas pontas, usado no pulso pela Renata",
      foco: "45% 50%",
    },
    publicadaEm: "2026-10-01",
    situacaoInicial: "vendida",
    vendidaEm: "2026-10-03",
  },
  {
    numero: "049",
    nome: "Anéis Búzio Amarrado",
    categoria: "aneis",
    materiais: ["Cobre", "Búzio", "Conta de vidro"],
    tecnica: "Cobre recortado, búzios amarrados",
    medidas: "Aros 17 e 18 · dupla",
    peso: "14 g a dupla",
    preco: 300,
    descricao:
      "Uma dupla de anéis de cobre: um com búzio deitado, o outro com búzio e uma conta vermelha amarrados no alto.",
    foto: {
      src: "/pecas/aneis-buzio.jpg",
      alt: "Dois anéis de cobre com búzios, um deles com conta vermelha, ao lado de um cartão kraft Renata Ferré",
      foco: "50% 50%",
    },
    publicadaEm: "2026-09-27",
    situacaoInicial: "vendida",
    vendidaEm: "2026-09-30",
  },
  {
    numero: "047",
    nome: "Anel Oyá",
    categoria: "aneis",
    materiais: ["Cobre"],
    tecnica: "Cobre martelado, gravação à mão",
    medidas: "Aro 19 · largura 1,2 cm",
    peso: "8 g",
    preco: 220,
    descricao:
      "Aliança larga de cobre martelado com o nome Oyá gravado à mão. Na foto, ainda no tribulet da bancada, antes do acabamento.",
    foto: {
      src: "/pecas/anel-oya.jpg",
      alt: "Anel de cobre com a palavra OYA gravada, encaixado num tribulet de aço na bancada",
      foco: "50% 50%",
    },
    publicadaEm: "2026-09-10",
    situacaoInicial: "vendida",
    vendidaEm: "2026-09-12",
  },
];

export function buscarPeca(numero: string) {
  return PECAS.find((p) => p.numero === numero);
}
