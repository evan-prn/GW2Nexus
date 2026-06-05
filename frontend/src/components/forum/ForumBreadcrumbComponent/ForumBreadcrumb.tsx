import { Link } from 'react-router-dom';
import styles from './ForumBreadcrumb.module.css';

interface Crumb {
  label: string;
  href?: string;
}

interface ForumBreadcrumbProps {
  items: Crumb[];
}

export default function ForumBreadcrumb({ items }: ForumBreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Fil d'Ariane forum">
      <Link to="/forum" className={styles.link}>Forum</Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? 'current'}`} className={styles.item}>
          <span className={styles.separator}>/</span>
          {item.href ? (
            <Link to={item.href} className={styles.link}>{item.label}</Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
