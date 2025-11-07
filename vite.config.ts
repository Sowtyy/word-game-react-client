import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'

const vitePWAOptions: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest: false,
  scope: "./",
  includeManifestIcons: true,
  includeAssets: ["**/*"],
  workbox: {
    cacheId: "word-game"
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA(vitePWAOptions)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
      input: {
        index: "index.html"
      }
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      },
      "/manifest.json": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
})
