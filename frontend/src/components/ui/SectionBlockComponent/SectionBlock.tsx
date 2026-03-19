// ═══════════════════════════════════════════════════════════════════
// src/components/ui/SectionBlockComponent/SectionBlock.tsx
// Bloc de section numérotée avec animation reveal au scroll.
// Utilisé dans les onglets de la page Règles (et potentiellement ailleurs).
// ═══════════════════════════════════════════════════════════════════

import type { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver';
import styles from './SectionBlock.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface SectionBlockProps {
  /** Numéro affiché en préfixe (ex: "01") */
  number: string;
  /** Titre de la section */
  title: string;
  /** Contenu de la section */
  children: ReactNode;
  /** Délai d'animation en ms */
  delay?: number;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function SectionBlock({ number, title, children, delay = 0 }: SectionBlockProps) {
  const { ref, visible } = useIntersectionObserver(0.05);

  return (
    <div
      ref={ref}
      className={styles.section}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {/* Titre numéroté */}
      <div className={styles.title}>
        <span className={styles.number}>{number} —</span>
        {title}
      </div>

      {/* Corps */}
      <div className={styles.body}>{children}</div>
    </div>
  );
}