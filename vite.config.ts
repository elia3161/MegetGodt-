import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANT: set base to repo name so the app works when served from GitHub Pages
export default defineConfig({
  base: '/MegetGodt-/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MegetGodt Invest',
        short_name: 'Invest',
        description: 'PWA til at kalkulere investeringer',
        theme_color: '#0ea5a4',
        start_url: '/MegetGodt-/',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
