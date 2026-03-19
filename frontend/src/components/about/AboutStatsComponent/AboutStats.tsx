// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutStatsComponent/AboutStats.tsx
// Bande de chiffres clés du projet (12 tables, 6 sprints…)
// ═══════════════════════════════════════════════════════════════════

import { STATS } from '@/data/about.data';
import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutStats.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutStats() {
  return (
    <div className={styles.band}>
      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 100}>
            <div className={styles.item}>
              <span className={styles.icon}>{stat.icon}</span>
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}