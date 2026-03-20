// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileApiKeyComponent/ProfileApiKey.tsx
// Section ajout / remplacement de la clé API Guild Wars 2
// Composant purement présentationnel — logique dans useApiKey
// ═══════════════════════════════════════════════════════════════════

import { useApiKey }    from '@/hooks/profile/useApiKey';
import { API_KEY_HELP_URL } from '@/data/profile.data';
import styles from './ProfileApiKey.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileApiKey() {
  const { apiKey, setApiKey, status, message, handleSubmit } = useApiKey();

  return (
    <div className={styles.section}>

      {/* En-tête */}
      <div className={styles.header}>
        <span className={styles.headerIcon}>⬡</span>
        <h2 className={styles.headerTitle}>Clé API Guild Wars 2</h2>
        <a
          href={API_KEY_HELP_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.helpLink}
        >
          Obtenir une clé →
        </a>
      </div>

      <div className={styles.body}>

        {/* Description */}
        <p className={styles.desc}>
          Connectez votre compte GW2 pour afficher vos personnages, statistiques
          et données de jeu sur votre profil. Votre clé est stockée chiffrée (AES-256).
        </p>

        {/* Feedback succès */}
        {status === 'success' && (
          <div className={styles.alertSuccess}>
            ✦ {message}
          </div>
        )}

        {/* Feedback erreur */}
        {status === 'error' && (
          <div className={styles.alertError}>
            ⚠ {message}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              className={styles.input}
              disabled={status === 'loading'}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !apiKey.trim()}
              className={styles.submitBtn}
            >
              {status === 'loading' ? 'Validation…' : 'Valider'}
            </button>
          </div>

          {/* Instructions */}
          <p className={styles.hint}>
            Format attendu : 72 caractères (hexadécimal + tirets).
            Permissions requises : <code>account</code>, <code>characters</code>.
          </p>
        </form>

      </div>
    </div>
  );
}