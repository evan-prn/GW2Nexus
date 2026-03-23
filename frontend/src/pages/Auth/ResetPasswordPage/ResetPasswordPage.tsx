import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { ChangeEvent, FormEvent } from 'react';
import type { AxiosError } from 'axios';
import type { FieldErrors, Status, PasswordStrength } from '@/types/auth.types';

import AuthLayout   from '@/components/auth/AuthLayoutComponent/AuthLayout';
import FormInput    from '@/components/auth/FormInputComponent/FormInput';
import httpClient   from '@/api/httpClient';
import usePageTitle from '@/hooks/usePageTitle';

import styles from './ResetPasswordPage.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface ResetPasswordForm {
  password:              string;
  password_confirmation: string;
}

/**
 * ResetPasswordPage — saisie du nouveau mot de passe.
 * Laravel envoie un lien : /reset-password?token=xxx&email=yyy@zzz.com
 * Endpoint : POST /api/v1/auth/reset-password
 */
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [form, setForm]               = useState<ResetPasswordForm>({
    password:              '',
    password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus]           = useState<Status>(null);
  const [message, setMessage]         = useState('');
  const [isLoading, setIsLoading]     = useState(false);

  // ── Lien invalide — token ou email manquant ──
  if (!token || !email) {
    return (
      <AuthLayout>
        <div className={styles.header}>
          <h1 className={styles.title}>Lien invalide</h1>
          <p className={styles.subtitle}>
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
        </div>
        <Link to="/forgot-password" className={styles.primaryLink}>
          Demander un nouveau lien
        </Link>
      </AuthLayout>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setStatus(null);

    // Validation côté client
    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await httpClient.post('/api/v1/auth/reset-password', {
        token,
        email,
        password:              form.password,
        password_confirmation: form.password_confirmation,
      });

      setStatus('success');
      setMessage(res.data.message || 'Mot de passe réinitialisé avec succès.');

      // Redirection vers /login après 2 secondes
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      const axiosErr = err as AxiosError<{
        errors?: Record<string, string | string[]>;
        message?: string;
      }>;
      const errors = axiosErr.response?.data?.errors;

      if (errors) {
        const mapped: FieldErrors = {};
        Object.entries(errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setFieldErrors(mapped);
      } else {
        setStatus('error');
        setMessage(axiosErr.response?.data?.message || 'Ce lien est invalide ou a expiré.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  usePageTitle('Nouveau mot de passe');

  return (
    <AuthLayout>

      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Nouveau mot de passe</h1>
        <p className={styles.subtitle}>Choisissez un mot de passe sécurisé</p>
      </div>

      {/* ── Alertes feedback ── */}
      {status === 'success' && (
        <div className={styles.alertSuccess} role="status">
          <CheckIcon />
          <span>{message} Redirection…</span>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.alertError} role="alert">
          <AlertIcon />
          <span>{message}</span>
        </div>
      )}

      {/* ── Formulaire — masqué après succès ── */}
      {status !== 'success' && (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          {/* Email en lecture seule — confirmation visuelle du compte */}
          <div className={styles.emailReadonly}>
            <span className={styles.emailReadonlyLabel}>Compte</span>
            <span className={styles.emailReadonlyValue}>{email}</span>
          </div>

          {/* ── Nouveau mot de passe + indicateur de force ── */}
          <div>
            <FormInput
              label="Nouveau mot de passe"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
              placeholder="8 caractères minimum"
              autoComplete="new-password"
              required
              icon={LockIcon}
            />

            {form.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={[
                        styles.strengthSegment,
                        i < passwordStrength.score
                          ? styles[`strength${capitalize(passwordStrength.level)}`]
                          : '',
                      ].filter(Boolean).join(' ')}
                    />
                  ))}
                </div>
                <span className={[
                  styles.strengthLabel,
                  styles[`strengthLabel${capitalize(passwordStrength.level)}`],
                ].filter(Boolean).join(' ')}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <FormInput
            label="Confirmer le mot de passe"
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            error={fieldErrors.password_confirmation}
            placeholder="Répétez votre mot de passe"
            autoComplete="new-password"
            required
            icon={ShieldIcon}
          />

          {/* ── Bouton submit ── */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Réinitialisation…
              </>
            ) : (
              <>
                <span>Réinitialiser le mot de passe</span>
                <ArrowIcon />
              </>
            )}
          </button>
        </form>
      )}

      {/* ── Lien nouveau lien — visible tant que pas de succès ── */}
      {status !== 'success' && (
        <>
          <div className={styles.divider}>
            <span>Lien expiré ?</span>
          </div>
          <Link to="/forgot-password" className={styles.secondaryLink}>
            Demander un nouveau lien
          </Link>
        </>
      )}

    </AuthLayout>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Logique force mot de passe ──────────────────────────────────────
const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, level: 'none', label: '' };
  let score = 0;
  if (password.length >= 8)                              score++;
  if (password.length >= 12)                             score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password))                    score++;
  const levels: PasswordStrength['level'][] = ['weak', 'weak', 'fair', 'good', 'strong'];
  const labels                              = ['', 'Faible', 'Correct', 'Bien', 'Fort'];
  return { score, level: levels[score], label: labels[score] };
};

// ─── Icons ──────────────────────────────────────────────────────────
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
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default ResetPasswordPage;