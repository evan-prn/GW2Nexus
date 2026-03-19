// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutHeroComponent/AboutHero.tsx
// Hero de la page About : titre, description, CTA, parallax grid,
// indicateur de scroll. Reçoit scrollY pour l'effet parallax.
// ═══════════════════════════════════════════════════════════════════

import styles from './AboutHero.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface AboutHeroProps {
  /** Position de scroll pour l'effet parallax sur la grille de fond */
  scrollY: number;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutHero({ scrollY }: AboutHeroProps) {
  return (
    <section className={styles.hero}>
      {/* Couches de fond */}
      <div className={styles.bg} />
      <div className={styles.noise} />
      <div
        className={styles.grid}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Contenu principal */}
      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span>✦</span>
          Hub Communautaire Guild Wars 2
          <span>✦</span>
        </div>

        {/* Titre */}
        <h1 className={styles.title}>
          <span className={styles.titleMain}>GW2Nexus</span>
          <span className={styles.titleSub}>Le Carrefour des Aventuriers</span>
        </h1>

        {/* Description */}
        <p className={styles.description}>
          Une plateforme communautaire moderne dédiée aux joueurs de Guild Wars 2 —
          forums, profils, builds, guildes et données de jeu réunies en un seul lieu.
        </p>

        {/* CTA */}
        <button className={styles.cta}>
          <span>Rejoindre la communauté</span>
          <span>→</span>
        </button>
      </div>

      {/* Indicateur de scroll */}
      <div className={styles.scrollIndicator}>
        <span>Découvrir</span>
        <span className={styles.scrollArrow}>↓</span>
      </div>
    </section>
  );
}