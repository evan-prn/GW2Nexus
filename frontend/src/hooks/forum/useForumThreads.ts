import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchForumCategoryThreads } from '../../api/forum.api';
import type { ForumApiError, ForumThread, PaginationMeta } from '../../types/forum.types';

const getForumErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ForumApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useForumThreads = (categorySlug: string | undefined, page = 1) => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(Boolean(categorySlug));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!categorySlug) {
      setThreads([]);
      setMeta(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchForumCategoryThreads(categorySlug, page);
      setThreads(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getForumErrorMessage(err, 'Impossible de charger les sujets du forum.'));
    } finally {
      setLoading(false);
    }
  }, [categorySlug, page]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { threads, meta, loading, error, reload };
};
