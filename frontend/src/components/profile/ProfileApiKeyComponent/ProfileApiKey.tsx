// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileApiKeyComponent/ProfileApiKey.tsx
// ═══════════════════════════════════════════════════════════════════

import { useState }         from 'react';
import useApiKey            from '@/hooks/profile/useApiKey';
import useAuthStore         from '@/store/authStore';
import { API_KEY_HELP_URL } from '@/data/profile.data';
import styles               from './ProfileApiKey.module.css';

export default function ProfileApiKey() {
  const { user }                                          = useAuthStore();
  const { apiKey, setApiKey, status, message, handleSubmit, deleteApiKey, profilGw2 } = useApiKey();

  // Mode édition — affiché uniquement si l'utilisateur veut changer sa clé
  const [modeEdition, setModeEdition] = useState(false);

  // Clé déjà configurée = has_api_key true ET profil valide
  const cleConfiguree = user?.has_api_key && profilGw2?.valide;

  return (
    <div className={styles.section}>

      {/* ── En-tête ── */}
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

        {/* ── Mode : clé déjà configurée ── */}
        {cleConfiguree && !modeEdition ? (
          <>
            <div className={styles.cleActive}>
              <span className={styles.cleActiveIcon}>✦</span>
              <div>
                <p className={styles.cleActiveTitle}>Clé API connectée</p>
                <p className={styles.cleActiveSub}>
                  Compte GW2 : <strong>{profilGw2.nom_compte ?? '—'}</strong>
                  {profilGw2.derniere_synchro && (
                    <> · Dernière synchro : {new Date(profilGw2.derniere_synchro).toLocaleDateString('fr-FR')}</>
                  )}
                </p>
              </div>
            </div>

            <div className={styles.cleActions}>
              <button
                className={styles.editKeyBtn}
                onClick={() => setModeEdition(true)}
              >
                ✏️ Modifier la clé
              </button>
              <button
                className={styles.deleteKeyBtn}
                onClick={async () => {
                  await deleteApiKey();
                  setModeEdition(false);
                }}
                disabled={status === 'loading'}
              >
                🗑️ Supprimer la clé
              </button>
            </div>
          </>

        ) : (
          /* ── Mode : saisie de clé ── */
          <>
            <p className={styles.desc}>
              {cleConfiguree
                ? 'Saisissez une nouvelle clé API pour remplacer la clé actuelle.'
                : 'Connectez votre compte GW2 pour afficher vos personnages, statistiques et données de jeu sur votre profil. Votre clé est stockée chiffrée (AES-256).'
              }
            </p>

            {status === 'success' && (
              <div className={styles.alertSuccess}>✦ {message}</div>
            )}
            {status === 'error' && (
              <div className={styles.alertError}>⚠ {message}</div>
            )}

            <form onSubmit={async (e) => { await handleSubmit(e); setModeEdition(false); }} className={styles.form} noValidate>
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

              {modeEdition && (
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setModeEdition(false)}
                >
                  Annuler
                </button>
              )}

              <p className={styles.hint}>
                Format attendu : 72 caractères (hexadécimal + tirets).
                Permissions requises : <code>account</code>, <code>characters</code>.
              </p>
            </form>
          </>
        )}

      </div>
    </div>
  );
}