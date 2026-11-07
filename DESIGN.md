---
name: Renata Ferré Jóias
description: Sala de exposição do acervo de peças únicas, com moldura de ouro envelhecido e etiqueta kraft.
colors:
  marsala: "#762c2d"
  marsala-escuro: "#5a1f21"
  terracota: "#a64f43"
  terracota-texto: "#784034"
  ouro: "#b47b45"
  ouro-claro: "#d2a670"
  areia: "#ebd5c2"
  areia-clara: "#f4e8dd"
  areia-funda: "#e1c5ab"
  kraft: "#d4af8e"
  terra: "#493126"
  terra-suave: "#6d5548"
typography:
  display:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "clamp(3.25rem, 9.5vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "clamp(2rem, 3.6vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
  button:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.2em"
  numero:
    fontFamily: "Jost, Futura, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.18em"
    fontFeature: "tnum, lnum"
rounded:
  raio: "2px"
  cartao: "3px"
  pilula: "100px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  largura: "1320px"
  cartao: "clamp(1.5rem, 3vw, 2.5rem)"
  secao: "clamp(4rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.marsala}"
    textColor: "{colors.areia}"
    typography: "{typography.button}"
    rounded: "{rounded.raio}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.marsala-escuro}"
  button-contorno:
    backgroundColor: "transparent"
    textColor: "{colors.marsala}"
    typography: "{typography.button}"
    rounded: "{rounded.raio}"
    padding: "0.9em 1.6em"
    height: "52px"
  button-contorno-hover:
    backgroundColor: "{colors.marsala}"
    textColor: "{colors.areia}"
  button-areia:
    backgroundColor: "{colors.areia}"
    textColor: "{colors.marsala}"
    typography: "{typography.button}"
    rounded: "{rounded.raio}"
    padding: "0.9em 1.6em"
    height: "52px"
  input:
    backgroundColor: "{colors.areia-clara}"
    textColor: "{colors.terra}"
    rounded: "{rounded.raio}"
    padding: "0.75rem 0.9rem"
    height: "50px"
  chip-escolha:
    backgroundColor: "transparent"
    textColor: "{colors.terra}"
    rounded: "{rounded.pilula}"
    padding: "0.55rem 1rem"
    height: "44px"
  chip-escolha-selecionada:
    backgroundColor: "{colors.marsala}"
    textColor: "{colors.areia}"
  cartao-kraft:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.terra}"
    rounded: "{rounded.cartao}"
    padding: "{spacing.cartao}"
  vitrine:
    backgroundColor: "{colors.areia-clara}"
    padding: "clamp(6px, 0.8vw, 10px)"
  cabecalho:
    backgroundColor: "{colors.marsala}"
    textColor: "{colors.areia}"
    height: "72px"
  rodape:
    backgroundColor: "{colors.terra}"
    textColor: "{colors.areia}"
---

# Design System: Renata Ferré Jóias

## Overview

**Creative North Star: "A Vitrine do Acervo"**

A loja é uma sala de exposição, não uma grade de e-commerce. Cada peça única aparece como obra: foto grande dentro de uma moldura chapada de ouro envelhecido com passe-partout areia-clara, e ao lado ou logo abaixo o cartão kraft da própria peça, com Nº de registro, nome em Bodoni itálico, materiais, preço e estado. As paredes são areia com um grão leve de argila; o cabeçalho é uma faixa marsala; o rodapé fecha em marrom terra. A paleta usa só as cinco cores do manual e misturas entre elas.

A densidade é de galeria: poucas peças por linha, muito ar, títulos Bodoni enormes e finos contra texto Jost discreto. A materialidade vem de objetos reais da marca (o papel kraft com fibra e furo de etiqueta, o carimbo marsala de acervo, o filete dourado), nunca de ornamento étnico carregado. A única luz é o reflexo de vidro sobre a foto, que segue o ponteiro e se apaga quando a peça entra no acervo.

O movimento é poucos gestos com ease-out exponencial: o carimbo batido, a luz da vitrine, a etiqueta que se endireita no hover. Não há entradas genéricas por seção.

**Key Characteristics:**
- Paredes areia com grão leve; faixa marsala no topo; terra no rodapé.
- Foto em moldura chapada de ouro envelhecido com passe-partout areia-clara.
- Cartão kraft com furo, Nº tabular e nome em Bodoni itálico como etiqueta de cada peça.
- Estado da peça sempre visível (disponível, reservada com mm:ss, no acervo).
- Botões Jost em caixa alta espaçada, marsala com filete dourado interno.
- Peças vendidas viram arquivo: foto em sépia dessaturada, carimbo ACERVO no cartão.

## Colors

Paleta fechada do manual de marca: marsala manda, ouro emoldura, areia é a parede, terra é a tinta; todas as derivadas são `color-mix` dessas cinco.

### Primary
- **Marsala do Manual** (marsala): faixa do cabeçalho, botões, títulos h1–h3, nomes de peça, Nº de registro, carimbo de acervo, anel de foco e seleção de texto. É a tinta das etiquetas.
- **Marsala Fechado** (marsala-escuro): hover do botão primário e texto sobre fundos de erro.

### Secondary
- **Ouro Envelhecido** (ouro): moldura da vitrine, faixa geométrica divisória, sublinhado de links (a 70%), barra de rolagem.
- **Ouro Claro** (ouro-claro): filete interno do botão, sublinhado ativo da navegação, contador da sacola, slogan e títulos no rodapé terra.

### Tertiary
- **Terracota** (terracota): urgência e erro: bordas de campo inválido, alertas da sacola, pulso do timer nos últimos minutos, sempre em superfícies ou bordas.
- **Terracota de Texto** (terracota-texto): versão escurecida para fundos de pílula com texto (tempo da reserva, sacola urgente) e para texto terracota em tamanho corrido.

### Neutral
- **Areia da Parede** (areia): fundo do corpo, sempre com o grão leve, que amostra próximo do valor puro; texto sobre marsala e terra.
- **Areia Clara** (areia-clara): passe-partout da vitrine, fundo de campos, texto sobre pílulas escuras.
- **Areia Funda** (areia-funda): leito da foto enquanto a imagem carrega.
- **Kraft** (kraft): o papel das etiquetas, sempre com fibra e grão por cima.
- **Marrom Terra** (terra): texto corrido, rótulos, fundo do rodapé; a 22% vira a linha divisória.
- **Terra Suave** (terra-suave): texto de ajuda e botão desabilitado.

### Named Rules
**The Cinco Cores Rule.** Nenhuma cor fora do manual. Toda variação nova é `color-mix` entre marsala, terracota, ouro, areia, terra (e branco só para clarear areia).

**The Tinta Marsala Rule.** Sobre kraft e areia, o que é identidade da peça (Nº, nome, carimbo) é marsala; o que é informação (materiais, texto) é terra.

## Typography

**Display Font:** Bodoni Moda (com Bodoni 72, Didot)
**Body Font:** Jost (com Futura, system-ui)

**Character:** Didone de alto contraste em peso 400, grande e fino, contra uma geométrica limpa e pequena. Nomes de peça e slogan em itálico; todo o resto da Bodoni em redondo.

### Hierarchy
- **Display** (400, clamp(3.25rem, 9.5vw, 7.5rem), 0.88): só o título de abertura da home ("Na vitrine hoje"); cabeçalhos de página internos usam clamp(3rem, 8vw, 6rem) a 0.95.
- **Headline** (400, clamp(2.5rem, 5.5vw, 4.25rem), ~0.98): títulos de seção na parede areia.
- **Title** (400 itálico, clamp(2rem, 3.6vw, 3.25rem), 1): nome da peça no cartão kraft grande; 1.375rem no cartão pequeno. Preço em Bodoni redondo (2rem grande, 1.25rem pequeno) na cor terra.
- **Body** (400, 1.0625rem, 1.6): texto corrido em terra, até 46–56ch. Lede de página a 1.125rem.
- **Label** (500, 0.75rem, 0.16–0.2em, caixa alta): rótulos de campo, estado da peça, trilha de navegação, títulos de bloco da ficha técnica (com a faixa dourada embaixo).
- **Button** (500, 0.8125rem, 0.2em, caixa alta): botões, link-seta, navegação (400 no cabeçalho).
- **Número** (500, 0.8125rem, 0.18em, numerais tabulares e alinhados): Nº de registro, preços tabulares, timer mm:ss.

### Named Rules
**The Nome em Itálico Rule.** O itálico da Bodoni é reservado ao nome da peça e ao slogan. Títulos de página e seção ficam em redondo.

**The Nº Tabular Rule.** Todo número que é endereço ou contagem (Nº, mm:ss, preço em lista) usa numerais tabulares com espaçamento levemente aberto.

## Layout

Envoltório central de 1320px com respiro lateral fluido (gutter). A peça do dia ocupa uma grade assimétrica 7fr/5fr: foto grande à esquerda, cartão kraft à direita sobrepondo levemente a moldura. Na página da peça, 11fr/9fr com a foto fixa (sticky a 96px) enquanto a ficha rola. Listas da vitrine e do acervo em quatro colunas no desktop, com a etiqueta kraft subindo cerca de 2.75rem sobre a base da moldura e levemente girada (-0.6deg / 0.7deg alternados).

Ritmo vertical generoso: seções separadas por clamp(4rem, 10vw, 8rem); cabeçalho de página clamp(2.5rem, 6vw, 4.5rem) acima. Faixas de cor de ponta a ponta (marsala no convite à encomenda, terra no rodapé, areia funda em "como funciona") quebram a parede.

Pontos de quebra observados: 1100px, 900px (navegação vira menu de cortina), 800px (rodapé em coluna única), 700px, 600px e 560px (etiqueta ocupa quase toda a largura da foto). No mobile tudo empilha: foto, depois cartão.

## Elevation & Depth

Profundidade física e quente, como objetos sobre a parede: sombras difusas tingidas de terra, nunca pretas, e só em coisas que existem de verdade (a moldura, o cartão de papel, a faixa do cabeçalho). Superfícies de interface (campos, botões, chips) são planas.

### Shadow Vocabulary
- **Peça na parede** (`box-shadow: 0 1px 1px rgb(73 49 38 / 0.08), 0 14px 32px -12px rgb(73 49 38 / 0.35)`): moldura da vitrine, fotos emolduradas da encomenda.
- **Cartão de papel** (`box-shadow: 0 1px 0 rgb(73 49 38 / 0.12), 0 10px 22px -10px rgb(73 49 38 / 0.45)`): cartão kraft grande; o pequeno usa uma versão mais curta (0 6px 14px -8px).
- **Faixa do cabeçalho** (`box-shadow: 0 1px 0 ouro a 55%, 0 8px 24px -16px rgb(73 49 38 / 0.6)`): fio dourado e sombra rasa sob o cabeçalho fixo.

### Named Rules
**The Objeto Real Rule.** Só ganha sombra o que seria um objeto na sala (moldura, cartão, faixa). Botões e campos não flutuam; o foco é anel marsala de 2px com 3px de afastamento.

## Shapes

Cantos quase retos: 2px em botões e campos, 3px no papel (cartão kraft, carimbo, pílula de tempo, avisos). Pílulas totalmente arredondadas só para chips de escolha, estados em passo e a sacola. A moldura da vitrine é um retângulo chapado de ouro (5–8px) com fio externo ouro-terra e filete interno terra a 25% no passe-partout; nada de gradiente metálico. O cartão kraft tem um furo circular centralizado no topo (12px; 8px no pequeno), adaptação citada das etiquetas reais da Renata. Divisores internos do cartão são tracejados em terra; divisores de seção usam a faixa geométrica fina de losango e traço em ouro.

## Components

### Buttons
Marsala com detalhe dourado, como pede o manual.
- **Shape:** quase reto (2px), altura mínima 52px.
- **Primary:** fundo marsala, texto areia, Jost 500 caixa alta a 0.2em; um filete ouro-claro interno a 4px da borda.
- **Hover / Focus:** fundo marsala-escuro e o filete recua para 6px (0.35s, ease exponencial); active desce 1px; foco em anel marsala.
- **Contorno:** transparente com contorno interno marsala de 1px, sem filete; no hover enche de marsala.
- **Areia:** para faixas marsala; fundo areia, texto marsala, filete ouro.
- **Desabilitado:** terra a 18% sobre areia, texto terra-suave, filete vira linha.
- **Link-seta:** texto marsala caixa alta com sublinhado ouro e ícone de seta desenhado; o espaço até a seta abre no hover.

### Chips
- **Style:** pílula de 44px, contorno terra a 35%, fundo transparente, Jost 0.9375rem.
- **State:** hover troca o contorno para marsala; selecionado enche de marsala com texto areia.

### Cards / Containers
- **Cartão kraft (signature):** papel kraft com fibra horizontal e grão, cantos 3px, sombra de papel, furo no topo. Linha de cima: monograma RF e Nº em marsala. Depois o nome em Bodoni itálico marsala, materiais em terra, e o rodapé tracejado com preço e estado. Duas escalas: grande (ao lado da foto) e pequena (sob a foto nas listas).
- **Internal Padding:** clamp(1.5rem, 3vw, 2.5rem) com 2.75rem no topo para o furo; pequeno 1.1rem com 1.6rem no topo.

### Inputs / Fields
- **Style:** fundo areia-clara, contorno terra a 35%, 2px, altura 50px; rótulo em Label acima; ajuda em terra-suave.
- **Focus:** contorno marsala e halo marsala a 18% de 3px.
- **Error:** contorno terracota e halo terracota a 16%; mensagem em 0.875rem peso 500.
- **Select:** seta desenhada em SVG marsala.

### Navigation
- **Cabeçalho:** faixa marsala fixa de 72px (64px no mobile) com a assinatura RF | Jóias à esquerda. Links Jost 0.8125rem caixa alta a 0.2em em areia a 88%; hover e página atual ganham areia cheia e um fio ouro-claro que cresce da esquerda.
- **Sacola:** ícone desenhado com contador ouro-claro e timer tabular; nos minutos finais vira pílula terracota-texto com pulso.
- **Mobile:** abaixo de 900px, botão de menu de 44px e cortina marsala que desce por clip-path; itens separados por fio areia a 12%.
- **Rodapé:** fundo terra encimado pela faixa geométrica sobre areia; slogan em Bodoni itálico ouro-claro; títulos de coluna em Label ouro-claro.

### Vitrine (signature)
Moldura chapada de ouro envelhecido com passe-partout areia-clara, foto 4:5 (também 1:1 e 3:4). Um reflexo de vidro em soft-light segue o ponteiro; no hover a foto cresce 2.5%. Quando a peça é vendida, a luz se apaga e a foto vira arquivo (grayscale 0.9, sépia 0.32).

### Estado da peça
Rótulo Jost caixa alta com ponto de 8px na cor do estado: disponível com búzio marsala; reservada em terra-terracota com pílula de tempo mm:ss em terracota-texto; "minha" reserva em marsala; no acervo com ponto vazado marsala.

### Carimbo de acervo
Selo marsala de contorno 1.5px, cantos 3px, girado -4deg: "ACERVO" em Bodoni espaçada e, embaixo, mês da venda ou Nº. Batido sobre o cartão kraft com animação de impacto (0.8s, escala 1.8 para 1).

## Do's and Don'ts

### Do:
- **Do** expor cada peça como par vitrine + cartão kraft; a etiqueta sobrepõe a base da moldura nas listas.
- **Do** manter o estado da peça visível em todo cartão, com o tempo da reserva em mm:ss tabular.
- **Do** usar a faixa geométrica de losango e traço em ouro como único divisor ornamental.
- **Do** usar o búzio como único glifo de marca, e ícones lucide desenhados para interface.
- **Do** levar peças vendidas ao estado de arquivo: foto sépia dessaturada, luz apagada, carimbo ACERVO no cartão.
- **Do** manter o grão leve sobre a parede areia e a fibra sobre o kraft.

### Don't:
- **Don't** usar gradiente ou brilho metálico na moldura; o ouro é chapado (#b47b45).
- **Don't** colocar o carimbo sobre a foto; ele vive no cartão kraft.
- **Don't** pôr rótulos-sobretítulo (eyebrows) acima dos títulos; o título fala sozinho.
- **Don't** usar setas ou símbolos tipográficos como ícones; só ícones desenhados.
- **Don't** introduzir cores fora das cinco do manual nem padrões étnicos carregados.
- **Don't** usar terracota pura (#a64f43) em texto pequeno sobre areia; use terracota-texto.
- **Don't** usar sombras pretas ou sombras duras deslocadas; sombras são difusas e tingidas de terra.
