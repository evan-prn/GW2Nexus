import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchForumCategories, fetchForumCategory } from '../../api/forum.api';
import type { ForumApiError, ForumCategory } from '../../types/forum.types';

const getForumErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ForumApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchForumCategories();
      setCategories(response.data);
    } catch (err) {
      setError(getForumErrorMessage(err, 'Impossible de charger les categories du forum.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { categories, loading, error, reload };
};

export const useForumCategory = (categorySlug: string | undefined) => {
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [loading, setLoading] = useState(Boolean(categorySlug));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!categorySlug) {
      setCategory(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchForumCategory(categorySlug);
      setCategory(response.data);
    } catch (err) {
      setError(getForumErrorMessage(err, 'Impossible de charger cette categorie.'));
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { category, loading, error, reload };
};
