import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout — wrapper visuel des pages d'authentification
 * Fond atmosphérique GW2, logo, ornements dorés
 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.layout}>

      {/* Fond animé */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgGrid} />
      </div>

      {/* Contenu centré */}
      <div className={styles.container}>

        {/* Logo GW2Nexus */}
        <div className={styles.logo}>
          <div className={styles.logoEmblem}>
            <GW2LogoIcon />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoGw2}>GW2</span>
            <span className={styles.logoNexus}>Nexus</span>
          </div>
          <p className={styles.logoTagline}>Le hub communautaire Guild Wars 2</p>
        </div>

        {/* Card principale */}
        <div className={styles.card}>
          <div className={styles.cardInner}>
            {children}
          </div>
          <div className={styles.cardBorder} aria-hidden="true" />
        </div>

        {/* Footer */}
        <p className={styles.footer}>
          © 2025 GW2Nexus — Projet communautaire non officiel
        </p>

      </div>
    </div>
  );
};

// ─── SVG Logo GW2 simplifié ─────────────────────────────────────────
const GW2LogoIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <polygon
      points="20,2 37,11 37,29 20,38 3,29 3,11"
      stroke="#C9A84C"
      strokeWidth="1.5"
      fill="rgba(201,168,76,0.08)"
    />
    <polygon
      points="20,8 31,14 31,26 20,32 9,26 9,14"
      stroke="#C9A84C"
      strokeWidth="0.8"
      fill="rgba(201,168,76,0.05)"
      opacity="0.6"
    />
    <text
      x="20"
      y="24"
      textAnchor="middle"
      fill="#C9A84C"
      fontSize="11"
      fontFamily="Cinzel, serif"
      fontWeight="700"
    >
      N
    </text>
  </svg>
);

export default AuthLayout;