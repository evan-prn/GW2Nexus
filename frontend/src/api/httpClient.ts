// src/api/httpClient.ts

/// <reference types="vite/client" />
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════════
// GW2Nexus — Client HTTP (Axios) — Mode Bearer Token
//
// Authentification :
//   Mode Sanctum Bearer Token — pas de cookie, pas de CSRF.
//   Le token est lu depuis localStorage et injecté dans chaque requête
//   via l'intercepteur request.
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

const httpClient = axios.create({
  baseURL:         BASE_URL,
  withCredentials: false, // Bearer Token — pas de cookie de session
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
});

// ---------------------------------------------------------------------------
// Intercepteur request — injection automatique du token Bearer
//
// Avant chaque requête, on lit le token depuis localStorage et on l'injecte
// dans Authorization. Les routes publiques fonctionnent sans token — Sanctum
// les laisse passer si elles ne sont pas dans un groupe auth:sanctum.
// ---------------------------------------------------------------------------

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------------------------------------
// Intercepteur response — gestion globale des erreurs HTTP
//
// 401 : token expiré ou révoqué — on supprime le token du localStorage.
//       La redirection vers /login est gérée dans authStore (clearAuth).
//
// Les autres erreurs (403, 422, 500...) remontent aux appelants via
// Promise.reject pour être traitées localement.
// ---------------------------------------------------------------------------

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré — nettoyage immédiat
      localStorage.removeItem('auth_token');
    }

    return Promise.reject(error);
  },
);

export default httpClient;