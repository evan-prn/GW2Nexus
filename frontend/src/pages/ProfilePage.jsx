import useAuthStore from '../store/authStore';
import useAuth from '../features/auth/hooks/useAuth';

/**
 * ProfilePage — placeholder Sprint 1
 * Sera enrichi en Sprint 2 avec profil GW2, stats, widgets
 */
const ProfilePage = () => {
  const { user } = useAuthStore();
  const { logout, isLoading } = useAuth();

  return (
    <div className="dash-root">

      {/* Logo */}
      <div className="dash-logo">
        <p className="dash-logo-title">
          <span className="dash-logo-gw2">GW2</span>
          <span className="dash-logo-nexus"> Nexus</span>
        </p>
        <p className="dash-logo-sub">Hub communautaire Guild Wars 2</p>
      </div>

      {/* Card */}
      <div className="dash-card">

        <div className="dash-badge-success">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          Authentification réussie
        </div>

        <h1 className="dash-welcome">
          Bienvenue, {user?.nom || 'Aventurier'} !
        </h1>

        <p className="dash-email">{user?.email}</p>

        <p className="dash-sprint-note">
          Sprint 2 en cours — le dashboard complet avec profil GW2,
          statistiques et widgets arrive bientôt.
        </p>

        <button
          className="dash-logout-btn"
          onClick={logout}
          disabled={isLoading}
        >
          {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </div>

      <p className="dash-sprint-tag">
        Sprint 1 terminé ✓ — Sprint 2 : Profils & API GW2
      </p>
    </div>
  );
};

export default ProfilePage;