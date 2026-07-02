import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { ForumPost, ForumPostReportPayload, ForumReportReason } from '@/types/forum.types';
import ForumContent from '@/components/forum/ForumContentComponent/ForumContent';
import styles from './ForumPostCard.module.css';

interface ForumPostCardProps {
  post: ForumPost;
  currentUserId?: number;
  currentUserRole?: string;
  isAuthenticated?: boolean;
  isBusy?: boolean;
  onReplyToPost?: (post: ForumPost) => void;
  onUpdate?: (postId: number, content: string) => Promise<{ success: boolean; message?: string }>;
  onDelete?: (postId: number) => Promise<{ success: boolean; message?: string }>;
  onReport?: (postId: number, payload: ForumPostReportPayload) => Promise<{ success: boolean; message?: string }>;
}

export default function ForumPostCard({
  post,
  currentUserId,
  currentUserRole,
  isAuthenticated = false,
  isBusy = false,
  onReplyToPost,
  onUpdate,
  onDelete,
  onReport,
}: ForumPostCardProps) {
  const canManage = canManagePost(post, currentUserId, currentUserRole);
  const canReport = isAuthenticated && currentUserId !== undefined && post.user_id !== currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [draftContent, setDraftContent] = useState(post.content);
  const [reportData, setReportData] = useState<ForumPostReportPayload>({
    reason: 'inappropriate',
    details: '',
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDraftChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(event.target.value);
    setActionError(null);
  };

  const handleReportChange = (event: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setReportData((current) => ({
      ...current,
      [name]: name === 'reason' ? value as ForumReportReason : value,
    }));
    setActionError(null);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onUpdate || isBusy) return;

    const result = await onUpdate(post.id, draftContent.trim());

    if (!result.success) {
      setActionError(result.message ?? 'Impossible de modifier le message.');
      return;
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete || isBusy) return;

    const confirmed = window.confirm('Supprimer ce message ? Cette action est definitive.');
    if (!confirmed) return;

    const result = await onDelete(post.id);

    if (!result.success) {
      setActionError(result.message ?? 'Impossible de supprimer le message.');
    }
  };

  const handleReportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onReport || isBusy) return;

    const result = await onReport(post.id, {
      reason: reportData.reason,
      details: reportData.details?.trim() ?? '',
    });

    if (!result.success) {
      setActionError(result.message ?? 'Impossible d envoyer le signalement.');
      return;
    }

    setIsReporting(false);
    setActionSuccess(result.message ?? 'Signalement envoye a la moderation.');
  };

  return (
    <article className={styles.card}>
      <aside className={styles.author}>
        <div className={styles.avatar}>{post.author?.nom?.charAt(0).toUpperCase() ?? '?'}</div>
        <strong>{post.author?.nom ?? 'Aventurier'}</strong>
        {post.author?.pseudo_gw2 && <span>{post.author.pseudo_gw2}</span>}
        <small className={styles.role}>{formatRole(post.author?.role)}</small>
      </aside>
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <p className={styles.date}>{formatDate(post.created_at)}</p>
          <div className={styles.actions}>
            {isAuthenticated && onReplyToPost && (
              <button type="button" className={styles.actionButton} onClick={() => onReplyToPost(post)}>
                Repondre
              </button>
            )}
            {canReport && onReport && !isReporting && (
              <button type="button" className={styles.actionButton} onClick={() => setIsReporting(true)}>
                Signaler
              </button>
            )}
            {canManage && !isEditing && (
              <>
                <button type="button" className={styles.actionButton} onClick={() => setIsEditing(true)}>
                  Editer
                </button>
                <button type="button" className={styles.dangerButton} onClick={handleDelete} disabled={isBusy}>
                  Supprimer
                </button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <form className={styles.editForm} onSubmit={handleEditSubmit} noValidate>
            <textarea
              value={draftContent}
              onChange={handleDraftChange}
              className={styles.editTextarea}
              minLength={2}
              required
            />
            {actionError && <p className={styles.actionError}>{actionError}</p>}
            <div className={styles.editActions}>
              <button type="button" className={styles.actionButton} onClick={() => {
                setDraftContent(post.content);
                setIsEditing(false);
                setActionError(null);
              }}>
                Annuler
              </button>
              <button type="submit" className={styles.saveButton} disabled={isBusy}>
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <>
            {isReporting && (
              <form className={styles.reportForm} onSubmit={handleReportSubmit} noValidate>
                <label className={styles.reportLabel} htmlFor={`report-reason-${post.id}`}>
                  Motif du signalement
                </label>
                <select
                  id={`report-reason-${post.id}`}
                  name="reason"
                  value={reportData.reason}
                  onChange={handleReportChange}
                  className={styles.reportSelect}
                >
                  <option value="spam">Spam</option>
                  <option value="insult">Insulte</option>
                  <option value="harassment">Harcelement</option>
                  <option value="inappropriate">Contenu inapproprie</option>
                  <option value="other">Autre</option>
                </select>
                <textarea
                  name="details"
                  value={reportData.details}
                  onChange={handleReportChange}
                  className={styles.reportTextarea}
                  placeholder="Details optionnels pour aider la moderation..."
                  maxLength={2000}
                />
                <div className={styles.editActions}>
                  <button type="button" className={styles.actionButton} onClick={() => {
                    setIsReporting(false);
                    setActionError(null);
                  }}>
                    Annuler
                  </button>
                  <button type="submit" className={styles.saveButton} disabled={isBusy}>
                    Envoyer
                  </button>
                </div>
              </form>
            )}
            {actionSuccess && <p className={styles.actionSuccess}>{actionSuccess}</p>}
            {actionError && <p className={styles.actionError}>{actionError}</p>}
            <ForumContent content={post.content} />
          </>
        )}
      </div>
    </article>
  );
}

const formatDate = (value: string | null): string => {
  if (!value) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

const canManagePost = (post: ForumPost, currentUserId: number | undefined, currentUserRole: string | undefined): boolean => {
  if (!currentUserId) return false;
  if (post.user_id === currentUserId) return true;
  return currentUserRole === 'admin' || currentUserRole === 'moderateur';
};

const formatRole = (role: string | undefined): string => {
  if (role === 'admin') return 'Admin';
  if (role === 'moderateur') return 'Moderateur';
  return 'Membre';
};
