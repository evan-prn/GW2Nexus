// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutFeaturesComponent/AboutFeatures.tsx
// Grille des 6 fonctionnalités principales (épopées Scrum)
// ═══════════════════════════════════════════════════════════════════

import { FEATURES } from '@/data/about.data';
import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutFeatures.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutFeatures() {
  return (
    <div>
      {/* En-tête de section */}
      <AnimatedSection>
        <div className={styles.header}>
          <span className={styles.label}>Fonctionnalités</span>
          <h2 className={styles.title}>
            Tout ce dont un aventurier <span className={styles.accent}>a besoin</span>
          </h2>
          <p className={styles.subtitle}>
            Six épopées de développement pour un MVP complet et cohérent.
          </p>
        </div>
      </AnimatedSection>

      {/* Grille des cartes */}
      <div className={styles.grid}>
        {FEATURES.map((feature, i) => (
          <AnimatedSection key={feature.title} delay={i * 80}>
            <div className={styles.card}>
              {/* Badge épopée (coin supérieur droit) */}
              <span className={styles.cardTag}>{feature.tag}</span>
              {/* Icône */}
              <span className={styles.icon}>{feature.icon}</span>
              {/* Titre */}
              <div className={styles.cardTitle}>{feature.title}</div>
              {/* Description */}
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}