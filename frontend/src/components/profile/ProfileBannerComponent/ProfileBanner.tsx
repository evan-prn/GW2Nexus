// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileBannerComponent/ProfileBanner.tsx
// Bannière décorative en haut de la page profil
// ═══════════════════════════════════════════════════════════════════

import styles from './ProfileBanner.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileBanner() {
  return (
    <div className={styles.banner}>
      {/* Grille décorative */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Hexagone décoratif */}
      <svg
        className={styles.hex}
        viewBox="0 0 200 200"
        width="300"
        height="300"
        aria-hidden="true"
      >
        <polygon
          points="100,5 173,47 173,153 100,195 27,153 27,47"
          stroke="#C9A84C"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="100,22 160,57 160,143 100,178 40,143 40,57"
          stroke="#C9A84C"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </div>
  );
}