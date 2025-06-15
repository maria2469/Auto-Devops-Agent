import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Auto-Devops-Agent/', // 👈 Correct location for the base path
  plugins: [
    react(),
    tailwindcss()
  ]
})
