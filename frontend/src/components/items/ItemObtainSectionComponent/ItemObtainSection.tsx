import type { Item } from '@/types/item.types';
import styles from './ItemObtainSection.module.css';

interface ItemObtainSectionProps {
  item: Item;
}

/**
 * Contenu curé manuellement (wiki_obtain/wiki_url) — pas de scraping
 * automatique du wiki officiel (fragile). Architecture prête à recevoir
 * un enrichissement automatisé plus tard sans changer l'affichage.
 */
export default function ItemObtainSection({ item }: ItemObtainSectionProps) {
  if (!item.wiki_obtain && !item.wiki_url) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="obtain-title">
      <h2 id="obtain-title" className={styles.title}>Comment obtenir cet objet</h2>

      {item.wiki_obtain && <p className={styles.text}>{item.wiki_obtain}</p>}

      {item.wiki_url && (
        <a
          className={styles.wikiLink}
          href={item.wiki_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Voir ${item.name} sur le wiki GW2 (ouvre un nouvel onglet)`}
        >
          Voir sur le wiki GW2 ↗
        </a>
      )}
    </section>
  );
}
