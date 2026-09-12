# 🎮 Nível Up Games — Vitrine de Produtos (React)

Atividade prática de React: **componentes, props, useState e CSS**.
Loja fictícia de games com vitrine, carrinho, favoritos e checkout com QR Code.

🔗 **Site publicado:** https://andrade-gabriel13.github.io/product-showcase/
🔗 **Repositório:** https://github.com/andrade-gabriel13/product-showcase

## Requisitos atendidos

### 1. Componentes

| Componente | Arquivo | Responsabilidade |
| --- | --- | --- |
| `Header` | `src/components/Header.jsx` | Nome da loja, subtítulo e contador do carrinho |
| `ProductCard` | `src/components/ProductCard.jsx` | Um produto (imagem, nome, preço, botões) |
| `ProductList` | `src/components/ProductList.jsx` | Recebe a lista e renderiza um `ProductCard` por item |
| `Filters` | `src/components/Filters.jsx` | Busca por nome e filtro por categoria |
| `CartPanel` | `src/components/CartPanel.jsx` | Resumo do carrinho, frete e botão de finalizar |
| `CheckoutModal` | `src/components/CheckoutModal.jsx` | Popup de pagamento em 3 etapas |
| `QrCode` | `src/components/QrCode.jsx` | Gera a imagem do QR Code do pedido |
| `PaymentSuccess` | `src/components/PaymentSuccess.jsx` | Tela aberta ao escanear o QR Code |
| `Footer` | `src/components/Footer.jsx` | Rodapé da loja |

### 2. Props

- `ProductCard` recebe **todos** os dados via props (`name`, `price`, `image`, `symbol`,
  `category`, `tag`, `description`, `quantityInCart`) — nada fixo dentro do card.
- Os produtos ficam em um array de **8 itens** em `src/data/products.js`.

### 3. useState

- `cart` (`App.jsx`) — contador de itens exibido no `Header`.
- `isFavorite` (`ProductCard.jsx`) — alterna 🤍 *Favoritar* / ❤️ *Favoritado*.
- `search` e `category` (`App.jsx`) — busca e filtro.
- `isCheckoutOpen` e `scannedOrder` (`App.jsx`) — popup e leitura do QR Code.
- `step`, `methodId`, `installments`, `order`, `secondsLeft` (`CheckoutModal.jsx`).

### 4. CSS

- Estilização 100% própria (`src/styles/`), **sem Bootstrap/Tailwind**.
- Layout editorial em duas colunas (`grid`): sidebar com filtros + carrinho e vitrine
  em grade `repeat(auto-fill, minmax(250px, 1fr))`.
- Responsivo: em ≤900px a sidebar vira faixa horizontal e as categorias viram pílulas;
  em ≤480px a vitrine passa a uma coluna.
- Hover nos cards (elevação + zoom na imagem), botões, categorias e itens do carrinho.

## Checkout com QR Code

Fluxo ao clicar em **Finalizar compra**:

1. **Condições de pagamento** — escolha entre:
   | Forma | Condição |
   | --- | --- |
   | ⚡ Pix | à vista, 5% de desconto |
   | 💳 Cartão de crédito | até 12x, sem juros até 6x, 1,99% a.m. acima disso |
   | 🧾 Boleto | à vista, 2% de desconto, compensa em até 3 dias úteis |

   Frete grátis acima de R$ 300 (senão R$ 29,90). O resumo recalcula desconto,
   juros e parcela em tempo real.

2. **QR Code** — o popup gera um QR do pedido (`NG-XXXXXX`). Escaneando com o
   celular, abre a própria vitrine na tela **"Pagamento confirmado!"** com o número
   do pedido, a forma de pagamento e o valor.

3. **Confirmação** — ao confirmar (automático em 8s ou no botão "Já paguei"), o popup
   mostra o sucesso e **o carrinho é zerado**.

> Simulação para fins de estudo: nenhum pagamento real é processado. O QR Code aponta
> para a própria página da vitrine (`#pagamento?pedido=...`), não para um banco.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173/product-showcase/
npm run build    # gera a pasta dist/
npm run preview  # pré-visualiza o build
```

## Publicação (GitHub Pages)

Deploy automático via GitHub Actions (`.github/workflows/deploy.yml`) a cada push na `main`.

⚠️ **Antes do primeiro deploy**, ative o Pages no repositório:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.
Sem isso o workflow falha com `HttpError: Not Found ... Get Pages site failed`.

## Estrutura

```
src/
├── App.jsx               # estados do carrinho, busca, categoria e checkout
├── main.jsx
├── components/           # Header, ProductCard, ProductList, Filters,
│                         # CartPanel, CheckoutModal, QrCode, PaymentSuccess, Footer
├── data/products.js      # array de produtos
├── styles/               # um CSS por componente + global.css
└── utils/
    ├── format.js         # formatação de preço em R$
    └── payment.js        # condições de pagamento, frete, pedido e URL do QR
public/products/          # imagens SVG dos produtos
```
