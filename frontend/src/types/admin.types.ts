// src/features/admin/types/admin.types.ts

// ─────────────────────────────────────────────
// Entités
// ─────────────────────────────────────────────

export interface ActiveBan {
  id: number;
  type: 'temporary' | 'permanent';
  reason: string;
  expires_at: string | null;
  banned_at: string;
  banned_by: string | null;
}

export interface BanHistoryEntry extends ActiveBan {
  lifted_at: string | null;
  lifted_by: string | null;
  is_active: boolean;
}

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
