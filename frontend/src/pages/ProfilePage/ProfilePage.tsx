import { useEffect, useState } from 'react';

import useAuthStore from '@/store/authStore';
import useAuth      from '@/hooks/auth/useAuth';

import styles from './ProfilePage.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface Gw2Account {
  name:      string;
  world:     number;
  created:   string;
  access?:   string[];
  daily_ap?: number;
  wvw_rank?: number;
  pvp_rank?: number;
}

interface Gw2Character {
  name:       string;
  profession: string;
  level:      number;
  race:       string;
  gender:     string;
}

/**
 * ProfilePage — page de profil utilisateur GW2Nexus
 * Affiche les infos du compte + données GW2 via backend proxy
 */
const ProfilePage = () => {
  const { user }            = useAuthStore();
  const { logout, isLoading } = useAuth();

  const [gw2Data,    setGw2Data]    = useState<Gw2Account | null>(null);
  const [characters, setCharacters] = useState<Gw2Character[]>([]);
  const [loadingGw2, setLoadingGw2] = useState(true);

  useEffect(() => {
    const fetchGw2Data = async () => {
      try {
        const [accRes, charRes] = await Promise.all([
          fetch('/api/gw2/account'),
          fetch('/api/gw2/characters'),
        ]);
        setGw2Data(await accRes.json());
        setCharacters(await charRes.json());
      } catch (err) {
        console.error('Erreur GW2 :', err);
      } finally {
        setLoadingGw2(false);
      }
    };

    fetchGw2Data();
  }, []);

  return (
    <div className={styles.root}>

      {/* ── Bannière hero ── */}
      <div className={styles.banner}>
        <div className={styles.bannerGrid} aria-hidden="true" />
        <svg className={styles.bannerHex} viewBox="0 0 200 200" width="300" height="300">
          <polygon points="100,5 173,47 173,153 100,195 27,153 27,47"
            stroke="#C9A84C" strokeWidth="1" fill="none" />
          <polygon points="100,22 160,57 160,143 100,178 40,143 40,57"
            stroke="#C9A84C" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className={styles.container}>

        {/* ── Identité (avatar + nom + meta) ── */}
        <div className={styles.identity}>

          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            {user?.avatar ? (
              <img src={user.avatar} alt="" className={styles.avatar} />
            ) : (
              <div className={styles.avatarInitial} aria-hidden="true">
                {user?.nom?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}
            {user?.role && user.role !== 'user' && (
              <span className={styles.roleBadge}>{user.role}</span>
            )}
          </div>

          {/* Infos */}
          <div className={styles.identityInfo}>
            <h1 className={styles.username}>
              {user?.nom ?? 'Aventurier'}
            </h1>
            <p className={styles.email}>{user?.email}</p>
            <div className={styles.identityMeta}>
              {gw2Data?.name && (
                <span className={styles.metaTag}>⚔ {gw2Data.name}</span>
              )}
              <span className={styles.metaTag}>🌍 GW2Nexus</span>
            </div>
          </div>

          {/* Déconnexion */}
          <div className={styles.identityActions}>
            <button
              className={styles.logoutBtn}
              onClick={logout}
              disabled={isLoading}
            >
              {isLoading ? 'Déconnexion…' : '🚪 Se déconnecter'}
            </button>
          </div>

        </div>

        {/* ── Grille sidebar + main ── */}
        <div className={styles.layout}>

          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>

            {/* Infos compte */}
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Compte</p>
              <div className={styles.sideRow}>
                <span className={styles.sideRowLabel}>Pseudo</span>
                <span className={styles.sideRowValue}>{user?.nom ?? '—'}</span>
              </div>
              <div className={styles.sideRow}>
                <span className={styles.sideRowLabel}>Email</span>
                <span className={styles.sideRowValue}>{user?.email ?? '—'}</span>
              </div>
              <div className={styles.sideRow}>
                <span className={styles.sideRowLabel}>Rôle</span>
                <span className={styles.sideRowValueGold}>{user?.role ?? 'user'}</span>
              </div>
            </div>

            {/* Infos GW2 */}
            {gw2Data && (
              <div className={styles.sideCard}>
                <p className={styles.sideCardTitle}>Guild Wars 2</p>
                <div className={styles.sideRow}>
                  <span className={styles.sideRowLabel}>Compte</span>
                  <span className={styles.sideRowValueGold}>{gw2Data.name}</span>
                </div>
                <div className={styles.sideRow}>
                  <span className={styles.sideRowLabel}>Serveur</span>
                  <span className={styles.sideRowValue}>{gw2Data.world}</span>
                </div>
                <div className={styles.sideRow}>
                  <span className={styles.sideRowLabel}>Créé le</span>
                  <span className={styles.sideRowValue}>
                    {new Date(gw2Data.created).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className={styles.sideRow}>
                  <span className={styles.sideRowLabel}>Personnages</span>
                  <span className={styles.sideRowValueGold}>{characters.length}</span>
                </div>
              </div>
            )}

          </aside>

          {/* ── Contenu principal ── */}
          <main className={styles.main}>

            {loadingGw2 ? (

              /* Loading */
              <div className={styles.section}>
                <div className={styles.stateBox}>
                  <div className={styles.spinner} aria-label="Chargement" />
                  <p className={styles.stateText}>Chargement du profil GW2…</p>
                </div>
              </div>

            ) : gw2Data ? (
              <>

                {/* Section stats ────────────────────────────────── */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>📊</span>
                    <h2 className={styles.sectionTitle}>Statistiques</h2>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.statsGrid}>
                      <div className={styles.statBox}>
                        <span className={styles.statIcon}>🏆</span>
                        <span className={styles.statLabel}>Succès</span>
                        <span className={styles.statValue}>
                          {gw2Data.daily_ap ?? '—'}
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statIcon}>⚔️</span>
                        <span className={styles.statLabel}>Rang WvW</span>
                        <span className={styles.statValue}>
                          {gw2Data.wvw_rank ?? '—'}
                        </span>
                      </div>
                      <div className={styles.statBox}>
                        <span className={styles.statIcon}>🎯</span>
                        <span className={styles.statLabel}>Rang PvP</span>
                        <span className={styles.statValue}>
                          {gw2Data.pvp_rank ?? '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section personnages ────────────────────────── */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>🧙</span>
                    <h2 className={styles.sectionTitle}>Personnages</h2>
                  </div>
                  <div className={styles.sectionBody}>
                    {characters.length === 0 ? (
                      <div className={styles.stateBox}>
                        <span className={styles.stateIcon}>🗺️</span>
                        <p className={styles.stateText}>Aucun personnage trouvé</p>
                      </div>
                    ) : (
                      <div className={styles.characterGrid}>
                        {characters.map((char) => (
                          <div key={char.name} className={styles.characterCard}>
                            <p className={styles.charName}>{char.name}</p>
                            <p className={styles.charProfession}>
                              {char.profession} — Niv. {char.level}
                            </p>
                            <p className={styles.charMeta}>
                              🗺️ {char.race} / {char.gender}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </>
            ) : (

              /* Erreur */
              <div className={styles.section}>
                <div className={styles.stateBox}>
                  <span className={styles.stateIcon}>⚠️</span>
                  <p className={styles.stateText}>
                    Impossible de charger les données GW2.
                    Vérifiez votre clé API dans les paramètres du profil.
                  </p>
                </div>
              </div>

            )}

          </main>
        </div>
      </div>

      {/* Sprint tag */}
      <p className={styles.sprintTag}>
        🚀 Sprint 2 actif — API GW2 connectée
      </p>

    </div>
  );
};

export default ProfilePage;