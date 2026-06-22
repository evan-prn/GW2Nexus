import { Link } from 'react-router-dom';
import type { ForumCategory } from '@/types/forum.types';
import styles from './ForumCategoryCard.module.css';

interface ForumCategoryCardProps {
  category: ForumCategory;
}

export default function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  return (
    <Link to={`/forum/${category.slug}`} className={styles.card}>
      <div className={styles.icon} aria-hidden="true">{resolveIcon(category.icon)}</div>
      <div className={styles.content}>
        <h2 className={styles.title}>{category.name}</h2>
        <p className={styles.description}>{category.description}</p>
      </div>
      <div className={styles.stats}>
        <span><strong>{category.threads_count ?? 0}</strong> sujets</span>
        <span><strong>{category.posts_count ?? 0}</strong> messages</span>
      </div>
    </Link>
  );
}

const resolveIcon = (icon: string | null): string => {
  const icons: Record<string, string> = {
    'message-circle': 'C',
    shield: 'B',
    castle: 'G',
    gem: 'O',
    map: 'E',
    'help-circle': '?',
  };

  return icon ? icons[icon] ?? 'F' : 'F';
};
