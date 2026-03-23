// ─── Types partagés — Profil utilisateur & GW2 ──────────────────────

/** Profil GW2 lié au compte utilisateur */
export interface ProfilGw2 {
  id:               number;
  user_id:          number;
  nom_compte:       string | null;
  monde:            string | null;
  personnages:      Personnage[] | null;
  derniere_synchro: string | null;
  valide:           boolean;
  created_at:       string;
  updated_at:       string;
}

/** Personnage GW2 (format interne) */
export interface Personnage {
  name:       string;
  race:       string;
  profession: string;
  level:      number;
}

/** Données complètes du profil (réponse GET /api/v1/profile) */
export interface ProfileResponse {
  user:       ProfileUser;
  profil_gw2: ProfilGw2 | null;
}

/** Données utilisateur exposées par l'API profil */
export interface ProfileUser {
  id:          number;
  nom:         string;
  email:       string;
  pseudo_gw2:  string | null;
  avatar:      string | null;
  role:        string;
  has_api_key: boolean;
}

/** Payload de mise à jour du profil de base */
export interface UpdateProfilePayload {
  nom?:        string;
  pseudo_gw2?: string | null;
  avatar?:     string | null;
}

/** Payload de mise à jour de la clé API */
export interface UpdateApiKeyPayload {
  api_key: string;
}

/**
 * Réponse GET /api/v1/profile/gw2-data
 * compte = données brutes ArenaNet (/v2/account)
 * personnages = liste des noms de personnages (/v2/characters)
 */
export interface Gw2DataResponse {
  compte:      Gw2CompteRaw;
  personnages: string[];  // liste de noms — les détails sont dans /v2/characters/:name
}

/** Données brutes du compte GW2 (API ArenaNet /v2/account) */
export interface Gw2CompteRaw {
  id:            string;
  name:          string;   // format: Nom.1234
  world:         number;   // ID du serveur
  guilds:        string[];
  created:       string;   // ISO datetime
  access:        string[];
  commander:     boolean;
  fractal_level: number;
  daily_ap:      number;
  monthly_ap:    number;
  wvw_rank:      number;
}