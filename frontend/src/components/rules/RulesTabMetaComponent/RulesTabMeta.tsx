// ═══════════════════════════════════════════════════════════════════
// src/components/rules/RulesTabMetaComponent/RulesTabMeta.tsx
// Bandeau d'information sous la barre d'onglets :
// nom de l'onglet actif, description et date de mise à jour
// ═══════════════════════════════════════════════════════════════════

import type { Tab } from '@/data/rules.data';
import styles from './RulesTabMeta.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface RulesTabMetaProps {
  tab: Tab;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function RulesTabMeta({ tab }: RulesTabMetaProps) {
  return (
    <div className={styles.meta}>
      <div>
        <div className={styles.title}>{tab.label}</div>
        <div className={styles.desc}>{tab.description}</div>
      </div>
      <div className={styles.updated}>◎ Mis à jour : {tab.updated}</div>
    </div>
  );
}