// ═══════════════════════════════════════════════════════════════════
// src/pages/AboutPage/AboutPage.tsx
// Orchestrateur de la page About :
// - gère le scroll pour l'effet parallax du hero
// - compose tous les blocs dans l'ordre de lecture
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';

import AboutHero         from '@/components/about/AboutHeroComponent/AboutHero';
import AboutStats        from '@/components/about/AboutStatsComponent/AboutStats';
import AboutMission      from '@/components/about/AboutMissionComponent/AboutMission';
import AboutFeatures     from '@/components/about/AboutFeaturesComponent/AboutFeatures';
import AboutStack        from '@/components/about/AboutStackComponent/AboutStack';
import AboutTeam         from '@/components/about/AboutTeamComponent/AboutTeam';
import AboutFooterBanner from '@/components/about/AboutFooterBannerComponent/AboutFooterBanner';
import PageTitle         from '@/hooks/usePageTitle';

import styles from './AboutPage.module.css';

// ─── Séparateur décoratif doré ────────────────────────────────────
// Composant local simple, pas besoin de l'extraire
function GoldDivider() {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
      <span className={styles.dividerIcon}>✦</span>
      <div className={`${styles.dividerLine} ${styles.dividerLineReverse}`} />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────
export default function AboutPage() {
  // scrollY transmis au hero pour l'effet parallax de la grille de fond
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.page}>

      <PageTitle title="À propos de GW2 Nexus" />

      {/* ── Hero plein écran ── */}
      <AboutHero scrollY={scrollY} />

      {/* ── Bande de stats ── */}
      <AboutStats />

      {/* ── Section principale (mission + features) ── */}
      <div className={styles.section}>
        <AboutMission />
        <GoldDivider />
        <AboutFeatures />
      </div>

      {/* ── Stack technique (fond distinct) ── */}
      <div className={styles.stackSection}>
        <div className={styles.section}>
          <AboutStack />
        </div>
      </div>

      {/* ── Équipe ── */}
      <div className={styles.section}>
        <AboutTeam />
      </div>

      {/* ── Bannière citation finale ── */}
      <AboutFooterBanner />

    </div>
  );
}