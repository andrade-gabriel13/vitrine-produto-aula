import { useState } from 'react'
import { formatPrice } from '../utils/format.js'
import '../styles/ProductCard.css'

export default function ProductCard({
  name,
  price,
  image,
  symbol,
  category,
  tag,
  description,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
}) {
  // useState 2 — favorito: alterna ícone, cor e texto do botão.
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <article className="card">
      <div className="card__media">
        <img className="card__image" src={image} alt={name} loading="lazy" />
        <span className="card__tag">{tag}</span>
        <button
          type="button"
          className={`card__favorite ${isFavorite ? 'card__favorite--on' : ''}`}
          onClick={() => setIsFavorite((current) => !current)}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <span aria-hidden="true">{isFavorite ? '❤️' : '🤍'}</span>
          <span className="card__favorite-text">
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </span>
        </button>
      </div>

      <div className="card__body">
        <span className="card__category">
          <span aria-hidden="true">{symbol}</span> {category}
        </span>
        <h3 className="card__name">{name}</h3>
        <p className="card__description">{description}</p>

        <div className="card__footer">
          <span className="card__price">{formatPrice(price)}</span>
          {quantityInCart > 0 && (
            <span className="card__badge">{quantityInCart} no carrinho</span>
          )}
        </div>

        <div className="card__actions">
          <button type="button" className="btn btn--primary" onClick={onAddToCart}>
            Adicionar ao carrinho
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onRemoveFromCart}
            disabled={quantityInCart === 0}
          >
            Remover
          </button>
        </div>
      </div>
    </article>
  )
}
