import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════
// GW2Nexus — HTTP Client (Axios)
// Sanctum SPA mode — authentification par cookie de session
//
// Architecture proxy :
//   Browser → Vite (localhost:5173) → proxy → Laravel (laravel:8000)
//   Tout passe par le même domaine → pas de problème CSRF/CORS
// ═══════════════════════════════════════════════════════════════════

// Avec le proxy Vite, les appels sont relatifs — pas besoin d'URL absolue.
// En production, pointer vers le domaine API dédié.
const BASE_URL = import.meta.env.VITE_API_URL || '';

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Envoie les cookies de session Sanctum
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Cookie CSRF ──────────────────────────────────────────────────
// Sanctum requiert un appel à /sanctum/csrf-cookie avant toute mutation.
// Ce cookie est ensuite automatiquement inclus dans les requêtes suivantes.
let csrfFetched = false;

const ensureCsrf = async () => {
  if (!csrfFetched) {
    // Via le proxy Vite : localhost:5173/sanctum/csrf-cookie → laravel:8000
    await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    csrfFetched = true;
  }
};

// ─── Intercepteur request — CSRF automatique sur mutations ────────
httpClient.interceptors.request.use(async (config) => {
  const mutations = ['post', 'put', 'patch', 'delete'];
  if (mutations.includes(config.method?.toLowerCase())) {
    await ensureCsrf();
  }
  return config;
});

// ─── Intercepteur response — gestion globale des erreurs ─────────
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expirée — force un nouveau fetch CSRF à la prochaine requête
      csrfFetched = false;
    }
    return Promise.reject(error);
  }
);

export default httpClient;