import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import useAuth from '../hooks/useAuth';

/**
 * RegisterPage — inscription GW2Nexus
 * Champs : nom, email, password, password_confirmation
 * Messages d'erreur Laravel en français
 */
const RegisterPage = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const result = await register(formData);

    if (!result.success && result.errors) {
      const mapped = {};
      Object.entries(result.errors).forEach(([key, messages]) => {
        mapped[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      setFieldErrors(mapped);
    }
  };

  // Indicateur de force du mot de passe
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Créer un compte</h1>
        <p className="auth-form-subtitle">Rejoignez la communauté GW2</p>
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
          label="Nom d'affichage"
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          error={fieldErrors.nom}
          placeholder="Votre pseudo"
          autoComplete="username"
          required
          icon={UserIcon}
        />

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

        <div className="form-field">
          <FormInput
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            required
            icon={LockIcon}
          />
          {/* Barre de force du mot de passe */}
          {formData.password && (
            <div className="password-strength">
              <div className="password-strength-bar">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`password-strength-segment ${
                      i < passwordStrength.score ? `strength-${passwordStrength.level}` : ''
                    }`}
                  />
                ))}
              </div>
              <span className={`password-strength-label strength-label-${passwordStrength.level}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        <FormInput
          label="Confirmer le mot de passe"
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          error={fieldErrors.password_confirmation}
          placeholder="Répétez votre mot de passe"
          autoComplete="new-password"
          required
          icon={ShieldIcon}
        />

        <p className="auth-hint">
          En créant un compte, vous acceptez nos conditions d'utilisation.
        </p>

        <button
          type="submit"
          className="auth-btn auth-btn--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="auth-btn-spinner" />
              Création en cours…
            </>
          ) : (
            <>
              <span>Créer mon compte</span>
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>Déjà un compte ?</span>
      </div>

      <Link to="/login" className="auth-btn auth-btn--secondary">
        Se connecter
      </Link>
    </AuthLayout>
  );
};

// ─── Logique force mot de passe ──────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, level: 'none', label: '' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = ['weak', 'weak', 'fair', 'good', 'strong'];
  const labels = ['', 'Faible', 'Correct', 'Bien', 'Fort'];
  return { score, level: levels[score], label: labels[score] };
};

// ─── Icons ──────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

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

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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

export default RegisterPage;