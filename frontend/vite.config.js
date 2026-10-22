import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Étape backend : le proxy enverra /api vers Express (port 5000)
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } } })
