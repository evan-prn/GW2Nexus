import { Link, useParams } from 'react-router-dom';
import ForumBreadcrumb from '@/components/forum/ForumBreadcrumbComponent/ForumBreadcrumb';
import ForumThreadCard from '@/components/forum/ForumThreadCardComponent/ForumThreadCard';
import { useForumCategory } from '@/hooks/forum/useForumCategories';
import { useForumThreads } from '@/hooks/forum/useForumThreads';
import useAuthStore from '@/store/authStore';
import usePageTitle from '@/hooks/usePageTitle';
import styles from './ForumCategoryPage.module.css';

export default function ForumCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { isAuthenticated } = useAuthStore();
  const { category, loading: categoryLoading, error: categoryError } = useForumCategory(categorySlug);
  const { threads, meta, loading: threadsLoading, error: threadsError } = useForumThreads(categorySlug);

  usePageTitle(category ? `Forum - ${category.name}` : 'Forum');

  const loading = categoryLoading || threadsLoading;
  const error = categoryError ?? threadsError;

  return (
    <section className={styles.page}>
      <ForumBreadcrumb items={[{ label: category?.name ?? categorySlug ?? 'Categorie' }]} />

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Categorie</p>
          <h1 className={styles.title}>{category?.name ?? 'Forum'}</h1>
          <p className={styles.subtitle}>{category?.description ?? 'Chargement de la categorie...'}</p>
        </div>

        {isAuthenticated ? (
          <Link to={`/forum/new/${categorySlug}`} className={styles.action}>Creer un sujet</Link>
        ) : (
          <Link to="/login" className={styles.actionSecondary}>Se connecter pour participer</Link>
        )}
      </header>

      {loading && <p className={styles.state}>Chargement des sujets...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && threads.length === 0 && (
        <div className={styles.empty}>
          <h2>Aucun sujet pour le moment</h2>
          <p>Cette categorie attend encore son premier aventurier bavard.</p>
        </div>
      )}

      {!loading && !error && threads.length > 0 && (
        <>
          <div className={styles.list}>
            {threads.map((thread) => (
              <ForumThreadCard key={thread.slug} thread={thread} />
            ))}
          </div>
          {meta && <p className={styles.pagination}>Page {meta.current_page} sur {meta.last_page}</p>}
        </>
      )}
    </section>
  );
}
