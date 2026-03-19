// ─── Types partagés — Authentification ──────────────────────────────

/** Erreurs de validation par champ retournées par Laravel (422) */
export interface FieldErrors {
  [key: string]: string | null | undefined;
}

/** Statut d'une réponse asynchrone */
export type Status = 'success' | 'error' | null;

/** Payload d'inscription */
export interface RegisterPayload {
  nom:                   string;
  email:                 string;
  password:              string;
  password_confirmation: string;
}

/** Payload de connexion */
export interface LoginPayload {
  email:     string;
  password:  string;
  remember?: boolean;
}

/** Résultat de l'indicateur de force du mot de passe */
export interface PasswordStrength {
  score: number;
  level: 'none' | 'weak' | 'fair' | 'good' | 'strong';
  label: string;
}