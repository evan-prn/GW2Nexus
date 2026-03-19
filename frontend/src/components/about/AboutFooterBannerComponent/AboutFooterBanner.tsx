// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutFooterBannerComponent/AboutFooterBanner.tsx
// Bannière de bas de page : citation + attribution
// ═══════════════════════════════════════════════════════════════════

import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutFooterBanner.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutFooterBanner() {
  return (
    <div className={styles.banner}>
      <AnimatedSection>
        <p className={styles.quote}>
          &ldquo;The journey is the destination.&rdquo;
        </p>
        <p className={styles.attribution}>
          GW2Nexus · Built with ♥ for the GW2 Community
        </p>
      </AnimatedSection>
    </div>
  );
}