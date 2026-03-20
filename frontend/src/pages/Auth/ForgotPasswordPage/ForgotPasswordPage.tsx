import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '@/components/auth/AuthLayoutComponent/AuthLayout';
import FormInput from '@/components/auth/FormInputComponent/FormInput';
import httpClient from '@/api/httpClient';
import PageTitle  from '@/hooks/usePageTitle';

import styles from './ForgotPasswordPage.module.css';

// ─── Types ──────────────────────────────────────────────────────────
type Status = 'success' | 'error' | null;

/**
 * ForgotPasswordPage — envoie un lien de réinitialisation par email.
 * Endpoint Laravel : POST /api/v1/auth/forgot-password
 * Retour attendu   : { message: string }
 */
const ForgotPasswordPage = () => {
  const [email, setEmail]         = useState('');
  const [emailError, setEmailError] = useState('');
  const [status, setStatus]       = useState<Status>(null);
  const [message, setMessage]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setStatus(null);

    if (!email) {
      setEmailError('L\'adresse e-mail est requise.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await httpClient.post('/api/v1/auth/forgot-password', { email });
      setStatus('success');
      setMessage(res.data.message || 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: { email?: string | string[] }; message?: string } } };
      const errors = error.response?.data?.errors;

      if (errors?.email) {
        setEmailError(Array.isArray(errors.email) ? errors.email[0] : errors.email);
      } else {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Une erreur est survenue. Réessayez.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>

      <PageTitle title="Mot de passe oublié" />

      {/* En-tête */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mot de passe oublié</h1>
        <p className={styles.subtitle}>
          Saisissez votre e-mail pour recevoir un lien de réinitialisation
        </p>
      </div>

      {/* Feedback global */}
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

      {/* Formulaire masqué après succès */}
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
              <><span className={styles.spinner} />Envoi en cours…</>
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

// ─── Icons ──────────────────────────────────────────────────────────
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