import ProductCard from './ProductCard.jsx'
import '../styles/ProductList.css'

export default function ProductList({ products, cart, onAddToCart, onRemoveFromCart }) {
  if (products.length === 0) {
    return (
      <p className="product-list__empty">
        <span aria-hidden="true">🔍</span> Nenhum produto encontrado com esses filtros.
      </p>
    )
  }

  return (
    <section className="product-list" aria-label="Vitrine de produtos">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          symbol={product.symbol}
          category={product.category}
          tag={product.tag}
          description={product.description}
          quantityInCart={cart[product.id] || 0}
          onAddToCart={() => onAddToCart(product)}
          onRemoveFromCart={() => onRemoveFromCart(product)}
        />
      ))}
    </section>
  )
}
