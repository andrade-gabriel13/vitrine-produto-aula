import ThemeToggle from './ThemeToggle.jsx'
import { formatPrice } from '../utils/format.js'
import '../styles/Header.css'

export default function Header({
  storeName,
  subtitle,
  cartCount,
  cartTotal,
  theme,
  onToggleTheme,
}) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">
          🎮
        </span>
        <div>
          <h1 className="header__title">{storeName}</h1>
          <p className="header__subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header__actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <div className="header__cart" title="Itens no carrinho">
          <span className="header__cart-icon" aria-hidden="true">
            🛒
          </span>
          <div className="header__cart-info">
            <strong className="header__cart-count">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </strong>
            <span className="header__cart-total">{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
