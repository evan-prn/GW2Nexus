import { useCallback, useState } from 'react';
import axios from 'axios';
import {
  createForumPost,
  createForumThread,
  deleteForumPost,
  reportForumPost,
  updateForumPost,
} from '../../api/forum.api';
import type {
  ForumApiError,
  ForumPost,
  ForumPostPayload,
  ForumPostReport,
  ForumPostReportPayload,
  ForumThread,
  ForumThreadPayload,
  ForumValidationErrors,
} from '../../types/forum.types';

interface MutationResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ForumValidationErrors;
}

const getMutationError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ForumApiError>(error)) {
    return {
      message: error.response?.data?.message ?? fallback,
      errors: error.response?.data?.errors,
    };
  }

  return { message: fallback, errors: undefined };
};

export const useForumMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createThread = useCallback(
    async (categorySlug: string, payload: ForumThreadPayload): Promise<MutationResult<ForumThread>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await createForumThread(categorySlug, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible de creer le sujet.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createPost = useCallback(
    async (threadSlug: string, payload: ForumPostPayload): Promise<MutationResult<ForumPost>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await createForumPost(threadSlug, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible d ajouter la reponse.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updatePost = useCallback(
    async (postId: number, payload: ForumPostPayload): Promise<MutationResult<ForumPost>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await updateForumPost(postId, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible de modifier le message.');
        setError(parsed.message);
        return { success: false, message: parsed.message, errors: parsed.errors };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const removePost = useCallback(async (postId: number): Promise<MutationResult<null>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteForumPost(postId);
      return { success: true, data: null, message: response.message };
    } catch (err) {
      const parsed = getMutationError(err, 'Impossible de supprimer le message.');
      setError(parsed.message);
      return { success: false, message: parsed.message, errors: parsed.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const reportPost = useCallback(
    async (postId: number, payload: ForumPostReportPayload): Promise<MutationResult<ForumPostReport>> => {
      setLoading(true);
      setError(null);

      try {
        const response = await reportForumPost(postId, payload);
        return { success: true, data: response.data, message: response.message };
      } catch (err) {
        const parsed = getMutationError(err, 'Impossible d envoyer le signalement.');
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
    createThread,
    createPost,
    updatePost,
    removePost,
    reportPost,
  };
};
