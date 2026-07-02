import type { ApiDataResponse, ApiPaginatedResponse, ForumReportReason } from './forum.types';

export type { ApiDataResponse, ApiPaginatedResponse };

export interface ItemSummary {
  gw2_id: number;
  name: string;
  icon_url: string | null;
  type: string;
  rarity: string;
  level: number;
  chat_link: string | null;
}

export interface ItemStatSet {
  id: number;
  name: string;
  attributes: Array<{ attribute: string; multiplier?: number; value?: number }>;
}

export interface Item {
  gw2_id: number;
  name: string;
  icon_url: string | null;
  description: string | null;
  chat_link: string | null;
  type: string;
  rarity: string;
  level: number;
  vendor_value: number;
  binding: 'none' | 'account' | 'soulbound';
  game_types: string[];
  flags: string[];
  restrictions: string[];
  details: Record<string, unknown> | null;
  stat_set: ItemStatSet | null;
  wiki_obtain: string | null;
  wiki_url: string | null;
  favorites_count?: number;
  is_favorited?: boolean;
  synced_at: string | null;
}

export interface ItemFacets {
  type?: Record<string, number>;
  rarity?: Record<string, number>;
  binding?: Record<string, number>;
  weapon_type?: Record<string, number>;
  armor_type?: Record<string, number>;
  armor_weight?: Record<string, number>;
}

export interface ApiFacetedResponse<T> extends ApiPaginatedResponse<T> {
  facets: ItemFacets;
}

export interface ItemFilters {
  q?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  type?: string[];
  rarity?: string[];
  binding?: string[];
  weapon_type?: string[];
  armor_type?: string[];
  armor_weight?: string[];
  stat_set_id?: number[];
  level_min?: number;
  level_max?: number;
  profession?: string;
  game_type?: string;
}

export interface ItemAuthor {
  id: number;
  nom: string;
  pseudo_gw2: string | null;
  avatar: string | null;
  role: string;
}

export interface ItemComment {
  id: number;
  item_id: number;
  user_id: number;
  content: string;
  author?: ItemAuthor;
  created_at: string | null;
  updated_at: string | null;
}

export interface ItemCommentPayload {
  content: string;
}

export interface ItemCommentReportPayload {
  reason: ForumReportReason;
  details?: string;
}

export interface ItemValidationErrors {
  content?: string[];
  reason?: string[];
  details?: string[];
}

export interface ItemApiError {
  message?: string;
  errors?: ItemValidationErrors;
}

export interface UserMention {
  id: number;
  nom: string;
  pseudo_gw2: string | null;
  avatar: string | null;
}
