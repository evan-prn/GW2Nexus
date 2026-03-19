// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutMissionComponent/AboutMission.tsx
// Bloc mission : texte de présentation + ornement décoratif animé
// ═══════════════════════════════════════════════════════════════════

import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutMission.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutMission() {
  return (
    <div className={styles.layout}>
      {/* ── Texte ── */}
      <AnimatedSection>
        <div className={styles.textBlock}>
          <span className={styles.label}>Notre Mission</span>
          <h2 className={styles.title}>
            Construire le <span className={styles.accent}>nexus</span>
            <br />de la communauté GW2
          </h2>

          <p className={styles.paragraph}>
            Guild Wars 2 mérite une communauté à la hauteur de sa richesse.
            GW2Nexus naît d'un constat simple : les joueurs francophones manquent
            d'un <strong>hub centralisé</strong> combinant forum, données de jeu
            et outils communautaires.
          </p>
          <p className={styles.paragraph}>
            Notre approche repose sur l'<strong>intégration directe de l'API officielle
            ArenaNet</strong> — vos données de compte, personnages et équipements
            s'affichent en temps réel, sans copier-coller fastidieux.
          </p>
          <p className={styles.paragraph}>
            Développé en <strong>stack moderne</strong> (Laravel · React · MySQL),
            GW2Nexus est conçu pour la performance, la sécurité et l'évolutivité.
            Un projet open-source porté par des joueurs, pour des joueurs.
          </p>
        </div>
      </AnimatedSection>

      {/* ── Ornement décoratif ── */}
      <AnimatedSection delay={200}>
        <div className={styles.ornament}>
          <div className={styles.ornamentRing}>
            {/* Anneau rotatif supplémentaire (CSS animation) */}
            <div className={styles.ornamentRotating} />
            {/* Symbole central */}
            <span className={styles.ornamentSymbol}>⬡</span>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}