// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileEditModalComponent/ProfileEditModal.tsx
// Modal d'édition du profil : nom d'affichage + URL avatar
// Logique dans useProfileEdit, fermeture gérée par le parent
// ═══════════════════════════════════════════════════════════════════

import { useEffect }        from 'react';
import { useProfileEdit }   from '@/hooks/profile/useProfileEdit';
import styles from './ProfileEditModal.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ProfileEditModalProps {
  isOpen:  boolean;
  onClose: () => void;
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { form, status, errors, message, handleChange, handleSubmit } =
    useProfileEdit(onClose); // onClose appelé automatiquement en cas de succès

  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body quand la modal est ouverte
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Overlay — clic en dehors ferme la modal */
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Modifier le profil"
    >
      <div className={styles.modal}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Modifier le profil</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* ── Corps ── */}
        <div className={styles.body}>

          {/* Feedback succès */}
          {status === 'success' && (
            <div className={styles.alertSuccess}>✦ {message}</div>
          )}

          {/* Feedback erreur globale */}
          {status === 'error' && (
            <div className={styles.alertError}>⚠ {message}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Nom d'affichage */}
            <div className={styles.field}>
              <label className={styles.label}>Nom d'affichage</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className={`${styles.input} ${errors.nom ? styles.inputError : ''}`}
                placeholder="Votre pseudo GW2Nexus"
                disabled={status === 'loading'}
              />
              {errors.nom && (
                <span className={styles.fieldError}>{errors.nom}</span>
              )}
            </div>

            {/* URL avatar */}
            <div className={styles.field}>
              <label className={styles.label}>URL de l'avatar</label>
              <input
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                className={`${styles.input} ${errors.avatar ? styles.inputError : ''}`}
                placeholder="https://exemple.com/mon-avatar.png"
                disabled={status === 'loading'}
              />
              {errors.avatar && (
                <span className={styles.fieldError}>{errors.avatar}</span>
              )}
              {/* Prévisualisation avatar */}
              {form.avatar && (
                <div className={styles.avatarPreview}>
                  <img
                    src={form.avatar}
                    alt="Aperçu avatar"
                    className={styles.previewImg}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className={styles.previewLabel}>Aperçu</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={styles.submitBtn}
              >
                {status === 'loading' ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}