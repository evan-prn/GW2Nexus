// src/pages/Admin/AdminOverviewPage/AdminOverviewPage.tsx

import { useAdminStats } from '@/hooks/admin/useAdminUsers';
import styles from './AdminOverviewPage.module.css';

// ---------------------------------------------------------------------------
// AdminOverviewPage — Tableau de bord principal du back-office
//
// Affiche les statistiques globales de la plateforme sous forme de cards.
// Données chargées via GET /api/v1/admin/stats.
// ---------------------------------------------------------------------------

export default function AdminOverviewPage() {
  const { stats, loading } = useAdminStats();

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Vue d'ensemble</h1>
        <p className={styles.pageSubtitle}>Statistiques générales de GW2Nexus</p>
      </div>

      {loading && (
        <p className={styles.stateMsg}>Chargement des statistiques...</p>
      )}

      {!loading && stats && (
        <>
          <div className={styles.statsGrid}>
            <StatCard icon="◉" label="Utilisateurs totaux"  value={stats.total_users}   color="gold"  />
            <StatCard icon="✓" label="Comptes actifs"       value={stats.active_users}  color="green" />
            <StatCard icon="⛔" label="Comptes bannis"      value={stats.banned_users}  color="red"   />
            <StatCard icon="✕" label="Comptes supprimés"   value={stats.deleted_users} color="muted" />
            <StatCard icon="⚙" label="Administrateurs"     value={stats.admins}        color="gold"  />
            <StatCard icon="◈" label="Modérateurs"         value={stats.moderateurs}   color="blue"  />
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              ◈ Back-office GW2Nexus · Module admin v1
            </p>
          </div>
        </>
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// StatCard — Carte de statistique individuelle
// ---------------------------------------------------------------------------

interface StatCardProps {
  icon:  string;
  label: string;
  value: number;
  color: 'gold' | 'green' | 'red' | 'blue' | 'muted';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={`${styles.statCard} ${styles[`color_${color}`]}`}>
      <span className={styles.statIcon} aria-hidden="true">{icon}</span>
      <div>
        <p className={styles.statValue}>{value.toLocaleString('fr-FR')}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}
