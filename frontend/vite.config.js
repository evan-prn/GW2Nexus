import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// ═══════════════════════════════════════════════════════════════════
// GW2Nexus — Vite Configuration
// Proxy /api → Laravel (même domaine = CSRF cookie natif)
// HMR via polling — requis sur volumes Docker Windows/Mac
// ═══════════════════════════════════════════════════════════════════

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: '0.0.0.0',   // Écoute sur toutes les interfaces — requis dans Docker
    port: 5173,

    // ─── Proxy API ────────────────────────────────────────────────
    // Toutes les requêtes /api/* et /sanctum/* sont forwardées au
    // container Laravel via le réseau Docker interne (nom du service).
    // Avantage : même domaine (localhost:5173) → pas de problème CORS
    // ni de cookie SameSite — Sanctum fonctionne nativement.
    proxy: {
      '/api': {
        target: 'http://laravel:8000',
        changeOrigin: true,
      },
      // Requis pour que Sanctum puisse émettre le cookie CSRF
      '/sanctum': {
        target: 'http://laravel:8000',
        changeOrigin: true,
      },
    },

    // ─── HMR (Hot Module Replacement) ─────────────────────────────
    // Le client WebSocket doit se connecter à localhost (hôte Windows/Mac),
    // pas à l'IP interne du container Docker.
    hmr: {
      host: 'localhost',
      port: 24678,
    },

    // ─── Polling ──────────────────────────────────────────────────
    // inotify non fiable sur volumes Docker montés sous Windows/Mac.
    // Polling toutes les 100ms garantit la détection des changements.
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});