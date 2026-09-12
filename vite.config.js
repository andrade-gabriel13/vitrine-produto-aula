import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O site é publicado em https://<usuario>.github.io/product-showcase/,
// por isso o base precisa apontar para a subpasta do repositório.
export default defineConfig({
  plugins: [react()],
  base: '/product-showcase/',
})
