// src/api/admin.api.ts

import httpClient from './httpClient';
import { ENDPOINTS } from './endpoint';
import type {
  AdminStats,
  AdminUser,
  BanPayload,
  PaginatedUsers,
  UserFilters,
} from '@/types/admin.types';
import type { AxiosResponse } from 'axios';

// ---------------------------------------------------------------------------
// Couche d'accès aux endpoints du back-office admin
//
// Toutes les URLs sont importées depuis ENDPOINTS — aucune chaîne en dur ici.
// L'instance httpClient gère automatiquement :
//   - le cookie CSRF (intercepteur request)
//   - la redirection 401 (intercepteur response)
// ---------------------------------------------------------------------------

const adminApi = {

  // ─── Statistiques ─────────────────────────────────────────────────────────

  /**
   * GET /api/v1/admin/stats
   * Retourne les compteurs globaux de la plateforme (users, bans, etc.).
   */
  getStats(): Promise<AxiosResponse<{ stats: AdminStats }>> {
    return httpClient.get(ENDPOINTS.admin.stats);
  },

  // ─── Utilisateurs ─────────────────────────────────────────────────────────

  /**
   * GET /api/v1/admin/users
   * Liste paginée des utilisateurs avec filtres optionnels.
   * Les filtres vides sont ignorés côté backend.
   */
  getUsers(filters: Partial<UserFilters>): Promise<AxiosResponse<PaginatedUsers>> {
    return httpClient.get(ENDPOINTS.admin.users.index, { params: filters });
  },

  /**
   * GET /api/v1/admin/users/:id
   * Détail complet d'un utilisateur, incluant l'historique de bans.
   */
  getUser(id: number): Promise<AxiosResponse<{ user: AdminUser }>> {
    return httpClient.get(ENDPOINTS.admin.users.show(id));
  },

  /**
   * POST /api/v1/admin/users/:id/ban
   * Applique un ban temporaire ou permanent à un utilisateur.
   * Révoque tous ses tokens Sanctum côté backend (déconnexion immédiate).
   */
  banUser(userId: number, payload: BanPayload): Promise<AxiosResponse<void>> {
    return httpClient.post(ENDPOINTS.admin.users.ban(userId), payload);
  },

  /**
   * DELETE /api/v1/admin/users/:id/ban
   * Lève le ban actif d'un utilisateur.
   * N'a aucun effet si l'utilisateur n'est pas banni (le backend retourne 422).
   */
  unbanUser(userId: number): Promise<AxiosResponse<void>> {
    return httpClient.delete(ENDPOINTS.admin.users.unban(userId));
  },

};

export default adminApi;