import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ChangeEvent, FormEvent } from 'react';

import AuthLayout   from '@/components/auth/AuthLayoutComponent/AuthLayout';
import FormInput    from '@/components/auth/FormInputComponent/FormInput';
import useAuth      from '@/hooks/auth/useAuth';
import usePageTitle from '@/hooks/usePageTitle';

import type { FieldErrors } from '@/types/auth.types';

import styles from './LoginPage.module.css';

/**
 * LoginPage — page de connexion GW2Nexus
 * Utilise Laravel Sanctum SPA cookie mode
 */
const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email:    '',
    password: '',
    remember: false,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }));
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const result = await login(formData);

    if (!result.success && result.errors) {
      const mapped: FieldErrors = {};
      Object.entries(result.errors).forEach(([key, messages]) => {
        mapped[key] = Array.isArray(messages) ? messages[0] : messages;
      });
      setFieldErrors(mapped);
    }
  };

  usePageTitle('Connexion');

  return (
    <AuthLayout>

      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>Bienvenue, Aventurier</p>
      </div>

      {/* ── Erreur globale (hors erreurs de champ) ── */}
      {error && !Object.keys(fieldErrors).length && (
        <div className={styles.alertError} role="alert">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      {/* ── Formulaire ── */}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>

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

        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span className={styles.checkboxCustom} aria-hidden="true" />
            <span className={styles.checkboxLabel}>Se souvenir de moi</span>
          </label>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
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

      <div className={styles.divider}>
        <span>Pas encore de compte ?</span>
      </div>

      <Link to="/register" className={styles.secondaryLink}>
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