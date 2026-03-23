// src/hooks/admin/useAdminUsers.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import adminApi from '@/api/admin.api';
import type {
  AdminUser,
  AdminStats,
  BanPayload,
  PaginatedUsers,
  UserFilters,
} from '@/types/admin.types';

// ─────────────────────────────────────────────
// Hook : liste + filtres utilisateurs
// ─────────────────────────────────────────────

const DEFAULT_FILTERS: UserFilters = {
  search:   '',
  role:     '',
  status:   '',
  per_page: 20,
  page:     1,
};

export function useAdminUsers() {
  const [result, setResult]   = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);

  // Délai de debounce pour la recherche
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async (f: UserFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers(f);
      setResult(res.data);
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(filters);
  }, [filters, fetch]);

  /** Met à jour un filtre et remet la pagination à la page 1 */
  const updateFilter = useCallback(
    (key: keyof UserFilters, value: string | number) => {
      if (key === 'search') {
        // Debounce 400ms sur la recherche textuelle
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
          setFilters(prev => ({ ...prev, search: value as string, page: 1 }));
        }, 400);
      } else {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
      }
    },
    [],
  );

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => fetch(filters), [filters, fetch]);

  return { result, loading, error, filters, updateFilter, setPage, refresh };
}

// ─────────────────────────────────────────────
// Hook : stats globales
// ─────────────────────────────────────────────

export function useAdminStats() {
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res.data.stats))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

// ─────────────────────────────────────────────
// Hook : actions de modération (ban / unban)
// ─────────────────────────────────────────────

export function useBanActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const ban = useCallback(async (user: AdminUser, payload: BanPayload) => {
    setLoading(true);
    setError(null);
    try {
      await adminApi.banUser(user.id, payload);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Erreur lors du ban.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const unban = useCallback(async (user: AdminUser) => {
    setLoading(true);
    setError(null);
    try {
      await adminApi.unbanUser(user.id);
      onSuccess?.();
    } catch {
      setError('Erreur lors de la levée du ban.');
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return { ban, unban, loading, error };
}
