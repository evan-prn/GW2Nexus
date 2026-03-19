// ═══════════════════════════════════════════════════════════════════
// src/components/rules/RulesTabsBarComponent/RulesTabsBar.tsx
// Barre d'onglets sticky : Legal / Confidentialité / CGU
// Reçoit l'onglet actif et le callback de changement via props
// ═══════════════════════════════════════════════════════════════════

import { TABS } from '@/data/rules.data';
import type { TabId } from '@/data/rules.data';
import styles from './RulesTabsBar.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface RulesTabsBarProps {
  activeTab: TabId;
  onSwitch: (id: TabId) => void;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function RulesTabsBar({ activeTab, onSwitch }: RulesTabsBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.btn} ${activeTab === tab.id ? styles.btnActive : ''}`}
            onClick={() => onSwitch(tab.id)}
          >
            <span className={styles.icon}>{tab.icon}</span>
            {tab.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}