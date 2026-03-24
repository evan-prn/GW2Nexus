// src/pages/auth/ForgotPasswordPage/ForgotPasswordPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import axios from 'axios';

import AuthLayout   from '@/components/auth/AuthLayoutComponent/AuthLayout';
import FormInput    from '@/components/auth/FormInputComponent/FormInput';
import authApi      from '@/api/auth.api';
import usePageTitle from '@/hooks/usePageTitle';

import styles from './ForgotPasswordPage.module.css';

// ─── Types locaux ────────────────────────────────────────────────────────────
type Status = 'success' | 'error' | null;

/**
 * ForgotPasswordPage — demande de réinitialisation de mot de passe.
 *
 * Passe par authApi.forgotPassword() — jamais de httpClient direct.
 * Le backend retourne toujours 200 (protection anti-énumération d'emails).
 */
const ForgotPasswordPage = () => {
  const [email, setEmail]         = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus]       = useState<Status>(null);
  const [message, setMessage]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setStatus(null);

    // Validation minimale côté client avant l'appel réseau
    if (!email.trim()) {
      setEmailError("L'adresse e-mail est requise.");
      return;
    }

    setIsLoading(true);
    try {
      // Passe par authApi — URL centralisée dans ENDPOINTS, pas en dur ici
      const res = await authApi.forgotPassword(email);
      setStatus('success');
      setMessage(
        res.data.message ??
        'Si un compte est associé à cette adresse, un email de réinitialisation vient d\'être envoyé.'
      );
    } catch (err) {
      // Le backend retourne toujours 200 pour cette route —
      // une erreur ici signifie un problème réseau ou serveur
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.errors;
        if (errors?.email) {
          // Erreur de validation sur le champ email (format invalide)
          setEmailError(Array.isArray(errors.email) ? errors.email[0] : errors.email);
        } else {
          setStatus('error');
          setMessage(err.response?.data?.message ?? 'Une erreur est survenue. Réessayez.');
        }
      } else {
        setStatus('error');
        setMessage('Erreur de connexion au serveur.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  usePageTitle('Mot de passe oublié');

  return (
    <AuthLayout>

      {/* ── En-tête ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mot de passe oublié</h1>
        <p className={styles.subtitle}>
          Saisissez votre e-mail pour recevoir un lien de réinitialisation
        </p>
      </div>

      {/* ── Feedback global ── */}
      {status === 'success' && (
        <div className={styles.alertSuccess} role="status">
          <CheckIcon />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.alertError} role="alert">
          <AlertIcon />
          <span>{message}</span>
        </div>
      )}

      {/* ── Formulaire masqué après succès ── */}
      {status !== 'success' && (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>

          <FormInput
            label="Adresse e-mail"
            type="email"
            name="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            error={emailError}
            placeholder="votre@email.com"
            autoComplete="email"
            required
            icon={MailIcon}
          />

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className={styles.spinner} aria-hidden="true" />Envoi en cours…</>
            ) : (
              <><span>Envoyer le lien</span><ArrowIcon /></>
            )}
          </button>
        </form>
      )}

      <div className={styles.divider}>
        <span>Vous vous souvenez ?</span>
      </div>

      <Link to="/login" className={styles.backLink}>
        ← Retour à la connexion
      </Link>

    </AuthLayout>
  );
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
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

export default ForgotPasswordPage;