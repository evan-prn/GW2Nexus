// src/components/admin/BanModalComponent/BanModal.tsx

import { useState } from 'react';
import type { AdminUser, BanPayload } from '@/types/admin.types';
import styles from './BanModal.module.css';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BanModalProps {
  /** Utilisateur cible de la sanction */
  user: AdminUser;
  /** Appelé avec le payload validé lors de la confirmation */
  onConfirm: (payload: BanPayload) => void;
  /** Appelé lors de l'annulation ou du clic sur l'overlay */
  onClose: () => void;
  /** Désactive les boutons pendant l'appel API */
  loading: boolean;
  /** Message d'erreur retourné par l'API (null si aucune erreur) */
  error: string | null;
}

// ---------------------------------------------------------------------------
// BanModal — Modale de configuration et confirmation d'un ban
//
// Permet à l'admin de choisir :
//   - Type : temporaire (avec date d'expiration) ou permanent
//   - Motif : obligatoire, minimum 10 caractères pour la traçabilité
//
// La validation est faite localement avant l'envoi — le bouton de
// confirmation reste désactivé tant que le formulaire est invalide.
// ---------------------------------------------------------------------------

export default function BanModal({ user, onConfirm, onClose, loading, error }: BanModalProps) {
  const [type, setType]         = useState<'temporary' | 'permanent'>('temporary');
  const [reason, setReason]     = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  // Date minimum pour l'expiration = demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isValid =
    reason.trim().length >= 10 &&
    (type === 'permanent' || expiresAt !== '');

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      type,
      reason: reason.trim(),
      expires_at: type === 'temporary' ? expiresAt : null,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── En-tête ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>Appliquer une sanction</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* ── Utilisateur ciblé ── */}
        <div className={styles.userInfo}>
          <div className={styles.userAvatar} aria-hidden="true">
            {user.nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.userName}>{user.nom}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        {/* ── Formulaire ── */}
        <div className={styles.form}>

          {/* Type de ban */}
          <div className={styles.fieldGroup}>
            <p className={styles.label}>Type de sanction</p>
            <div className={styles.typeButtons}>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'temporary' ? styles.typeBtnActive : ''}`}
                onClick={() => setType('temporary')}
              >
                ⏱ Temporaire
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'permanent' ? styles.typeBtnPermanent : ''}`}
                onClick={() => setType('permanent')}
              >
                ⛔ Permanent
              </button>
            </div>
          </div>

          {/* Date d'expiration — visible uniquement pour les bans temporaires */}
          {type === 'temporary' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="ban-expires">
                Date d'expiration <span className={styles.required}>*</span>
              </label>
              <input
                id="ban-expires"
                type="date"
                min={minDate}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          {/* Motif */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="ban-reason">
              Motif <span className={styles.required}>*</span>
              <span className={styles.charCount}>{reason.length}/500</span>
            </label>
            <textarea
              id="ban-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="Décrivez le motif de cette sanction (min. 10 caractères)..."
              className={styles.textarea}
              rows={3}
            />
            {reason.length > 0 && reason.length < 10 && (
              <p className={styles.fieldError}>
                Minimum 10 caractères ({10 - reason.length} restants)
              </p>
            )}
          </div>

          {/* Erreur API */}
          {error && <p className={styles.apiError}>{error}</p>}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="button"
              className={`${styles.confirmBtn} ${type === 'permanent' ? styles.confirmBtnPermanent : ''}`}
              onClick={handleConfirm}
              disabled={!isValid || loading}
            >
              {loading
                ? 'En cours...'
                : type === 'permanent'
                  ? '⛔ Bannir définitivement'
                  : '⏱ Appliquer le ban'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
