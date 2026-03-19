// ═══════════════════════════════════════════════════════════════════
// src/components/rules/RulesHeroComponent/RulesHero.tsx
// Hero de la page Règles : titre, sous-titre, fond décoratif
// ═══════════════════════════════════════════════════════════════════

import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver';
import styles from './RulesHero.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function RulesHero() {
  const { ref, visible } = useIntersectionObserver(0);

  return (
    <section className={styles.hero}>
      {/* Fond dégradé */}
      <div className={styles.bg} />
      {/* Lignes diagonales décoratives */}
      <div className={styles.lines} />

      {/* Contenu avec animation reveal */}
      <div
        ref={ref}
        className={styles.content}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className={styles.label}>Règles &amp; Légal</div>

        <h1 className={styles.title}>
          Transparence &amp; <span className={styles.titleAccent}>Confiance</span>
        </h1>

        <p className={styles.subtitle}>
          Mentions légales, politique de confidentialité et conditions d'utilisation
          de GW2Nexus — tout ce que vous devez savoir avant d'utiliser le service.
        </p>
      </div>
    </section>
  );
}