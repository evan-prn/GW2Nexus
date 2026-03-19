import http from './httpClient';

// ─── Service utilisateurs ─────────────────────────────────────────

export const usersApi = {
  /** Récupère la liste de tous les utilisateurs */
  all: () => http.get('/users'),

  /** Récupère un utilisateur par son identifiant */
  find: (id: number) => http.get(`/users/${id}`),
};