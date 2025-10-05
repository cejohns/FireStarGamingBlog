import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // forward /api/* to your backend
      '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true }
      // if your backend is on 5001, use that instead
    }
  }
})
