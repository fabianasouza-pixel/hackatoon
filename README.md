# Renata Ferré Jóias: loja online (front-end)

Loja de joias únicas feitas à mão por Renata Ferré. Só o front-end, em Next.js + React + TypeScript. Ainda não há back-end: o estado das peças fica salvo no navegador (`localStorage`) para simular a loja.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

## Páginas

| Rota | O que é |
|---|---|
| `/` | Vitrine do dia (peça em destaque + reserva), outras peças, como funciona, quem faz, acervo, encomenda |
| `/vitrine` | Peças à venda, com filtro por categoria e ordenação |
| `/peca/[numero]` | Detalhe da peça (ex.: `/peca/058`). Muda conforme o estado: disponível, reservada por você, reservada por outra cliente, vendida |
| `/acervo` | Peças vendidas. Sem compra; cada uma leva à encomenda |
| `/encomenda` | Formulário de peça sob medida. Aceita `?ref=053` para partir de uma peça do acervo |
| `/sacola` | Reservas com contagem regressiva + checkout simulado |

## Regras de negócio

Ficam em [src/lib/regras.ts](src/lib/regras.ts) e [src/lib/store.tsx](src/lib/store.tsx).

- Cada peça existe uma vez só: `disponível → reservada (20 min) → vendida (vai para o acervo)`.
- Ao colocar na sacola, a peça fica reservada por **20 minutos** só para quem reservou; as outras clientes a veem como "reservada", com o tempo.
- Se o tempo acabar, a reserva expira e a peça volta para a vitrine (com aviso e opção de reservar de novo).
- Cada cliente pode segurar no máximo **3 peças** ao mesmo tempo.
- Com o pagamento confirmado, a peça vira "vendida" e aparece no acervo, sem botão de compra.
- O checkout confere de novo se as reservas ainda valem antes de confirmar.

O botão **Demonstração** (canto inferior esquerdo) simula outras clientes reservando e pagando, expira suas reservas e restaura a loja. Ele existe porque ainda não há back-end; remova antes de publicar.

Quando houver back-end, só [src/lib/store.tsx](src/lib/store.tsx) precisa trocar: as telas leem tudo pelo hook `useLoja()`.

## Conteúdo

- Peças: [src/data/pecas.ts](src/data/pecas.ts). As **fotos são reais**; preços, medidas, pesos, datas e quais peças estão vendidas são **exemplos** e precisam ser trocados.
- Fotos do site: `public/pecas/` e `public/renata/`. Originais e manual de marca em `referencias/`.
- O monograma RF em [src/components/Marca.tsx](src/components/Marca.tsx) foi redesenhado a partir da foto da logo. Se existir o arquivo vetorial original, substitua.

## Identidade visual

Segue o manual de marca: fundo areia, cabeçalho marsala, títulos em serifa (Bodoni Moda), texto em Jost, botões em caixa alta. Paleta e tokens no topo de [src/app/globals.css](src/app/globals.css). Contexto de produto em [PRODUCT.md](PRODUCT.md).
