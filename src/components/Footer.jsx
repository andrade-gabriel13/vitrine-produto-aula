import '../styles/Footer.css'

export default function Footer({ storeName }) {
  return (
    <footer className="footer">
      <p>
        <span aria-hidden="true">🎮</span> {storeName} — loja fictícia criada para a
        atividade prática de React (componentes, props, useState e CSS).
      </p>
    </footer>
  )
}
