// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileStatsComponent/ProfileStats.tsx
// Section statistiques GW2 (succès, rang WvW, rang PvP)
// ═══════════════════════════════════════════════════════════════════

import { GW2_STATS }        from '@/data/profile.data';
import type { Gw2Account }  from '@/data/profile.data';
import styles from './ProfileStats.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ProfileStatsProps {
  gw2Data: Gw2Account;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileStats({ gw2Data }: ProfileStatsProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📊</span>
        <h2 className={styles.headerTitle}>Statistiques</h2>
      </div>

      <div className={styles.grid}>
        {GW2_STATS.map((stat) => (
          <div key={stat.key} className={styles.statBox}>
            <span className={styles.statIcon}>{stat.icon}</span>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>
              {gw2Data[stat.key] ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}