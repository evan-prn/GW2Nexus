// ═══════════════════════════════════════════════════════════════════
// src/pages/ProfilePage/ProfilePage.tsx
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';

import useProfile        from '@/hooks/profile/useProfile';
import useApiKey         from '@/hooks/profile/useApiKey';

import ProfileBanner     from '@/components/profile/ProfileBannerComponent/ProfileBanner';
import ProfileIdentity   from '@/components/profile/ProfileIdentityComponent/ProfileIdentity';
import ProfileSidebar    from '@/components/profile/ProfileSidebarComponent/ProfileSidebar';
import ProfileStats      from '@/components/profile/ProfileStatsComponent/ProfileStats';
import ProfileCharacters from '@/components/profile/ProfileCharactersComponent/ProfileCharacters';
import ProfileApiKey     from '@/components/profile/ProfileApiKeyComponent/ProfileApiKey';
import ProfileEditModal  from '@/components/profile/ProfileEditModalComponent/ProfileEditModal';

import usePageTitle      from '@/hooks/usePageTitle';

import type { Gw2Account, Gw2Character } from '@/data/profile.data';

import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { profilGw2, isLoading, error, fetchProfile } = useProfile();
  const { gw2Data, fetchGw2Data }                     = useApiKey();
  const [isEditOpen, setEditOpen]                     = useState(false);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    if (profilGw2?.valide) fetchGw2Data();
  }, [profilGw2?.valide, fetchGw2Data]);

  // Adapte compte brut → Gw2Account attendu par les composants
  const compte: Gw2Account | null = gw2Data?.compte
    ? {
        name:     gw2Data.compte.name,
        world:    gw2Data.compte.world,
        created:  gw2Data.compte.created,
        access:   gw2Data.compte.access,
        daily_ap: gw2Data.compte.daily_ap,
        wvw_rank: gw2Data.compte.wvw_rank,
      }
    : null;

  // /v2/characters?ids=all retourne des objets complets
  const personnages: Gw2Character[] = Array.isArray(gw2Data?.personnages)
    ? (gw2Data!.personnages as any[]).map((c) =>
        typeof c === 'string'
          ? { name: c, profession: 'Unknown', level: 0, race: '', gender: '' }
          : {
              name:       c.name       ?? '',
              profession: c.profession ?? 'Unknown',
              level:      c.level      ?? 0,
              race:       c.race       ?? '',
              gender:     c.gender     ?? '',
            }
      )
    : [];

    usePageTitle(compte ? `${compte.name} ` : 'Profil GW2');

  return (
    <div className={styles.page}>

      <ProfileBanner />

      <div className={styles.container}>
        <ProfileIdentity gw2Data={compte} onEditProfile={() => setEditOpen(true)} />

        <div className={styles.layout}>
          <ProfileSidebar gw2Data={compte} characters={personnages} />

          <main className={styles.main}>
            <ProfileApiKey />

            {isLoading ? (
              <div className={styles.stateBox}>
                <div className={styles.spinner} aria-label="Chargement" />
                <p className={styles.stateText}>Chargement du profil GW2…</p>
              </div>
            ) : error ? (
              <div className={styles.stateBox}>
                <span className={styles.stateIcon}>⚠️</span>
                <p className={styles.stateText}>
                  Impossible de charger les données GW2. Vérifiez votre clé API.
                </p>
              </div>
            ) : compte ? (
              <>
                <ProfileStats gw2Data={compte} />
                <ProfileCharacters characters={personnages} />
              </>
            ) : null}
          </main>
        </div>
      </div>

      <ProfileEditModal isOpen={isEditOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}