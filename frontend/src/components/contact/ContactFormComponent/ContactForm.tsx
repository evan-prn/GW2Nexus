// ═══════════════════════════════════════════════════════════════════
// src/components/contact/ContactFormComponent/ContactForm.tsx
// Formulaire de contact contrôlé — reçoit tout son état via props,
// zéro logique interne (voir useContactForm)
// ═══════════════════════════════════════════════════════════════════

import type { ChangeEvent, FormEvent } from 'react';
import { SUBJECTS } from '@/data/contact.data';
import type { ContactFormData, FieldErrors, FormStatus } from '@/hooks/contact/useContactForm';
import styles from './ContactForm.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ContactFormProps {
  form: ContactFormData;
  status: FormStatus;
  errors: FieldErrors;
  globalError: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ContactForm({
  form,
  status,
  errors,
  globalError,
  onChange,
  onSubmit,
}: ContactFormProps) {

  // ── Écran de confirmation après envoi réussi ────────────────────
  if (status === 'sent') {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✦</span>
        <p className={styles.successTitle}>Message Transmis</p>
        <p className={styles.successText}>
          Nous reviendrons vers vous sous peu par e-mail.
        </p>
      </div>
    );
  }

  // ── Formulaire ──────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>

      {/* Erreur globale (429, 500…) */}
      {globalError && (
        <div className={styles.globalError}>{globalError}</div>
      )}

      {/* Ligne nom + email */}
      <div className={styles.fieldRow}>
        {/* Nom */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Nom de compte</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          />
          {errors.name && (
            <span className={styles.fieldError}>{errors.name}</span>
          )}
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Adresse E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          />
          {errors.email && (
            <span className={styles.fieldError}>{errors.email}</span>
          )}
        </div>
      </div>

      {/* Sujet */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Sujet de la demande</label>
        <select
          name="subject"
          value={form.subject}
          onChange={onChange}
          className={styles.select}
        >
          <option value="">Choisir un sujet…</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Votre Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
        />
        {errors.message && (
          <span className={styles.fieldError}>{errors.message}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className={styles.submitBtn}
      >
        {status === 'sending' ? 'Initialisation…' : 'Envoyer le Signal'}
      </button>
    </form>
  );
}