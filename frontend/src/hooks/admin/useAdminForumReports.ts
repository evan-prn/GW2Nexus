import { useCallback, useEffect, useState } from 'react';
import adminApi from '@/api/admin.api';
import type { ForumReportFilters, PaginatedForumReports } from '@/types/admin.types';

const DEFAULT_FILTERS: ForumReportFilters = {
  status: 'open',
  reason: '',
  per_page: 20,
  page: 1,
};

export function useAdminForumReports() {
  const [result, setResult] = useState<PaginatedForumReports | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ForumReportFilters>(DEFAULT_FILTERS);

  const fetch = useCallback(async (nextFilters: ForumReportFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminApi.getForumReports(nextFilters);
      setResult(response.data);
    } catch {
      setError('Impossible de charger les signalements forum.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch(filters);
  }, [filters, fetch]);

  const updateFilter = useCallback((key: keyof ForumReportFilters, value: string | number) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }));
  }, []);

  const refresh = useCallback(() => fetch(filters), [fetch, filters]);

  const moderateReport = useCallback(async (
    reportId: number,
    status: 'reviewed' | 'dismissed',
  ) => {
    setLoading(true);
    setError(null);

    try {
      await adminApi.updateForumReport(reportId, { status });
      await fetch(filters);
      return true;
    } catch {
      setError('Impossible de mettre a jour le signalement.');
      setLoading(false);
      return false;
    }
  }, [fetch, filters]);

  const toggleThreadLock = useCallback(async (threadId: number) => {
    setLoading(true);
    setError(null);

    try {
      await adminApi.toggleForumThreadLock(threadId);
      await fetch(filters);
      return true;
    } catch {
      setError('Impossible de modifier le verrouillage du sujet.');
      setLoading(false);
      return false;
    }
  }, [fetch, filters]);

  const toggleThreadPin = useCallback(async (threadId: number) => {
    setLoading(true);
    setError(null);

    try {
      await adminApi.toggleForumThreadPin(threadId);
      await fetch(filters);
      return true;
    } catch {
      setError('Impossible de modifier l epinglage du sujet.');
      setLoading(false);
      return false;
    }
  }, [fetch, filters]);

  return {
    result,
    loading,
    error,
    filters,
    updateFilter,
    setPage,
    refresh,
    moderateReport,
    toggleThreadLock,
    toggleThreadPin,
  };
}
