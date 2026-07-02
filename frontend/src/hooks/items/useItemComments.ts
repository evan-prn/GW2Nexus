import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchItemComments } from '@/api/item.api';
import type { ItemApiError, ItemComment } from '@/types/item.types';
import type { PaginationMeta } from '@/types/forum.types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ItemApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
};

export const useItemComments = (gw2Id: number | undefined, page = 1) => {
  const [comments, setComments] = useState<ItemComment[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(Boolean(gw2Id));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!gw2Id) {
      setComments([]);
      setMeta(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchItemComments(gw2Id, page);
      setComments(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de charger les commentaires.'));
    } finally {
      setLoading(false);
    }
  }, [gw2Id, page]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { comments, meta, loading, error, reload, setComments };
};
