import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import httpClient from '../../../api/httpClient';

/**
 * ResetPasswordPage — saisie du nouveau mot de passe.
 *
 * Laravel envoie un lien de la forme :
 *   /reset-password?token=xxx&email=yyy@zzz.com
 *
 * Endpoint : POST /api/v1/auth/reset-password
 * Body     : { token, email, password, password_confirmation }
 * Retour   : { message: string }
 */
const ResetPasswordPage = () => {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  // Récupération des paramètres URL injectés par Laravel
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus]   = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Token ou email manquant — lien invalide
  if (!token || !email) {
    return (
      <AuthLayout>
        <div className="auth-form-header">
          <h1 className="auth-form-title">Lien invalide</h1>
          <p className="auth-form-subtitle">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
        </div>
        <Link to="/forgot-password" className="auth-btn auth-btn--primary">
          Demander un nouveau lien
        </Link>
      </AuthLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setStatus(null);

    // Validation côté client basique
    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await httpClient.post('/api/v1/auth/reset-password', {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setStatus('success');
      setMessage(res.data.message || 'Mot de passe réinitialisé avec succès.');

      // Redirection vers /login après 2 secondes
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const mapped = {};
        Object.entries(errors).forEach(([key, msgs]) => {
          mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setFieldErrors(mapped);
      } else {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Ce lien est invalide ou a expiré.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h1 className="auth-form-title">Nouveau mot de passe</h1>
        <p className="auth-form-subtitle">Choisissez un mot de passe sécurisé</p>
      </div>

      {status === 'success' && (
        <div className="auth-alert auth-alert--success" role="status">
          <CheckIcon />
          <span>{message} Redirection…</span>
        </div>
      )}
      {status === 'error' && (
        <div className="auth-alert auth-alert--error" role="alert">
          <AlertIcon />
          <span>{message}</span>
        </div>
      )}

      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email en lecture seule — confirmation visuelle */}
          <div className="auth-email-readonly">
            <span className="auth-email-readonly-label">Compte</span>
            <span className="auth-email-readonly-value">{email}</span>
          </div>

          <div className="form-field">
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
            value={form.password_confirmation}
            onChange={handleChange}
            error={fieldErrors.password_confirmation}
            placeholder="Répétez votre mot de passe"
            autoComplete="new-password"
            required
            icon={ShieldIcon}
          />

          <button
            type="submit"
            className="auth-btn auth-btn--primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="auth-btn-spinner" />Réinitialisation…</>
            ) : (
              <><span>Réinitialiser le mot de passe</span><ArrowIcon /></>
            )}
          </button>
        </form>
      )}

      {status !== 'success' && (
        <>
          <div className="auth-divider"><span>Lien expiré ?</span></div>
          <Link to="/forgot-password" className="auth-btn auth-btn--secondary">
            Demander un nouveau lien
          </Link>
        </>
      )}
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
  const labels = ['',     'Faible', 'Correct', 'Bien', 'Fort'];
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
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default ResetPasswordPage;