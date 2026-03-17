import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useAuth from '../features/auth/hooks/useAuth';

/**
 * DashboardPage — placeholder Sprint 1
 * Sera enrichi en Sprint 2 avec profil GW2, stats, widgets
 */
const DashboardPage = () => {
  const { user } = useAuthStore();
  const { logout, isLoading } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-void)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      padding: '2rem',
    }}>

      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>
          <span style={{ color: 'var(--color-gold-500)' }}>GW2</span>
          <span> Nexus</span>
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Hub communautaire Guild Wars 2
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Badge succès */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--color-success-bg)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '999px',
          padding: '0.375rem 1rem',
          fontSize: '0.8125rem',
          color: '#86EFAC',
          marginBottom: '1.5rem',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          Authentification réussie
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: 'var(--color-text-primary)',
        }}>
          Bienvenue, {user?.nom || 'Aventurier'} !
        </h1>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
          {user?.email}
        </p>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.8125rem',
          marginTop: '1rem',
          marginBottom: '1.5rem',
          lineHeight: 1.6,
        }}>
          Sprint 2 en cours — le dashboard complet avec profil GW2,
          statistiques et widgets arrive bientôt.
        </p>

        {/* Bouton logout */}
        <button
          onClick={logout}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 250ms ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'rgba(239,68,68,0.4)';
            e.target.style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
            e.target.style.color = 'var(--color-text-secondary)';
          }}
        >
          {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-disabled)' }}>
        Sprint 1 terminé ✓ — Sprint 2 : Profils & API GW2
      </p>
    </div>
  );
};

export default DashboardPage;