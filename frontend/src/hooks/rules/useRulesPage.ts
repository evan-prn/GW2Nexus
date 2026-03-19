// ═══════════════════════════════════════════════════════════════════
// src/hooks/rules/useRulesPage.ts
// Logique de navigation par onglets de la page Règles :
// state activeTab, switchTab avec scroll vers le contenu
// ═══════════════════════════════════════════════════════════════════

import { useRef, useState } from 'react';
import { TABS } from '@/data/rules.data';
import type { TabId, Tab } from '@/data/rules.data';

// ─── Hook ────────────────────────────────────────────────────────────
export function useRulesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('legal');

  // Ref sur la zone de contenu pour le scroll automatique au changement d'onglet
  const contentRef = useRef<HTMLDivElement>(null);

  // Onglet actif courant (objet complet)
  const currentTab: Tab = TABS.find((t) => t.id === activeTab)!;

  // ─── Changement d'onglet + scroll vers le contenu ───────────────────
  const switchTab = (id: TabId) => {
    setActiveTab(id);
    // Petit délai pour laisser React re-rendre avant de scroller
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return { activeTab, currentTab, contentRef, switchTab };
}