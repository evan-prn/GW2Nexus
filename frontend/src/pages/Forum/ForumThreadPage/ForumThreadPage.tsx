import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ChangeEvent, FormEvent } from 'react';
import ForumBreadcrumb from '@/components/forum/ForumBreadcrumbComponent/ForumBreadcrumb';
import ForumPostCard from '@/components/forum/ForumPostCardComponent/ForumPostCard';
import { useForumMutations } from '@/hooks/forum/useForumMutations';
import { useForumThread } from '@/hooks/forum/useForumThread';
import useAuthStore from '@/store/authStore';
import usePageTitle from '@/hooks/usePageTitle';
import type { ForumPost, ForumPostReportPayload } from '@/types/forum.types';
import styles from './ForumThreadPage.module.css';

export default function ForumThreadPage() {
  const { threadSlug } = useParams<{ threadSlug: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const { thread, posts, meta, loading, error, appendPost, replacePost, removePostById } = useForumThread(threadSlug);
  const {
    createPost,
    updatePost,
    removePost,
    reportPost,
    loading: mutationLoading,
    error: replyError,
    clearError,
  } = useForumMutations();
  const [replyContent, setReplyContent] = useState('');
  const [replyFieldError, setReplyFieldError] = useState<string | null>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canModerate = user?.role === 'admin' || user?.role === 'moderateur';

  usePageTitle(thread ? `Forum - ${thread.title}` : 'Forum');

  const handleReplyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(event.target.value);
    setReplyFieldError(null);
    if (replyError) clearError();
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!threadSlug || mutationLoading) return;

    setReplyFieldError(null);

    const result = await createPost(threadSlug, {
      content: replyContent.trim(),
    });

    if (!result.success) {
      setReplyFieldError(result.errors?.content?.[0] ?? null);
      return;
    }

    if (result.data) {
      appendPost(result.data);
      setReplyContent('');
    }
  };

  const handleReplyToPost = (post: ForumPost) => {
    const authorName = post.author?.nom ?? 'Aventurier';
    const replyContext = formatReplyContext(authorName, post.content);

    setReplyContent((currentContent) => {
      if (!currentContent.trim()) return `${replyContext}\n\n`;
      return `${currentContent.trim()}\n\n${replyContext}\n\n`;
    });

    window.setTimeout(() => {
      replyTextareaRef.current?.focus();
      replyTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
  };

  const handleUpdatePost = async (postId: number, content: string) => {
    const result = await updatePost(postId, { content });

    if (result.success && result.data) {
      replacePost(result.data);
    }

    return { success: result.success, message: result.message };
  };

  const handleDeletePost = async (postId: number) => {
    const result = await removePost(postId);

    if (result.success) {
      removePostById(postId);
    }

    return { success: result.success, message: result.message };
  };

  const handleReportPost = async (postId: number, payload: ForumPostReportPayload) => {
    const result = await reportPost(postId, payload);

    return { success: result.success, message: result.message };
  };

  return (
    <section className={styles.page}>
      <ForumBreadcrumb
        items={[
          {
            label: thread?.category?.name ?? 'Categorie',
            href: thread?.category ? `/forum/${thread.category.slug}` : undefined,
          },
          { label: thread?.title ?? 'Sujet' },
        ]}
      />

      <header className={styles.header}>
        <p className={styles.kicker}>Sujet</p>
        <h1 className={styles.title}>{thread?.title ?? 'Chargement du sujet...'}</h1>
        {thread && (
          <>
            <div className={styles.badges}>
              {thread.is_pinned && <span className={styles.badge}>Epingle</span>}
              {thread.is_locked && <span className={styles.badge}>Verrouille</span>}
            </div>
            <p className={styles.meta}>
              Par {thread.author?.nom ?? 'Aventurier'} - {thread.views_count} vues - {thread.posts_count ?? 0} messages
            </p>
          </>
        )}
      </header>

      {loading && <p className={styles.state}>Chargement du sujet...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className={styles.state}>Aucun message disponible pour ce sujet.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <>
          <div className={styles.posts}>
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                currentUserRole={user?.role}
                isAuthenticated={isAuthenticated}
                isBusy={mutationLoading}
                onReplyToPost={handleReplyToPost}
                onUpdate={handleUpdatePost}
                onDelete={handleDeletePost}
                onReport={handleReportPost}
              />
            ))}
          </div>
          {meta && <p className={styles.pagination}>Page {meta.current_page} sur {meta.last_page}</p>}
        </>
      )}

      {!loading && !error && thread && (
        <>
          {canModerate && (
            <aside className={styles.moderationPanel}>
              <p className={styles.moderationTitle}>Actions de moderation</p>
              <p className={styles.moderationText}>
                Preparation UI uniquement. Les actions verrouiller, epingler ou supprimer un sujet seront branchees
                quand les endpoints dedies seront disponibles.
              </p>
            </aside>
          )}

          <div className={styles.replyHint}>
            {thread.is_locked ? (
              <p>Ce sujet est verrouille.</p>
            ) : isAuthenticated ? (
              <form className={styles.replyForm} onSubmit={handleReplySubmit} noValidate>
                <label className={styles.replyLabel} htmlFor="forum-reply-content">
                  Repondre au sujet
                </label>
                <textarea
                  id="forum-reply-content"
                  ref={replyTextareaRef}
                  name="content"
                  value={replyContent}
                  onChange={handleReplyChange}
                  className={styles.replyTextarea}
                  placeholder="Partage ta reponse avec la communaute..."
                  minLength={3}
                  required
                />
                {(replyFieldError || replyError) && (
                  <p className={styles.replyError} role="alert">
                    {replyFieldError ?? replyError}
                  </p>
                )}
                <button type="submit" className={styles.replySubmit} disabled={mutationLoading}>
                  {mutationLoading ? 'Publication...' : 'Publier la reponse'}
                </button>
              </form>
            ) : (
              <p><Link to="/login">Connecte-toi</Link> pour repondre a ce sujet.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

const formatReplyContext = (authorName: string, content: string): string => {
  const quotedContent = content
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');

  return `Reponse a ${authorName}:\n${quotedContent}`;
};
