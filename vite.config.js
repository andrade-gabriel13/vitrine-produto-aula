import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O site é publicado em https://andrade-gabriel13.github.io/vitrine-produto-aula/,
// por isso o base precisa apontar para a subpasta do repositório.
export default defineConfig({
  plugins: [react()],
  base: '/vitrine-produto-aula/',
})
