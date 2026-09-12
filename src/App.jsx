import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Filters from './components/Filters.jsx'
import ProductList from './components/ProductList.jsx'
import CartPanel from './components/CartPanel.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import PaymentSuccess from './components/PaymentSuccess.jsx'
import Footer from './components/Footer.jsx'
import useTheme from './hooks/useTheme.js'
import { products, categories } from './data/products.js'
import { readOrderFromHash } from './utils/payment.js'
import './styles/App.css'

export default function App() {
  // Tema claro (padrão) ou escuro — o hook guarda a escolha no navegador
  const { theme, toggleTheme } = useTheme()
  // useState 1 — carrinho: { [id do produto]: quantidade }
  const [cart, setCart] = useState({})
  // useState extra — busca por nome (opcional na atividade)
  const [search, setSearch] = useState('')
  // useState extra — filtro por categoria (opcional na atividade)
  const [category, setCategory] = useState('Todos')
  // useState extra — popup de pagamento aberto/fechado
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  // useState extra — pedido lido do QR Code (quando alguém escaneia no celular)
  const [scannedOrder, setScannedOrder] = useState(() => readOrderFromHash())

  // Se a URL mudar para #pagamento?..., mostra a tela de confirmação.
  useEffect(() => {
    function handleHashChange() {
      setScannedOrder(readOrderFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const cartCount = Object.values(cart).reduce((total, qty) => total + qty, 0)

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => ({
      product: products.find((p) => p.id === Number(id)),
      quantity,
    }))
    .filter((item) => item.product)

  const cartTotal = cartItems.reduce(
    (total, { product, quantity }) => total + product.price * quantity,
    0
  )

  function addToCart(product) {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }))
  }

  function removeFromCart(product) {
    setCart((current) => {
      const qty = current[product.id] || 0
      if (qty <= 1) {
        const { [product.id]: _removed, ...rest } = current
        return rest
      }
      return { ...current, [product.id]: qty - 1 }
    })
  }

  function clearCart() {
    setCart({})
  }

  // Chamado pelo popup quando o pagamento é confirmado: zera o carrinho.
  function handlePaid() {
    setCart({})
  }

  function leaveSuccessScreen() {
    window.location.hash = ''
    setScannedOrder(null)
  }

  const visibleProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesCategory = category === 'Todos' || product.category === category
    return matchesName && matchesCategory
  })

  // Quem chega pela leitura do QR Code vê apenas a confirmação.
  if (scannedOrder) {
    return (
      <PaymentSuccess
        order={scannedOrder}
        onBack={leaveSuccessScreen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <div className="app">
      <Header
        storeName="Nível Up Games"
        subtitle="Tudo para a sua próxima fase — consoles, periféricos e jogos."
        cartCount={cartCount}
        cartTotal={cartTotal}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="app__layout">
        <aside className="app__sidebar">
          <Filters
            search={search}
            onSearchChange={setSearch}
            categories={categories}
            activeCategory={category}
            onCategoryChange={setCategory}
            resultCount={visibleProducts.length}
          />

          <CartPanel
            items={cartItems}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        </aside>

        <main className="app__content">
          <div className="app__content-head">
            <h2 className="app__content-title">
              {category === 'Todos' ? 'Todos os produtos' : category}
            </h2>
            <span className="eyebrow">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          <ProductList
            products={visibleProducts}
            cart={cart}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
          />
        </main>
      </div>

      <Footer storeName="Nível Up Games" />

      {isCheckoutOpen && (
        <CheckoutModal
          items={cartItems}
          subtotal={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onPaid={handlePaid}
        />
      )}
    </div>
  )
}
