// ═══════════════════════════════════════════════════════════════════
// src/hooks/ui/useIntersectionObserver.ts
// Détecte quand un élément entre dans le viewport.
// Utilisé pour déclencher les animations reveal au scroll.
// Réutilisable dans tout le projet.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from 'react';

/**
 * @param threshold - fraction visible pour déclencher (0.0 → 1.0)
 * @returns ref à attacher au DOM + booléen visible
 */
export function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // On déconnecte après le premier trigger — animation one-shot
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}