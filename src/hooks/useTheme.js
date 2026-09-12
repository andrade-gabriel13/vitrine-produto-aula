import { useEffect, useState } from 'react'

// Chave usada no localStorage para lembrar a escolha do visitante.
const STORAGE_KEY = 'vitrine:tema'

// Lê a preferência salva; se ainda não houver, segue o tema do sistema.
function readInitialTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'claro' || saved === 'escuro') return saved
  } catch {
    // localStorage pode estar bloqueado (aba privada): segue no padrão.
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'escuro' : 'claro'
}

/**
 * Hook de tema: devolve o tema atual ('claro' | 'escuro') e a função que
 * alterna entre os dois. O CSS reage ao atributo data-tema do <html>.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme)

  // Sempre que o tema muda: aplica no <html> e guarda a escolha.
  useEffect(() => {
    document.documentElement.dataset.tema = theme
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Sem localStorage o tema vale só para esta visita.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'escuro' ? 'claro' : 'escuro'))
  }

  return { theme, toggleTheme }
}
