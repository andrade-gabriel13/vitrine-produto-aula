import '../styles/Filters.css'

export default function Filters({
  search,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}) {
  return (
    <section className="filters" aria-label="Busca e filtros">
      <div className="filters__search">
        <span className="filters__search-icon" aria-hidden="true">
          🔎
        </span>
        <input
          type="search"
          className="filters__input"
          placeholder="Buscar produto pelo nome..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar produto pelo nome"
        />
      </div>

      <div className="filters__categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${category === activeCategory ? 'chip--active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="filters__count">
        {resultCount} {resultCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>
    </section>
  )
}
