// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileIdentityComponent/ProfileIdentity.tsx
// ═══════════════════════════════════════════════════════════════════

import useAuthStore from '@/store/authStore';
import useAuth      from '@/hooks/auth/useAuth';
import type { Gw2Account } from '@/data/profile.data';
import styles from './ProfileIdentity.module.css';

interface ProfileIdentityProps {
  gw2Data:       Gw2Account | null;
  onEditProfile: () => void;
}

// Mapping ID monde GW2 → nom lisible
// Liste complète : https://api.guildwars2.com/v2/worlds?ids=all
const GW2_WORLDS: Record<number, string> = {
  // FR
  2201: 'Vizunah Square',
  2202: 'Augury Rock',
  2203: 'Jade Sea',
  2204: 'Fort Ranik',
  2205: 'Arborstone',
  // DE
  2101: 'Kodash',
  2102: 'Riverside',
  2105: 'Elona Reach',
  2009: 'Desolation',
  // EN
  2007: 'Piken Square',
  2010: 'Aurora Glade',
  2004: 'Gandara',
};

export default function ProfileIdentity({ gw2Data, onEditProfile }: ProfileIdentityProps) {
  const { user }              = useAuthStore();
  const { logout, isLoading } = useAuth();

  const nomMonde = gw2Data?.world
    ? (GW2_WORLDS[gw2Data.world] ?? `Monde #${gw2Data.world}`)
    : null;

  return (
    <div className={styles.identity}>

      {/* ── Avatar ── */}
      <div className={styles.avatarWrapper}>
        {user?.avatar ? (
          <img src={user.avatar} alt="Avatar" className={styles.avatar} />
        ) : (
          <div className={styles.avatarInitial} aria-hidden="true">
            {user?.nom?.charAt(0).toUpperCase() ?? '?'}
          </div>
        )}
        {user?.role && user.role !== 'user' && (
          <span className={styles.roleBadge}>{user.role}</span>
        )}
      </div>

      {/* ── Infos ── */}
      <div className={styles.info}>
        <h1 className={styles.username}>{user?.nom ?? 'Aventurier'}</h1>
        <br />
        <p className={styles.nom}>{user?.nom}</p>
        <p className={styles.email}>{user?.email}</p>

        <div className={styles.tags}>
          {gw2Data?.name && (
            <span className={styles.tag}>⚔ {gw2Data.name}</span>
          )}
          <span className={styles.tag}>
            🌍 {nomMonde ?? 'GW2Nexus'}
          </span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={onEditProfile}>
          ✏️ Modifier le profil
        </button>
        <button
          className={styles.logoutBtn}
          onClick={logout}
          disabled={isLoading}
        >
          {isLoading ? 'Déconnexion…' : '🚪 Se déconnecter'}
        </button>
      </div>

    </div>
  );
}