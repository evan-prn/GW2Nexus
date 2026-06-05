import { Link } from 'react-router-dom';
import type { ForumThread } from '@/types/forum.types';
import styles from './ForumThreadCard.module.css';

interface ForumThreadCardProps {
  thread: ForumThread;
}

export default function ForumThreadCard({ thread }: ForumThreadCardProps) {
  return (
    <Link to={`/forum/thread/${thread.slug}`} className={styles.card}>
      <div className={styles.marker} aria-hidden="true">
        {thread.is_pinned ? 'P' : thread.is_locked ? 'L' : 'S'}
      </div>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{thread.title}</h2>
          {thread.is_pinned && <span className={styles.badge}>Epingle</span>}
          {thread.is_locked && <span className={styles.badge}>Verrouille</span>}
        </div>
        <p className={styles.excerpt}>{thread.excerpt ?? 'Aucun extrait disponible.'}</p>
        <p className={styles.meta}>
          Par {thread.author?.nom ?? 'Aventurier'} - {formatDate(thread.created_at)}
        </p>
      </div>
      <div className={styles.stats}>
        <span>{thread.posts_count ?? 0} messages</span>
        <span>{thread.views_count} vues</span>
      </div>
    </Link>
  );
}

const formatDate = (value: string | null): string => {
  if (!value) return 'date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
};
