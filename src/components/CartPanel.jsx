import { formatPrice } from '../utils/format.js'
import { FRETE_GRATIS_A_PARTIR_DE, getShipping } from '../utils/payment.js'
import '../styles/CartPanel.css'

export default function CartPanel({
  items,
  cartCount,
  cartTotal,
  onAdd,
  onRemove,
  onClear,
  onCheckout,
}) {
  const shipping = getShipping(cartTotal)
  const missingForFreeShipping = FRETE_GRATIS_A_PARTIR_DE - cartTotal

  return (
    <section className="cart" aria-label="Carrinho de compras">
      <div className="cart__head">
        <h2 className="cart__title">
          <span aria-hidden="true">🛒</span> Meu carrinho
        </h2>
        {cartCount > 0 && (
          <button type="button" className="btn btn--ghost" onClick={onClear}>
            Esvaziar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="cart__empty">
          Seu carrinho está vazio. Escolha um produto na vitrine ao lado!
        </p>
      ) : (
        <>
          <ul className="cart__list">
            {items.map(({ product, quantity }) => (
              <li className="cart__item" key={product.id}>
                <span className="cart__item-symbol" aria-hidden="true">
                  {product.symbol}
                </span>
                <span className="cart__item-name">{product.name}</span>
                <div className="cart__stepper">
                  <button
                    type="button"
                    className="cart__step"
                    onClick={() => onRemove(product)}
                    aria-label={`Remover uma unidade de ${product.name}`}
                  >
                    −
                  </button>
                  <span className="cart__qty">{quantity}</span>
                  <button
                    type="button"
                    className="cart__step"
                    onClick={() => onAdd(product)}
                    aria-label={`Adicionar uma unidade de ${product.name}`}
                  >
                    +
                  </button>
                </div>
                <span className="cart__item-price">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <p className="cart__shipping">
            {shipping === 0 ? (
              <>
                <span aria-hidden="true">🚚</span> Frete grátis garantido!
              </>
            ) : (
              <>
                <span aria-hidden="true">🚚</span> Faltam{' '}
                <strong>{formatPrice(missingForFreeShipping)}</strong> para o frete grátis.
              </>
            )}
          </p>

          <div className="cart__footer">
            <p className="cart__total">
              <span>
                Total ({cartCount} {cartCount === 1 ? 'item' : 'itens'})
              </span>
              <strong>{formatPrice(cartTotal)}</strong>
            </p>
            <button
              type="button"
              className="btn btn--primary cart__checkout"
              onClick={onCheckout}
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </section>
  )
}
