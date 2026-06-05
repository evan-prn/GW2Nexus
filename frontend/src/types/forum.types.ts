export interface ForumAuthor {
  id: number;
  nom: string;
  pseudo_gw2: string | null;
  avatar: string | null;
  role: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  threads_count?: number;
  posts_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ForumThread {
  id: number;
  forum_category_id: number;
  user_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  is_locked: boolean;
  is_pinned: boolean;
  views_count: number;
  posts_count?: number;
  last_post_at: string | null;
  category?: ForumCategory;
  author?: ForumAuthor;
  created_at: string | null;
  updated_at: string | null;
}

export interface ForumPost {
  id: number;
  forum_thread_id: number;
  user_id: number;
  content: string;
  is_solution: boolean;
  author?: ForumAuthor;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiDataResponse<T> {
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ForumThreadPayload {
  title: string;
  content: string;
}

export interface ForumPostPayload {
  content: string;
}

export type ForumReportReason = 'spam' | 'insult' | 'harassment' | 'inappropriate' | 'other';

export interface ForumPostReport {
  id: number;
  forum_post_id: number;
  reporter_id: number;
  reason: ForumReportReason;
  details: string | null;
  status: 'open' | 'reviewed' | 'dismissed';
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ForumPostReportPayload {
  reason: ForumReportReason;
  details?: string;
}

export interface ForumValidationErrors {
  title?: string[];
  content?: string[];
  reason?: string[];
  details?: string[];
}

export interface ForumApiError {
  message?: string;
  errors?: ForumValidationErrors;
}
