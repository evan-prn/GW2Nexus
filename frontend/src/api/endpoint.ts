// src/api/endpoints.ts

// ---------------------------------------------------------------------------
// Centralisation des endpoints API GW2Nexus
//
// RÈGLE : toute URL d'API doit être déclarée ici et nulle part ailleurs.
// Les fichiers *.api.ts importent depuis ce fichier — jamais de chaîne
// d'URL en dur dans les services ou les composants.
//
// En cas de changement de version ou de préfixe, une seule ligne à modifier.
// ---------------------------------------------------------------------------

const API_VERSION = '/api/v1';

export const ENDPOINTS = {

  // ─── Santé ──────────────────────────────────────────────────────────────
  health: '/api/health',                // GET — Healthcheck public utilisé aussi par Docker

  // ─── Authentification ────────────────────────────────────────────────────
  auth: {
    register:       `${API_VERSION}/auth/register`,         // POST — Inscription
    login:          `${API_VERSION}/auth/login`,            // POST — Connexion, retourne un token Sanctum
    logout:         `${API_VERSION}/auth/logout`,           // POST — Révocation du token courant
    logoutAll:      `${API_VERSION}/auth/logout-all`,       // POST — Révocation de tous les tokens
    me:             `${API_VERSION}/auth/me`,               // GET  — Utilisateur authentifié courant
    forgotPassword: `${API_VERSION}/auth/forgot-password`,  // POST — Envoi du lien de réinitialisation
    resetPassword:  `${API_VERSION}/auth/reset-password`,   // POST — Réinitialisation via token email
  },

  // ─── Profil utilisateur ──────────────────────────────────────────────────
  profile: {
    show:            `${API_VERSION}/profile`,                   // GET    — Données complètes du profil
    update:          `${API_VERSION}/profile`,                   // PUT    — Mise à jour nom / pseudo_gw2
    avatar:          `${API_VERSION}/profile/avatar`,            // POST   — Upload de l'avatar
    apiKey:          `${API_VERSION}/profile/api-key`,           // POST / DELETE — Gestion clé API GW2
    gw2Data:         `${API_VERSION}/profile/gw2-data`,          // GET    — Données GW2 fraîches (cache Redis)
    worldBossStatus: `${API_VERSION}/profile/world-boss-status`, // GET    — World bosses tués aujourd'hui
  },

  // ─── Contact ─────────────────────────────────────────────────────────────
  contact: {
    submit: `${API_VERSION}/contact`,           // POST — Envoi d'un message de contact
  },

  // ─── Événements GW2 ──────────────────────────────────────────────────────
  //
  // La page Events est publique — pas d'authentification requise.
  events: {
    schedule: `${API_VERSION}/events/schedule`, // GET — Heure serveur UTC + métadonnées
  },

  // Forum
  forum: {
    categories: {
      index: `${API_VERSION}/forum/categories`,
      show: (slug: string) => `${API_VERSION}/forum/categories/${slug}`,
      threads: (slug: string) => `${API_VERSION}/forum/categories/${slug}/threads`,
    },
    threads: {
      show: (slug: string) => `${API_VERSION}/forum/threads/${slug}`,
      posts: (slug: string) => `${API_VERSION}/forum/threads/${slug}/posts`,
      store: (categorySlug: string) => `${API_VERSION}/forum/categories/${categorySlug}/threads`,
    },
    posts: {
      store: (threadSlug: string) => `${API_VERSION}/forum/threads/${threadSlug}/posts`,
      update: (id: number) => `${API_VERSION}/forum/posts/${id}`,
      destroy: (id: number) => `${API_VERSION}/forum/posts/${id}`,
      reports: (id: number) => `${API_VERSION}/forum/posts/${id}/reports`,
    },
  },
  // Back-office admin
  admin: {
    stats: `${API_VERSION}/admin/stats`,        // GET — Statistiques globales de la plateforme

    users: {
      index:  `${API_VERSION}/admin/users`,                           // GET    — Liste paginée + filtres
      show:   (id: number) => `${API_VERSION}/admin/users/${id}`,     // GET    — Détail + historique bans
      ban:    (id: number) => `${API_VERSION}/admin/users/${id}/ban`, // POST   — Appliquer un ban
      unban:  (id: number) => `${API_VERSION}/admin/users/${id}/ban`, // DELETE — Lever le ban actif
    },
    forum: {
      reports: `${API_VERSION}/admin/forum/reports`,
      report: (id: number) => `${API_VERSION}/admin/forum/reports/${id}`,
      lockThread: (id: number) => `${API_VERSION}/admin/forum/threads/${id}/lock`,
      pinThread: (id: number) => `${API_VERSION}/admin/forum/threads/${id}/pin`,
    },
    items: {
      commentReports: `${API_VERSION}/admin/items/comment-reports`,
      commentReport: (id: number) => `${API_VERSION}/admin/items/comment-reports/${id}`,
    },
  },

  // ─── Encyclopédie d'objets GW2 ─────────────────────────────────────────
  //
  // Recherche/filtres/détail/commentaires en lecture sont publics.
  // Favoris et actions sur les commentaires exigent une authentification.
  items: {
    index: `${API_VERSION}/items`,
    autocomplete: `${API_VERSION}/items/autocomplete`,
    resolveCode: `${API_VERSION}/items/resolve-code`,
    resolveCodes: `${API_VERSION}/items/resolve-codes`,
    show: (gw2Id: number) => `${API_VERSION}/items/${gw2Id}`,

    favorites: `${API_VERSION}/items/favorites`,
    favorite: (gw2Id: number) => `${API_VERSION}/items/${gw2Id}/favorite`,

    comments: {
      index: (gw2Id: number) => `${API_VERSION}/items/${gw2Id}/comments`,
      store: (gw2Id: number) => `${API_VERSION}/items/${gw2Id}/comments`,
      update: (id: number) => `${API_VERSION}/items/comments/${id}`,
      destroy: (id: number) => `${API_VERSION}/items/comments/${id}`,
      reports: (id: number) => `${API_VERSION}/items/comments/${id}/reports`,
    },
  },

  // ─── Recherche d'utilisateurs — autocomplétion `@` du forum ────────────
  users: {
    search: `${API_VERSION}/users/search`,
  },

} as const;

export default ENDPOINTS;
