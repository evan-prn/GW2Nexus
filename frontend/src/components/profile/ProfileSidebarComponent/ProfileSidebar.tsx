// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileSidebarComponent/ProfileSidebar.tsx
// Sidebar : infos compte GW2Nexus + infos compte GW2
// ═══════════════════════════════════════════════════════════════════

import useAuthStore from '@/store/authStore';
import type { Gw2Account, Gw2Character } from '@/data/profile.data';
import styles from './ProfileSidebar.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ProfileSidebarProps {
  gw2Data:    Gw2Account | null;
  characters: Gw2Character[];
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileSidebar({ gw2Data, characters }: ProfileSidebarProps) {
  const { user } = useAuthStore();

  return (
    <aside className={styles.sidebar}>

      {/* ── Card infos compte GW2Nexus ── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>Compte</p>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Pseudo</span>
          <span className={styles.rowValue}>{user?.nom ?? '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{user?.email ?? '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Rôle</span>
          <span className={styles.rowValueGold}>{user?.role ?? 'user'}</span>
        </div>
      </div>

      {/* ── Card infos GW2 (conditionnelle) ── */}
      {gw2Data && (
        <div className={styles.card}>
          <p className={styles.cardTitle}>Guild Wars 2</p>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Compte</span>
            <span className={styles.rowValueGold}>{gw2Data.name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Serveur</span>
            <span className={styles.rowValue}>{gw2Data.world}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Créé le</span>
            <span className={styles.rowValue}>
              {new Date(gw2Data.created).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Personnages</span>
            <span className={styles.rowValueGold}>{characters.length}</span>
          </div>
        </div>
      )}

    </aside>
  );
}