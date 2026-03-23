// src/pages/Admin/AdminUserPage/AdminUserPage.tsx

import { useState } from 'react';
import { useAdminUsers, useBanActions } from '@/hooks/admin/useAdminUsers';
import BanModal from '@/components/admin/BanModalComponent/BanModal';
import type { AdminUser, BanPayload } from '@/types/admin.types';
import styles from './AdminUserPage.module.css';

// ---------------------------------------------------------------------------
// AdminUserPage — Gestion des utilisateurs
//
// Fonctionnalités :
//   - Recherche par nom / email / pseudo GW2 (debounce 400ms)
//   - Filtres rôle et statut
//   - Pagination
//   - Ban temporaire / permanent via BanModal
//   - Unban avec confirmation native
// ---------------------------------------------------------------------------

export default function AdminUserPage() {
  const { result, loading, error, filters, updateFilter, setPage, refresh } = useAdminUsers();

  // Utilisateur ciblé pour la modale de ban (null = modale fermée)
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);

  const { ban, unban, loading: banLoading, error: banError } = useBanActions(() => {
    setBanTarget(null);
    refresh();
  });

  const handleBanConfirm = async (payload: BanPayload) => {
    if (banTarget) await ban(banTarget, payload);
  };

  const handleUnban = async (user: AdminUser) => {
    if (!window.confirm(`Lever le ban de ${user.nom} ?`)) return;
    await unban(user);
  };

  return (
    <div className={styles.page}>

      {/* ── En-tête ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Utilisateurs</h1>
        <p className={styles.pageSubtitle}>
          {result?.meta.total ?? 0} compte{(result?.meta.total ?? 0) !== 1 ? 's' : ''} enregistré{(result?.meta.total ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Filtres ── */}
      <div className={styles.filters}>
        <input
          type="search"
          placeholder="Rechercher par nom, email, pseudo GW2..."
          className={styles.searchInput}
          defaultValue={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          aria-label="Rechercher un utilisateur"
        />

        <select
          className={styles.select}
          value={filters.role}
          onChange={(e) => updateFilter('role', e.target.value)}
          aria-label="Filtrer par rôle"
        >
          <option value="">Tous les rôles</option>
          <option value="user">Utilisateur</option>
          <option value="moderateur">Modérateur</option>
          <option value="admin">Administrateur</option>
        </select>

        <select
          className={styles.select}
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="banned">Banni</option>
          <option value="deleted">Supprimé</option>
        </select>
      </div>

      {/* ── États de chargement / erreur ── */}
      {loading && <p className={styles.stateMsg}>Chargement...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* ── Table ── */}
      {!loading && result && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Utilisateur</th>
                  <th className={styles.th}>Rôle</th>
                  <th className={styles.th}>Statut</th>
                  <th className={styles.th}>Inscription</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onBan={() => setBanTarget(user)}
                    onUnban={() => handleUnban(user)}
                  />
                ))}
              </tbody>
            </table>

            {result.data.length === 0 && (
              <div className={styles.emptyState}>
                Aucun utilisateur trouvé pour ces critères.
              </div>
            )}
          </div>

          {/* ── Pagination ── */}
          {result.meta.last_page > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={filters.page <= 1}
                onClick={() => setPage(filters.page - 1)}
              >
                ← Précédent
              </button>

              <span className={styles.pageInfo}>
                Page {filters.page} / {result.meta.last_page}
              </span>

              <button
                type="button"
                className={styles.pageBtn}
                disabled={filters.page >= result.meta.last_page}
                onClick={() => setPage(filters.page + 1)}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Modale de ban ── */}
      {banTarget && (
        <BanModal
          user={banTarget}
          onConfirm={handleBanConfirm}
          onClose={() => setBanTarget(null)}
          loading={banLoading}
          error={banError}
        />
      )}

    </div>
  );
}

// ---------------------------------------------------------------------------
// UserRow — Ligne de la table utilisateurs
// ---------------------------------------------------------------------------

interface UserRowProps {
  user: AdminUser;
  onBan: () => void;
  onUnban: () => void;
}

function UserRow({ user, onBan, onUnban }: UserRowProps) {
  const isDeleted = user.deleted_at !== null;

  return (
    <tr className={`${styles.tr} ${isDeleted ? styles.trDeleted : ''}`}>

      {/* Identité */}
      <td className={styles.td}>
        <div className={styles.userCell}>
          {user.avatar ? (
            <img src={user.avatar} alt="" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatar} aria-hidden="true">
              {user.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className={styles.userName}>{user.nom}</p>
            <p className={styles.userEmail}>{user.email}</p>
            {user.pseudo_gw2 && (
              <p className={styles.userGw2}>⚔ {user.pseudo_gw2}</p>
            )}
          </div>
        </div>
      </td>

      {/* Rôle */}
      <td className={styles.td}>
        <RoleBadge role={user.role} />
      </td>

      {/* Statut */}
      <td className={styles.td}>
        <StatusBadge user={user} />
      </td>

      {/* Date d'inscription */}
      <td className={styles.td}>
        <span className={styles.date}>
          {new Date(user.created_at).toLocaleDateString('fr-FR')}
        </span>
      </td>

      {/* Actions — désactivées pour les admins et les comptes supprimés */}
      <td className={styles.td}>
        <div className={styles.actions}>
          {user.role !== 'admin' && !isDeleted && (
            user.is_banned ? (
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnGreen}`}
                onClick={onUnban}
                title="Lever le ban"
              >
                ✓ Débannir
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnRed}`}
                onClick={onBan}
                title="Bannir cet utilisateur"
              >
                ⛔ Bannir
              </button>
            )
          )}
        </div>
      </td>

    </tr>
  );
}

// ---------------------------------------------------------------------------
// RoleBadge — Badge coloré selon le rôle
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  const config: Record<AdminUser['role'], { label: string; className: string }> = {
    admin: { label: 'Admin', className: styles.badgeGold },
    moderateur: { label: 'Modérateur', className: styles.badgeBlue },
    user: { label: 'Utilisateur', className: styles.badgeMuted },
  };

  const { label, className } = config[role];

  return <span className={`${styles.badge} ${className}`}>{label}</span>;
}

// ---------------------------------------------------------------------------
// StatusBadge — Badge coloré selon le statut du compte
// ---------------------------------------------------------------------------

function StatusBadge({ user }: { user: AdminUser }) {
  if (user.deleted_at) {
    return <span className={`${styles.badge} ${styles.badgeMuted}`}>Supprimé</span>;
  }

  if (user.is_banned) {
    const ban = user.active_ban;
    return (
      <div>
        <span className={`${styles.badge} ${styles.badgeRed}`}>
          {ban?.type === 'permanent' ? '⛔ Permanent' : '⏱ Temporaire'}
        </span>
        {ban?.expires_at && (
          <p className={styles.banExpiry}>
            jusqu'au {new Date(ban.expires_at).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    );
  }

  return <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ Actif</span>;
}
