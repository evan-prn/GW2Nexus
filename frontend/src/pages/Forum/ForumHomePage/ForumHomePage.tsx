import ForumCategoryCard from '@/components/forum/ForumCategoryCardComponent/ForumCategoryCard';
import { useForumCategories } from '@/hooks/forum/useForumCategories';
import usePageTitle from '@/hooks/usePageTitle';
import styles from './ForumHomePage.module.css';

export default function ForumHomePage() {
  usePageTitle('Forum');

  const { categories, loading, error } = useForumCategories();

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>GW2Nexus Forum</p>
        <h1 className={styles.title}>Le registre des aventuriers</h1>
        <p className={styles.subtitle}>
          Retrouvez les discussions de la communaute, les builds, les guildes et les sorties en Tyrie.
        </p>
      </header>

      {loading && <p className={styles.state}>Chargement des categories...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p className={styles.state}>Aucune categorie disponible pour le moment.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className={styles.grid}>
          {categories.map((category) => (
            <ForumCategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
