// ═══════════════════════════════════════════════════════════════════
// src/pages/ProfilePage/ProfilePage.tsx
// Orchestrateur de la page Profil :
// - compose tous les blocs (Banner, Identity, Sidebar, Stats, Characters…)
// - gère l'état d'ouverture de la modal d'édition
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';

import { useProfile }         from '@/hooks/profile/useProfile';
import ProfileBanner          from '@/components/profile/ProfileBannerComponent/ProfileBanner';
import ProfileIdentity        from '@/components/profile/ProfileIdentityComponent/ProfileIdentity';
import ProfileSidebar         from '@/components/profile/ProfileSidebarComponent/ProfileSidebar';
import ProfileStats           from '@/components/profile/ProfileStatsComponent/ProfileStats';
import ProfileCharacters      from '@/components/profile/ProfileCharactersComponent/ProfileCharacters';
import ProfileApiKey          from '@/components/profile/ProfileApiKeyComponent/ProfileApiKey';
import ProfileEditModal       from '@/components/profile/ProfileEditModalComponent/ProfileEditModal';

import styles from './ProfilePage.module.css';

// ─── Page ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { gw2Data, characters, loading, error } = useProfile();

  // State d'ouverture de la modal d'édition du profil
  const [isEditOpen, setEditOpen] = useState(false);

  return (
    <div className={styles.page}>

      {/* ── Bannière décorative ── */}
      <ProfileBanner />

      <div className={styles.container}>

        {/* ── Identité (chevauche la bannière) ── */}
        <ProfileIdentity
          gw2Data={gw2Data}
          onEditProfile={() => setEditOpen(true)}
        />

        {/* ── Grille principale (sidebar | contenu) ── */}
        <div className={styles.layout}>

          {/* Sidebar */}
          <ProfileSidebar gw2Data={gw2Data} characters={characters} />

          {/* Contenu principal */}
          <main className={styles.main}>

            {/* ── Section clé API (toujours visible) ── */}
            <ProfileApiKey />

            {/* ── Données GW2 (conditionnelles) ── */}
            {loading ? (

              /* Chargement */
              <div className={styles.stateBox}>
                <div className={styles.spinner} aria-label="Chargement" />
                <p className={styles.stateText}>Chargement du profil GW2…</p>
              </div>

            ) : error ? (

              /* Erreur */
              <div className={styles.stateBox}>
                <span className={styles.stateIcon}>⚠️</span>
                <p className={styles.stateText}>
                  Impossible de charger les données GW2.
                  Vérifiez votre clé API ci-dessus.
                </p>
              </div>

            ) : gw2Data ? (
              <>
                {/* Stats */}
                <ProfileStats gw2Data={gw2Data} />

                {/* Personnages */}
                <ProfileCharacters characters={characters} />
              </>
            ) : null}

          </main>
        </div>
      </div>

      {/* ── Modal d'édition du profil ── */}
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />

    </div>
  );
}