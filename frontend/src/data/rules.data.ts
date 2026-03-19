// ═══════════════════════════════════════════════════════════════════
// src/data/rules.data.ts
// Données statiques de la page Règles :
// configuration des onglets, données légales, confidentialité, CGU
// ═══════════════════════════════════════════════════════════════════

// ─── Types ──────────────────────────────────────────────────────────

export type TabId = 'legal' | 'privacy' | 'terms';

export interface Tab {
  id: TabId;
  icon: string;
  label: string;
  shortLabel: string;
  updated: string;
  description: string;
}

export interface DataCategory {
  icon: string;
  label: string;
  items: string[];
}

export interface RightItem {
  icon: string;
  right: string;
  desc: string;
}

export interface RulesBlock {
  type: 'allowed' | 'forbidden';
  icon: string;
  title: string;
  items: string[];
}

// ─── Configuration des onglets ───────────────────────────────────────
export const TABS: Tab[] = [
  {
    id: 'legal',
    icon: '◎',
    label: 'Mentions légales',
    shortLabel: 'Légal',
    updated: 'Janvier 2025',
    description: 'Éditeur, hébergement, propriété intellectuelle et droit applicable.',
  },
  {
    id: 'privacy',
    icon: '⬡',
    label: 'Confidentialité',
    shortLabel: 'Confidentialité',
    updated: 'Janvier 2025',
    description: 'Collecte, traitement et protection de vos données personnelles. RGPD.',
  },
  {
    id: 'terms',
    icon: '◈',
    label: "Conditions d'utilisation",
    shortLabel: 'CGU',
    updated: 'Janvier 2025',
    description: "Règles d'utilisation, conduite, modération et responsabilités.",
  },
];

// ─── Données Confidentialité — catégories de données collectées ──────
export const PRIVACY_DATA_CATEGORIES: DataCategory[] = [
  {
    icon: '◎',
    label: 'Identité',
    items: ["Nom / pseudo d'affichage", 'Adresse email', 'Pseudo GW2 (optionnel)'],
  },
  {
    icon: '⬡',
    label: 'Données de jeu',
    items: ['Clé API GW2 (chiffrée AES-256)', 'Nom de compte GW2', 'Serveur / monde', 'Liste des personnages'],
  },
  {
    icon: '◈',
    label: 'Contenu généré',
    items: ['Discussions et commentaires', 'Builds créés', 'Pages de guilde'],
  },
  {
    icon: '✦',
    label: 'Données techniques',
    items: ['Adresse IP (logs serveur)', 'Cookie de session', 'Token CSRF'],
  },
];

// ─── Données Confidentialité — droits RGPD ───────────────────────────
export const PRIVACY_RIGHTS: RightItem[] = [
  { icon: '◎', right: 'Accès',         desc: 'Obtenir une copie de vos données personnelles' },
  { icon: '◈', right: 'Rectification', desc: 'Corriger des données inexactes ou incomplètes' },
  { icon: '⬡', right: 'Effacement',    desc: 'Supprimer votre compte et vos données associées' },
  { icon: '✦', right: 'Portabilité',   desc: 'Recevoir vos données dans un format structuré (JSON)' },
  { icon: '★', right: 'Opposition',    desc: 'Vous opposer à certains traitements de vos données' },
];

// ─── Données CGU — règles de conduite (autorisé / interdit) ──────────
export const TERMS_RULES_BLOCKS: RulesBlock[] = [
  {
    type: 'allowed',
    icon: '✓',
    title: 'Autorisé',
    items: [
      'Partager guides, builds et stratégies',
      'Débattre dans le respect mutuel',
      'Signaler les contenus inappropriés',
      "Utiliser l'API GW2 pour son propre compte",
      'Créer et gérer une page de guilde',
    ],
  },
  {
    type: 'forbidden',
    icon: '✗',
    title: 'Interdit',
    items: [
      'Harcèlement, insultes, discriminations',
      'Spam ou contenu publicitaire non sollicité',
      "Partage d'informations personnelles de tiers",
      'Contenu illégal ou protégé sans autorisation',
      'Tentatives de contournement des systèmes de sécurité',
    ],
  },
];