// ═══════════════════════════════════════════════════════════════════
// src/data/profile.data.ts
// Données statiques de la page Profil : professions GW2, champs éditables
// ═══════════════════════════════════════════════════════════════════

// ─── Types exportés ─────────────────────────────────────────────────
export interface Gw2Account {
  name:      string;
  world:     number;
  created:   string;
  access?:   string[];
  daily_ap?: number;
  wvw_rank?: number;
  pvp_rank?: number;
}

export interface Gw2Character {
  name:       string;
  profession: string;
  level:      number;
  race:       string;
  gender:     string;
}

export interface ProfileEditForm {
  nom:    string;
  avatar: string;
}

// ─── Icônes par profession GW2 ───────────────────────────────────────
export const PROFESSION_ICONS: Record<string, string> = {
  Guardian:    '🛡️',
  Warrior:     '⚔️',
  Engineer:    '⚙️',
  Ranger:      '🏹',
  Thief:       '🗡️',
  Elementalist:'🔥',
  Mesmer:      '💫',
  Necromancer: '💀',
  Revenant:    '👁️',
};

// ─── Stats GW2 affichées sur le profil ──────────────────────────────
export const GW2_STATS = [
  { key: 'daily_ap' as const, icon: '🏆', label: 'Succès quotidiens' },
  { key: 'wvw_rank' as const, icon: '⚔️', label: 'Rang WvW' },
  { key: 'pvp_rank' as const, icon: '🎯', label: 'Rang PvP' },
];

// ─── Sujets du formulaire de contact (réutilisé) ────────────────────
export const API_KEY_HELP_URL =
  'https://account.arena.net/applications';