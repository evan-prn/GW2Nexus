// ═══════════════════════════════════════════════════════════════════
// src/hooks/ui/useFocusTrap.ts
// Piège le focus clavier à l'intérieur d'une modale ouverte (RGAA 12.8 /
// WCAG 2.4.3 & 2.1.2) : Tab/Shift+Tab cyclent entre les éléments
// focusables internes, le focus revient sur le déclencheur à la fermeture.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @param isOpen - la modale est actuellement affichée
 * @returns ref à attacher au conteneur de la modale (pas à l'overlay)
 */
export function useFocusTrap<T extends HTMLElement>(isOpen: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Mémorise l'élément qui avait le focus avant l'ouverture pour le restaurer à la fermeture
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const focusables = container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !container) return;

      const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  return containerRef;
}
