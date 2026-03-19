// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutStackComponent/AboutStack.tsx
// Liste des technologies utilisées avec pastille de couleur par outil
// ═══════════════════════════════════════════════════════════════════

import { STACK_ITEMS } from '@/data/about.data';
import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutStack.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutStack() {
  return (
    <div className={styles.wrapper}>
      {/* En-tête */}
      <AnimatedSection>
        <div className={styles.header}>
          <span className={styles.label}>Technologies</span>
          <h2 className={styles.title}>
            Une stack <span className={styles.accent}>moderne</span> &amp; robuste
          </h2>
          <p className={styles.subtitle}>
            Choix délibérés pour la performance, la maintenabilité et la sécurité.
          </p>
        </div>
      </AnimatedSection>

      {/* Badges technos */}
      <AnimatedSection delay={100}>
        <div className={styles.items}>
          {STACK_ITEMS.map((item) => (
            <div key={item.name} className={styles.item}>
              {/* Pastille de couleur propre à chaque techno */}
              <div
                className={styles.dot}
                style={{ backgroundColor: item.color, opacity: 0.85 }}
              />
              <span className={styles.name}>{item.name}</span>
              <span className={styles.category}>{item.category}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}