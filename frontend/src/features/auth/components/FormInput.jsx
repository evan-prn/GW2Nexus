import { forwardRef, useState } from 'react';

/**
 * FormInput — champ de saisie réutilisable avec style GW2Nexus
 * Supporte : text, email, password (avec toggle visibilité)
 */
const FormInput = forwardRef(
  (
    {
      label,
      type = 'text',
      name,
      value,
      onChange,
      onBlur,
      error,
      placeholder,
      autoComplete,
      disabled = false,
      required = false,
      icon: Icon,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasError = Boolean(error);

    return (
      <div className="form-field">
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        <div className={`form-input-wrapper ${hasError ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
          {Icon && (
            <span className="form-input-icon">
              <Icon size={16} />
            </span>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
            className={`form-input ${Icon ? 'has-icon' : ''} ${isPassword ? 'has-action' : ''}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />

          {isPassword && (
            <button
              type="button"
              className="form-input-action"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {hasError && (
          <p id={`${name}-error`} className="form-error" role="alert">
            <ErrorIcon />
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// ─── Micro-icons inline (pas de dépendance externe) ─────────────────
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
);

export default FormInput;