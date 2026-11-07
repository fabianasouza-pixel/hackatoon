# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript. Front-end only for now: no real backend; data, reservations and orders are mocked on the client.

## Users

- **Compradora**: mulher que procura uma joia com identidade forte (barroca, afro, rústica) e que valoriza ter algo que ninguém mais tem. Chega pelo Instagram/WhatsApp, quase sempre no celular, querendo ver o que a Renata lançou hoje.
- **Cliente de encomenda**: não encontrou a peça certa entre as disponíveis e quer que a Renata crie uma para ela.

## Product Purpose

Loja online da **Renata Ferré Jóias**, joalheria autoral de peças únicas e personalizadas. O site precisa vender peças únicas sem conflito entre compradoras, mostrar o portfólio do que já foi feito e captar encomendas sob medida.

## Positioning

Cada peça existe uma vez só. O site não tem estoque nem variações de tamanho/cor: quem compra leva a única. Peças vendidas não somem, elas viram o acervo da artista e a prova do que ela sabe fazer.

## Operating Context

O site tem três partes:

1. **À venda (disponíveis)**: peças que a Renata sobe à medida que ficam prontas (não há frequência fixa; o site não deve prometer "peças novas todo dia"). Ao colocar uma peça no carrinho ela fica **reservada por 20 minutos** só para aquela cliente; as outras pessoas a veem como "reservada". Se o tempo acabar sem pagamento, a peça volta a ficar disponível. Quando o pagamento é confirmado, a peça é marcada como vendida e **vai para o Acervo**.
2. **Acervo / catálogo (já vendidas)**: portfólio das peças que já têm dona. **Sem opção de compra.** Serve de inspiração e de ponte para a encomenda.
3. **Personalize sua peça (encomenda)**: se a cliente não quer nenhuma das disponíveis, preenche um formulário (referência/inspiração, tipo de peça, metal, pedras, medidas, prazo, orçamento) e recebe uma proposta da Renata.

## Capabilities and Constraints

- Estados de uma peça: `disponível` → `reservada` (20 min, com contagem regressiva) → `vendida` (vai para o acervo). Uma reserva expirada volta a `disponível`.
- Só a cliente que reservou pode finalizar a compra daquela peça.
- Quantidade é sempre 1; não existe "adicionar mais".
- Back-end, pagamento, autenticação e upload real estão fora do escopo; simulamos tudo no front.
- Idioma: português do Brasil. Moeda: BRL.

## Brand Commitments

- Nome: **Renata Ferré Jóias** (confirmado; o nome "Òríká" do manual NÃO é usado). Monograma "RF" com o F encaixado no R, barra vertical fina e "Jóias" (`referencias/marca/logo-renata-ferre.jpg`). Os cartões de papel kraft com o logo RF são a embalagem real das peças.
- Slogan do manual: "Peças únicas, com alma e raízes."
- Conceito (manual): estética afro-artesanal, ancestral, rústica e sofisticada; valorização da ancestralidade africana, do trabalho manual, da identidade cultural e da beleza das imperfeições naturais. Cada joia carrega uma história e uma origem.
- Paleta do manual (`referencias/marca/`): Marsala `#762C2D` (principal), Terracota `#A64F43`, Ouro envelhecido `#B47B45`, Areia `#EBD5C2`, Marrom terra `#493126`.
- Tipografia do manual: títulos em serifada elegante; textos em sans-serif simples e legível; botões em caixa alta com espaçamento amplo.
- Elementos gráficos do manual: búzios, linhas orgânicas e formas geométricas, texturas de tecido/madeira/argila, detalhes em dourado envelhecido.
- Direção do site (manual): fundo predominante em areia ou creme; cabeçalho em marsala; fotografias grandes das peças valorizando os detalhes manuais; categorias (Colares, Brincos, Pulseiras/Braceletes, Anéis, Peças exclusivas); pequenos textos sobre inspiração e processo; botões marsala com detalhes dourados. **Não deixar a identidade excessivamente étnica ou carregada**: equilibrar referências afro-brasileiras, rusticidade e sofisticação, com as joias como protagonistas.

## Evidence on Hand

- Fotos reais das peças da Renata (latão e cobre martelados, búzios, ráfia, fio de cobre): `public/pecas/` (originais em `referencias/fotos-originais/`). Colar de aro com arco e flecha e espelho; brincos geométricos de latão martelado; anéis de cobre com búzio; anel de cobre gravado "OYA"; bracelete de cobre com raio; braceletes largos de cobre com búzio e ráfia; bracelete espiral com búzio enlaçado; anel largo de latão com espiral sankofa.
- Fotos da própria Renata usando as peças: `public/renata/`.
- Manual de marca (capturas): `referencias/marca/`.
- Não temos: preços reais, quais peças já foram vendidas, medidas/peso, depoimentos, prazos de produção, política de troca, frete, contatos e redes. No front, preços, estados e fichas técnicas são de demonstração e devem ser trocados; nenhum depoimento ou número pode ser inventado como real.

## Product Principles

1. **Raridade é verdade, não marketing**: os estados de "única", "reservada" e "vendida" sempre refletem a situação real da peça.
2. **Nada se perde**: peça vendida vira acervo; peça que não serve vira encomenda. Toda página leva a algum desses caminhos.
3. **A peça vem primeiro**: fotografia e a história da peça têm mais peso que a interface.
4. **Justo com quem chegou primeiro**: a reserva de 20 minutos é clara, visível e previsível para quem reservou e para quem está olhando.
