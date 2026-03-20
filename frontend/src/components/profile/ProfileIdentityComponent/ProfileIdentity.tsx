// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileIdentityComponent/ProfileIdentity.tsx
// Bande identité : avatar, nom, email, tags, boutons d'action
// ═══════════════════════════════════════════════════════════════════

import useAuthStore from '@/store/authStore';
import useAuth      from '@/hooks/auth/useAuth';
import type { Gw2Account } from '@/data/profile.data';
import styles from './ProfileIdentity.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ProfileIdentityProps {
  gw2Data:       Gw2Account | null;
  onEditProfile: () => void;   // ouvre la modal d'édition
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileIdentity({ gw2Data, onEditProfile }: ProfileIdentityProps) {
  const { user }              = useAuthStore();
  const { logout, isLoading } = useAuth();

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
        {/* Badge rôle (moderateur / admin uniquement) */}
        {user?.role && user.role !== 'user' && (
          <span className={styles.roleBadge}>{user.role}</span>
        )}
      </div>

      {/* ── Infos ── */}
      <div className={styles.info}>
        <h1 className={styles.username}>{user?.nom ?? 'Aventurier'}</h1>
        <p className={styles.email}>{user?.email}</p>

        <div className={styles.tags}>
          {gw2Data?.name && (
            <span className={styles.tag}>⚔ {gw2Data.name}</span>
          )}
          <span className={styles.tag}>🌍 GW2Nexus</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className={styles.actions}>
        {/* Modifier le profil */}
        <button className={styles.editBtn} onClick={onEditProfile}>
          ✏️ Modifier le profil
        </button>

        {/* Déconnexion */}
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