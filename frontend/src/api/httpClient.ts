/// <reference types="vite/client" />
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════
// GW2Nexus — HTTP Client (Axios)
// Sanctum SPA mode — authentification par cookie de session
//
// Architecture proxy :
//   Browser → Vite (localhost:5173) → proxy → Laravel (laravel:8000)
//   Tout passe par le même domaine → pas de problème CSRF/CORS
// ═══════════════════════════════════════════════════════════════════

const BASE_URL: string = import.meta.env.VITE_API_URL ?? '';

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Cookie CSRF ──────────────────────────────────────────────────
let csrfFetched = false;

const ensureCsrf = async (): Promise<void> => {
  if (!csrfFetched) {
    await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    csrfFetched = true;
  }
};

// ─── Intercepteur request — CSRF automatique sur mutations ────────
httpClient.interceptors.request.use(async (config) => {
  const mutations = ['post', 'put', 'patch', 'delete'];
  if (mutations.includes(config.method?.toLowerCase() ?? '')) {
    await ensureCsrf();
  }
  return config;
});

// ─── Intercepteur response — gestion globale des erreurs ─────────
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      csrfFetched = false;
    }
    return Promise.reject(error);
  }
);

export default httpClient;