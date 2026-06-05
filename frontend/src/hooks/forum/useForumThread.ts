import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchForumThread, fetchForumThreadPosts } from '../../api/forum.api';
import type { ForumApiError, ForumPost, ForumThread, PaginationMeta } from '../../types/forum.types';

const getForumErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ForumApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useForumThread = (threadSlug: string | undefined, page = 1) => {
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(Boolean(threadSlug));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!threadSlug) {
      setThread(null);
      setPosts([]);
      setMeta(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [threadResponse, postsResponse] = await Promise.all([
        fetchForumThread(threadSlug),
        fetchForumThreadPosts(threadSlug, page),
      ]);

      setThread(threadResponse.data);
      setPosts(postsResponse.data);
      setMeta(postsResponse.meta);
    } catch (err) {
      setError(getForumErrorMessage(err, 'Impossible de charger ce sujet.'));
    } finally {
      setLoading(false);
    }
  }, [threadSlug, page]);

  const appendPost = useCallback((post: ForumPost) => {
    setPosts((currentPosts) => [...currentPosts, post]);
    setMeta((currentMeta) => {
      if (!currentMeta) return currentMeta;

      return {
        ...currentMeta,
        total: currentMeta.total + 1,
      };
    });
    setThread((currentThread) => {
      if (!currentThread) return currentThread;

      return {
        ...currentThread,
        posts_count: (currentThread.posts_count ?? posts.length) + 1,
        last_post_at: post.created_at,
      };
    });
  }, [posts.length]);

  const replacePost = useCallback((updatedPost: ForumPost) => {
    setPosts((currentPosts) => currentPosts.map((post) => (
      post.id === updatedPost.id ? updatedPost : post
    )));
  }, []);

  const removePostById = useCallback((postId: number) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
    setMeta((currentMeta) => {
      if (!currentMeta) return currentMeta;

      return {
        ...currentMeta,
        total: Math.max(0, currentMeta.total - 1),
      };
    });
    setThread((currentThread) => {
      if (!currentThread) return currentThread;

      return {
        ...currentThread,
        posts_count: Math.max(0, (currentThread.posts_count ?? posts.length) - 1),
      };
    });
  }, [posts.length]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { thread, posts, meta, loading, error, reload, appendPost, replacePost, removePostById };
};
