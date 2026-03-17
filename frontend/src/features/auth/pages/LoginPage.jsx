import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import useAuth from '../hooks/useAuth';

/**
 * LoginPage — page de connexion GW2Nexus
 * Utilise Laravel Sanctum SPA cookie mode
 */
const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Efface l'erreur du champ au changement
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const result = await login(formData);

    // Erreurs de validation Laravel (422)
    if (!result.success && result.errors) {
      const mapped = {};
      Object.entries(result.errors).forEach(([key, messages]) => {
        mapped[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      setFieldErrors(mapped);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Connexion</h1>
        <p className="auth-form-subtitle">Bienvenue, Aventurier</p>
      </div>

      {/* Erreur globale */}
      {error && !Object.keys(fieldErrors).length && (
        <div className="auth-alert auth-alert--error" role="alert">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <FormInput
          label="Adresse e-mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder="votre@email.com"
          autoComplete="email"
          required
          icon={MailIcon}
        />

        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          required
          icon={LockIcon}
        />

        {/* Remember me */}
        <div className="auth-form-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span className="auth-checkbox-custom" />
            <span className="auth-checkbox-label">Se souvenir de moi</span>
          </label>
          <Link to="/forgot-password" className="auth-link auth-link--small">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="auth-btn-spinner" />
              Connexion en cours…
            </>
          ) : (
            <>
              <span>Se connecter</span>
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>Pas encore de compte ?</span>
      </div>

      <Link to="/register" className="auth-btn auth-btn--secondary">
        Créer un compte GW2Nexus
      </Link>
    </AuthLayout>
  );
};

// ─── Icons ──────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default LoginPage;