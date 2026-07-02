import { useCallback, useState } from 'react';
import axios from 'axios';
import {
  createItemComment,
  deleteItemComment,
  reportItemComment,
  updateItemComment,
} from '@/api/item.api';
import type {
  ItemApiError,
  ItemComment,
  ItemCommentPayload,
  ItemCommentReportPayload,
  ItemValidationErrors,
} from '@/types/item.types';

interface MutationResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ItemValidationErrors;
}

const getMutationError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ItemApiError>(error)) {
    return {
      message: error.response?.data?.message ?? fallback,
      errors: error.response?.data?.errors,
    };
  }
  return { message: fallback, errors: undefined };
};

/** Miroir de useForumMutations — CRUD + signalement des commentaires d'objets. */
export const useItemCommentMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComment = useCallback(
    async (gw2Id: number, payload: ItemCommentPayload): Promise<MutationResult<ItemComment>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await createItemComment(gw2Id, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible d\'ajouter le commentaire.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateComment = useCallback(
    async (commentId: number, payload: ItemCommentPayload): Promise<MutationResult<ItemComment>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await updateItemComment(commentId, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible de modifier le commentaire.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removeComment = useCallback(async (commentId: number): Promise<MutationResult<null>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteItemComment(commentId);
      return { success: true, data: null, message: response.message };
    } catch (err) {
      const parsed = getMutationError(err, 'Impossible de supprimer le commentaire.');
      setError(parsed.message);
      return { success: false, message: parsed.message, errors: parsed.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const reportComment = useCallback(
    async (commentId: number, payload: ItemCommentReportPayload): Promise<MutationResult<{ id: number }>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await reportItemComment(commentId, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible d\'envoyer le signalement.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    clearError: () => setError(null),
    createComment,
    updateComment,
    removeComment,
    reportComment,
  };
};
