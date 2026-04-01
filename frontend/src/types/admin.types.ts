// src/features/admin/types/admin.types.ts

/**
 * Représente un ban actif sur un utilisateur, incluant les détails du type de ban, la raison, 
 * les dates d'expiration et de création, ainsi que l'identité de l'administrateur qui a appliqué le ban.
 */
export interface ActiveBan {
  id: number;
  type: 'temporary' | 'permanent';
  reason: string;
  expires_at: string | null;
  banned_at: string;
  banned_by: string | null;
}

/**
 * Représente une entrée dans l'historique des bans d'un utilisateur, incluant les détails du ban actif
 * ainsi que les informations sur le moment où le ban a été levé et par qui, si applicable.
 */
export interface BanHistoryEntry extends ActiveBan {
  lifted_at: string | null;
  lifted_by: string | null;
  is_active: boolean;
}

/**
 * Représente un utilisateur dans le contexte de l'administration, avec des informations supplémentaires
 * telles que les détails de son ban actif et son historique de bans.
 */
export interface AdminUser {
  id: number;
  nom: string;
  email: string;
  pseudo_gw2: string | null;
  avatar: string | null;
  role: 'user' | 'moderateur' | 'admin';
  has_api_key: boolean;
  created_at: string;
  deleted_at: string | null;
  is_banned: boolean;
  active_ban: ActiveBan | null;
  ban_history?: BanHistoryEntry[];
}

/**
 * Représente les statistiques globales du système d'administration, incluant le nombre total d'utilisateurs,
 * le nombre d'utilisateurs actifs, bannis, supprimés, ainsi que le nombre d'administrateurs et de modérateurs.
 */
export interface AdminStats {
  total_users: number;
  active_users: number;
  banned_users: number;
  deleted_users: number;
  admins: number;
  moderateurs: number;
}

// ─────────────────────────────────────────────
// Payloads API
// ─────────────────────────────────────────────

export interface BanPayload {
  type: 'temporary' | 'permanent';
  reason: string;
  expires_at?: string | null;
}

// ─────────────────────────────────────────────
// Filtres de liste
// ─────────────────────────────────────────────

/**
 * Représente les critères de filtrage pour la liste des utilisateurs dans l'interface d'administration,
 * incluant la recherche par nom ou email, le filtrage par rôle et statut, ainsi que les paramètres de pagination.
 */
export interface UserFilters {
  search: string;
  role: '' | 'user' | 'moderateur' | 'admin';
  status: '' | 'active' | 'banned' | 'deleted';
  per_page: number;
  page: number;
}

// ─────────────────────────────────────────────
// Réponses API paginées
// ─────────────────────────────────────────────

export interface PaginatedUsers {
  data: AdminUser[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
