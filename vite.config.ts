import path from "path"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from "vite"
import iconConfig from './src/assets/icons.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      manifest: {
        short_name: 'pencilheads',
        name: 'pencilheads - film clubs | movie events',
        description: 'Discover film clubs and movie events around you, host your own events, share experiences.',
        icons: iconConfig.icons,
        orientation: 'portrait-primary',
        background_color: '#0f1629',
        theme_color: '#0f1629',
        categories: ['movies', 'events'],
        // @ts-ignore
        gcm_sender_id: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        shortcuts: [
          {
            name: 'Dashboard',
            url: '/dashboard',
            description: 'Events dashboard',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5000000,
      }
    }),
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    minify: true,
  },
  envPrefix: ["VITE_"],
})
