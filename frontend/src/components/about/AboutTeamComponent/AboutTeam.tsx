// ═══════════════════════════════════════════════════════════════════
// src/components/about/AboutTeamComponent/AboutTeam.tsx
// Cartes des membres de l'équipe de développement
// ═══════════════════════════════════════════════════════════════════

import { TEAM } from '@/data/about.data';
import AnimatedSection from '@/components/ui/AnimatedSectionComponent/AnimatedSection';
import styles from './AboutTeam.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function AboutTeam() {
  return (
    <div>
      {/* En-tête centré */}
      <AnimatedSection>
        <div className={styles.header}>
          <span className={styles.label}>L'Équipe</span>
          <h2 className={styles.title}>
            Deux développeurs, <span className={styles.accent}>une vision</span>
          </h2>
          <p className={styles.subtitle}>
            Un projet Agile Scrum sur 6 sprints, mené avec rigueur et passion du jeu.
          </p>
        </div>
      </AnimatedSection>

      {/* Grille des cartes membres */}
      <div className={styles.grid}>
        {TEAM.map((member, i) => (
          <AnimatedSection key={member.name} delay={i * 150}>
            <div className={styles.card}>
              {/* Avatar initiales */}
              <div className={styles.avatar}>{member.avatar}</div>

              {/* Identité */}
              <div className={styles.name}>{member.name}</div>
              <div className={styles.role}>{member.role}</div>

              {/* Tags de compétences */}
              <div className={styles.tags}>
                {member.focus.map((f) => (
                  <span key={f} className={styles.tag}>{f}</span>
                ))}
              </div>

              {/* Lien GitHub (optionnel) */}
              {member.github && (
                <div className={styles.github}>
                  ⌥ github.com/{member.github}
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}