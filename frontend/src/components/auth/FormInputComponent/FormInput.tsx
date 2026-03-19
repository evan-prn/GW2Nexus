import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ComponentType } from 'react';

import styles from './FormInput.module.css';

// ─── Types ──────────────────────────────────────────────────────────

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string | null;
  icon?:  ComponentType;
}

/**
 * FormInput — champ de saisie réutilisable avec style GW2Nexus
 * Supporte : text, email, password (avec toggle visibilité)
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      type         = 'text',
      name,
      value,
      onChange,
      onBlur,
      error,
      placeholder,
      autoComplete,
      disabled     = false,
      required     = false,
      icon: Icon,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;
    const hasError   = Boolean(error);
    const hasIcon    = Boolean(Icon);
    const hasAction  = isPassword;

    // Classe input dynamique selon les combinaisons icône/action
    const inputClass = (() => {
      if (hasIcon && hasAction) return styles.inputWithIconAndAction;
      if (hasIcon)              return styles.inputWithIcon;
      if (hasAction)            return styles.inputWithAction;
      return styles.input;
    })();

    // Classe wrapper selon état
    const wrapperClass = [
      styles.wrapper,
      hasError ? styles.wrapperError    : '',
      disabled ? styles.wrapperDisabled : '',
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.field}>

        {/* Label */}
        {label && (
          <label htmlFor={name} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        )}

        {/* Wrapper + Input */}
        <div className={wrapperClass}>

          {/* Icône décorative gauche */}
          {Icon && (
            <span className={styles.icon} aria-hidden="true">
              <Icon />
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
            className={inputClass}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            {...rest}
          />

          {/* Toggle visibilité mot de passe */}
          {isPassword && (
            <button
              type="button"
              className={styles.action}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {/* Message d'erreur */}
        {hasError && (
          <p id={`${name}-error`} className={styles.error} role="alert">
            <ErrorIcon />
            {error}
          </p>
        )}

      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

// ─── Micro-icons inline ──────────────────────────────────────────────

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