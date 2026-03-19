// ═══════════════════════════════════════════════════════════════════
// src/data/contact.data.ts
// Données statiques de la page Contact : canaux, sujets, infos délais
// ═══════════════════════════════════════════════════════════════════

// ─── Types ──────────────────────────────────────────────────────────
export interface Channel {
  icon: string;
  title: string;
  description: string;
  href: string;
  tag: string;
  delay: string;
}

export interface Subject {
  value: string;
  label: string;
}

export interface InfoItem {
  lbl: string;
  val: string;
}

// ─── Canaux de communication externes ───────────────────────────────
export const CHANNELS: Channel[] = [
  {
    icon: '⬡',
    title: 'Discord',
    description:
      'Rejoignez le serveur pour échanger en temps réel avec la communauté GW2Nexus.',
    href: '#',
    tag: 'Communauté',
    delay: 'Instantané',
  },
  {
    icon: '◈',
    title: 'GitHub',
    description:
      'Signalez un bug ou proposez une fonctionnalité via les Issues du dépôt.',
    href: 'https://github.com/evan-prn/GW2Nexus',
    tag: 'Open Source',
    delay: '< 72h',
  },
  {
    icon: '✦',
    title: 'Email',
    description:
      'Pour toute demande formelle, partenariat ou signalement de contenu urgent.',
    href: 'mailto:contact@gw2nexus.fr',
    tag: 'Formel',
    delay: '< 48h',
  },
];

// ─── Sujets du formulaire ────────────────────────────────────────────
export const SUBJECTS: Subject[] = [
  { value: 'bug',         label: '🐛 Signalement de bug' },
  { value: 'feature',     label: '✦ Suggestion de fonctionnalité' },
  { value: 'account',     label: '◈ Problème de compte' },
  { value: 'api',         label: '⬡ Problème avec la clé API GW2' },
  { value: 'partnership', label: '◎ Partenariat / Presse' },
  { value: 'other',       label: '— Autre demande' },
];

// ─── Informations délais de réponse (hero) ───────────────────────────
export const INFO_ITEMS: InfoItem[] = [
  { lbl: 'E-mail',   val: '< 48h ouvrées' },
  { lbl: 'Discord',  val: 'Instantané' },
  { lbl: 'GitHub',   val: '72h max' },
  { lbl: 'Urgence',  val: 'moderation@gw2nexus.fr' },
];