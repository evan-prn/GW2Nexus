// src/api/httpClient.ts

/// <reference types="vite/client" />
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════════
// GW2Nexus — Client HTTP (Axios)
//
// Architecture proxy :
//   Browser → Vite dev server (localhost:5173)
//          → proxy Vite → Laravel (laravel:8000 dans Docker)
//
// Le proxy Vite (vite.config.ts) redirige toutes les requêtes /api/* et
// /sanctum/* vers le container Laravel. Tout transite par le même domaine,
// ce qui évite les problèmes CORS et permet l'envoi automatique des cookies.
//
// Authentification :
//   Mode Sanctum SPA (cookie de session).
//   withCredentials: true est obligatoire pour que le navigateur envoie
//   les cookies de session sur chaque requête.
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Nécessaire pour les cookies Sanctum (session + XSRF-TOKEN)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Gestion du cookie CSRF
//
// Laravel exige un cookie XSRF-TOKEN valide sur toutes les requêtes
// mutantes (POST, PUT, PATCH, DELETE). On le récupère une seule fois
// via /sanctum/csrf-cookie, puis on le réutilise pour la durée de session.
//
// csrfFetched est remis à false sur une 401 pour forcer un re-fetch
// au cas où la session aurait expiré côté serveur.
// ---------------------------------------------------------------------------

let csrfFetched = false;

const ensureCsrf = async (): Promise<void> => {
  if (csrfFetched) return; // Early return — évite un appel réseau inutile
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
  csrfFetched = true;
};

// ---------------------------------------------------------------------------
// Intercepteur request — injection CSRF automatique
//
// Déclenché avant chaque requête mutante. Transparent pour les appelants :
// ils n'ont pas à gérer le CSRF manuellement.
// ---------------------------------------------------------------------------

httpClient.interceptors.request.use(async (config) => {
  const mutations = ['post', 'put', 'patch', 'delete'];

  if (mutations.includes(config.method?.toLowerCase() ?? '')) {
    await ensureCsrf();
  }

  return config;
});

// ---------------------------------------------------------------------------
// Intercepteur response — gestion globale des erreurs HTTP
//
// 401 : session expirée ou token révoqué — réinitialise le flag CSRF
//       pour forcer un nouveau fetch au prochain appel.
//       La redirection vers /login est gérée dans authStore (logout).
//
// Les autres erreurs (403, 422, 500...) remontent aux appelants via
// Promise.reject pour être traitées localement (hooks, services).
// ---------------------------------------------------------------------------

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      csrfFetched = false; // Force un re-fetch CSRF à la prochaine mutation
    }

    return Promise.reject(error);
  },
);

export default httpClient;