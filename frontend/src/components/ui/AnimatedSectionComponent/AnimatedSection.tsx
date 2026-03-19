// ═══════════════════════════════════════════════════════════════════
// src/components/ui/AnimatedSectionComponent/AnimatedSection.tsx
// Wrapper générique : fade-in + slide-up au scroll via IntersectionObserver.
// Utilisable dans n'importe quelle page du projet.
// ═══════════════════════════════════════════════════════════════════

import type { ReactNode, CSSProperties } from 'react';
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver';

// ─── Props ───────────────────────────────────────────────────────────
interface AnimatedSectionProps {
  children: ReactNode;
  /** Délai en ms avant le déclenchement de la transition */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function AnimatedSection({
  children,
  delay = 0,
  className = '',
  style,
}: AnimatedSectionProps) {
  const { ref, visible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}