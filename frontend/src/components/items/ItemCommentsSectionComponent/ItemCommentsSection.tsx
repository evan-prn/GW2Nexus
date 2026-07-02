import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { useItemComments } from '@/hooks/items/useItemComments';
import { useItemCommentMutations } from '@/hooks/items/useItemCommentMutations';
import ItemCommentCard from '@/components/items/ItemCommentCardComponent/ItemCommentCard';
import styles from './ItemCommentsSection.module.css';

interface ItemCommentsSectionProps {
  gw2Id: number;
}

export default function ItemCommentsSection({ gw2Id }: ItemCommentsSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { comments, loading, error, setComments } = useItemComments(gw2Id);
  const { loading: mutating, createComment, updateComment, removeComment, reportComment } = useItemCommentMutations();
  const [draft, setDraft] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const result = await createComment(gw2Id, { content: draft.trim() });
    if (!result.success || !result.data) {
      setSubmitError(result.message ?? 'Impossible d\'ajouter le commentaire.');
      return;
    }

    setComments((current) => [...current, result.data!]);
    setDraft('');
  };

  const handleUpdate = async (commentId: number, content: string) => {
    const result = await updateComment(commentId, { content });
    if (result.success && result.data) {
      setComments((current) => current.map((c) => (c.id === commentId ? result.data! : c)));
    }
    return result;
  };

  const handleDelete = async (commentId: number) => {
    const result = await removeComment(commentId);
    if (result.success) {
      setComments((current) => current.filter((c) => c.id !== commentId));
    }
    return result;
  };

  return (
    <section className={styles.section} aria-labelledby="comments-title">
      <h2 id="comments-title" className={styles.title}>
        Commentaires {comments.length > 0 && <span className={styles.count}>({comments.length})</span>}
      </h2>

      {loading && <p className={styles.hint}>Chargement des commentaires…</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {comments.map((comment) => (
          <ItemCommentCard
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
            currentUserRole={user?.role}
            isAuthenticated={isAuthenticated}
            isBusy={mutating}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onReport={reportComment}
          />
        ))}
        {!loading && comments.length === 0 && (
          <p className={styles.hint}>Aucun commentaire pour le moment. Soyez le premier à en laisser un.</p>
        )}
      </div>

      {isAuthenticated ? (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="new-comment" className={styles.label}>Ajouter un commentaire</label>
          <textarea
            id="new-comment"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={styles.textarea}
            minLength={2}
            maxLength={5000}
            required
            placeholder="Partagez vos conseils, votre avis, ou comment vous avez obtenu cet objet…"
          />
          {submitError && <p className={styles.error}>{submitError}</p>}
          <button type="submit" className={styles.submitBtn} disabled={mutating || draft.trim().length < 2}>
            Publier
          </button>
        </form>
      ) : (
        <p className={styles.hint}>
          <Link to="/login" className={styles.loginLink}>Connectez-vous</Link> pour publier un commentaire.
        </p>
      )}
    </section>
  );
}
