import '../styles/ThemeToggle.css'

/**
 * Botão que alterna entre o tema claro e o escuro.
 * Recebe o tema atual e a função de troca vindos do hook useTheme.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'escuro'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      title={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle__text">
        {isDark ? 'Tema claro' : 'Tema escuro'}
      </span>
    </button>
  )
}
