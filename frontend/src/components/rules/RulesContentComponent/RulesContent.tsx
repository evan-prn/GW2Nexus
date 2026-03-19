// ═══════════════════════════════════════════════════════════════════
// src/components/rules/RulesContentComponent/RulesContent.tsx
// Zone de contenu : affiche le composant d'onglet actif.
// La prop key={activeTab} force un remount complet à chaque changement
// d'onglet, ce qui relance les animations reveal.
// ═══════════════════════════════════════════════════════════════════

import type { RefObject } from 'react';
import type { TabId } from '@/data/rules.data';

import TabLegal   from '@/components/rules/tabs/TabLegalComponent/TabLegal';
import TabPrivacy from '@/components/rules/tabs/TabPrivacyComponent/TabPrivacy';
import TabTerms   from '@/components/rules/tabs/TabTermsComponent/TabTerms';

import styles from './RulesContent.module.css';

// ─── Map onglet → composant ──────────────────────────────────────────
const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  legal:   TabLegal,
  privacy: TabPrivacy,
  terms:   TabTerms,
};

// ─── Props ───────────────────────────────────────────────────────────
interface RulesContentProps {
  activeTab: TabId;
  // RefObject<HTMLDivElement | null> : compatible avec useRef<HTMLDivElement>(null)
  contentRef: RefObject<HTMLDivElement | null>;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function RulesContent({ activeTab, contentRef }: RulesContentProps) {
  const ActiveTab = TAB_COMPONENTS[activeTab];

  return (
    <div ref={contentRef} className={styles.content}>
      {/* key force le remount et relance les animations à chaque changement d'onglet */}
      <ActiveTab key={activeTab} />
    </div>
  );
}