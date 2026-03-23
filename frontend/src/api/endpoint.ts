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
  health: `${API_VERSION}/health`,      // GET — Vérifie que le backend est opérationnel

  // ─── Authentification ────────────────────────────────────────────────────
  auth: {
    register:         `${API_VERSION}/auth/register`,         // POST — Inscription
    login:            `${API_VERSION}/auth/login`,            // POST — Connexion, retourne un token Sanctum
    logout:           `${API_VERSION}/auth/logout`,           // POST — Révocation du token courant
    logoutAll:        `${API_VERSION}/auth/logout-all`,       // POST — Révocation de tous les tokens
    me:               `${API_VERSION}/auth/me`,               // GET  — Utilisateur authentifié courant
    forgotPassword:   `${API_VERSION}/auth/forgot-password`,  // POST — Envoi du lien de réinitialisation
    resetPassword:    `${API_VERSION}/auth/reset-password`,   // POST — Réinitialisation via token email
  },

  // ─── Profil utilisateur ──────────────────────────────────────────────────
  profile: {
    show:    `${API_VERSION}/profile`,              // GET    — Données complètes du profil
    update:  `${API_VERSION}/profile`,              // PUT    — Mise à jour nom / pseudo_gw2
    avatar:  `${API_VERSION}/profile/avatar`,       // POST   — Upload de l'avatar
    apiKey:  `${API_VERSION}/profile/api-key`,      // POST / DELETE — Gestion clé API GW2
    gw2Data: `${API_VERSION}/profile/gw2-data`,     // GET    — Données GW2 fraîches (cache Redis)
  },

  // ─── Contact ─────────────────────────────────────────────────────────────
  contact: {
    submit: `${API_VERSION}/contact`,             // POST — Envoi d'un message de contact
  },

  // ─── Back-office admin ───────────────────────────────────────────────────
  admin: {
    stats: `${API_VERSION}/admin/stats`,          // GET  — Statistiques globales de la plateforme

    users: {
      index:  `${API_VERSION}/admin/users`,                               // GET    — Liste paginée + filtres
      show:   (id: number) => `${API_VERSION}/admin/users/${id}`,         // GET    — Détail + historique bans
      ban:    (id: number) => `${API_VERSION}/admin/users/${id}/ban`,     // POST   — Appliquer un ban
      unban:  (id: number) => `${API_VERSION}/admin/users/${id}/ban`,     // DELETE — Lever le ban actif
    },
  },

} as const;

export default ENDPOINTS;