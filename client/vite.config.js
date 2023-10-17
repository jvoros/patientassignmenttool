import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
    // https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite
    server: { 
      proxy: {
        "/api": "http://localhost:4000"
      },
    }
})
