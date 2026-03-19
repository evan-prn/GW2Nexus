// ═══════════════════════════════════════════════════════════════════
// src/components/contact/ContactHeroComponent/ContactHero.tsx
// Bloc hero de la page Contact :
// titre, sous-titre, grille des délais de réponse
// ═══════════════════════════════════════════════════════════════════

import { INFO_ITEMS } from '@/data/contact.data';
import styles from './ContactHero.module.css';

// ─── Composant ───────────────────────────────────────────────────────
// Pas de props — toutes les données viennent de contact.data.ts
export default function ContactHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Étiquette décorative */}
        <span className={styles.label}>Transmission Nexus</span>

        {/* Titre principal */}
        <h1 className={styles.title}>
          Échangez avec{' '}
          <span className={styles.titleAccent}>l'équipe</span>
        </h1>

        {/* Sous-titre */}
        <p className={styles.sub}>
          Une anomalie à signaler ou une idée pour l'avenir de la Tyrie ?
          Utilisez nos canaux de communication sécurisés.
        </p>

        {/* Grille délais de réponse */}
        <div className={styles.infoGrid}>
          {INFO_ITEMS.map((item) => (
            <div key={item.lbl} className={styles.infoCard}>
              <p className={styles.infoLabel}>{item.lbl}</p>
              <p className={styles.infoValue}>{item.val}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}