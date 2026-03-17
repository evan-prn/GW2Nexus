import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * NotFoundPage — page 404
 */
const NotFoundPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-void)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)',
      gap: '1.5rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <p style={{ fontSize: '5rem', fontFamily: 'var(--font-display)', color: 'var(--color-gold-500)', lineHeight: 1 }}>
        404
      </p>
      <h1 style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>
        Cette page n'existe pas, Aventurier.
      </h1>
      <Link
        to={isAuthenticated ? '/dashboard' : '/login'}
        style={{
          color: 'var(--color-gold-400)',
          textDecoration: 'none',
          fontSize: '0.9375rem',
          borderBottom: '1px solid var(--color-border-gold)',
          paddingBottom: '2px',
        }}
      >
        ← Retour {isAuthenticated ? 'au dashboard' : 'à la connexion'}
      </Link>
    </div>
  );
};

export default NotFoundPage;