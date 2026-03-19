import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════
// GW2Nexus — Vite Configuration (TypeScript)
// Proxy /api → Laravel (même domaine = CSRF cookie natif)
// HMR via polling — requis sur volumes Docker Windows/Mac
// ═══════════════════════════════════════════════════════════════════

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // ─── Alias @ ──────────────────────────────────────────────────────
  // Permet d'importer depuis src/ avec @/ au lieu de chemins relatifs
  // Exemple : import { authStore } from '@/store/authStore'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,

    // ─── Proxy API ──────────────────────────────────────────────────
    proxy: {
      '/api': {
        target: 'http://laravel:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://laravel:8000',
        changeOrigin: true,
      },
    },

    // ─── HMR ────────────────────────────────────────────────────────
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },

    // ─── Polling ────────────────────────────────────────────────────
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});