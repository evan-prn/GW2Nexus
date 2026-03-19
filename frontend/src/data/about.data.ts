// ═══════════════════════════════════════════════════════════════════
// src/data/about.data.ts
// Données statiques de la page About : stats, features, stack, team
// ═══════════════════════════════════════════════════════════════════

// ─── Types ──────────────────────────────────────────────────────────
export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export interface TeamMember {
  name: string;
  role: string;
  focus: string[];
  avatar: string;
  github: string;
}

export interface StackItem {
  name: string;
  category: string;
  color: string;
}

// ─── Chiffres clés du projet ─────────────────────────────────────────
export const STATS: Stat[] = [
  { value: '12',  label: 'Tables de données',       icon: '⬡' },
  { value: '6',   label: 'Sprints de développement', icon: '◈' },
  { value: '90+', label: 'Attributs modélisés',      icon: '✦' },
  { value: '3',   label: 'Mois pour le MVP',          icon: '◎' },
];

// ─── Fonctionnalités principales (épopées Scrum) ─────────────────────
export const FEATURES: Feature[] = [
  {
    icon: '⚔',
    title: 'Forum Communautaire',
    description:
      'Échangez stratégies, guides et expériences avec l\'ensemble de la communauté GW2. Catégories, fils de discussion, réponses acceptées.',
    tag: 'EP-03',
  },
  {
    icon: '◈',
    title: 'Profils Joueurs',
    description:
      'Connectez votre clé API Guild Wars 2 pour afficher vos données de jeu, personnages et statistiques de compte directement sur votre profil.',
    tag: 'EP-02',
  },
  {
    icon: '⬡',
    title: 'Base de Données GW2',
    description:
      'Explorez objets, quêtes et événements du jeu avec des données fraîches issues de l\'API officielle ArenaNet, enrichies par la communauté.',
    tag: 'EP-04',
  },
  {
    icon: '✦',
    title: 'Système de Builds',
    description:
      'Créez, partagez et commentez des builds pour toutes les professions. Filtrez par mode de jeu : PvE, PvP, WvW.',
    tag: 'EP-06',
  },
  {
    icon: '◎',
    title: 'Guildes',
    description:
      'Importez votre guilde depuis l\'API GW2, gérez vos membres et créez un espace dédié à votre communauté de guilde.',
    tag: 'EP-05',
  },
  {
    icon: '★',
    title: 'Intégration API Officielle',
    description:
      'Synchronisation en temps réel avec l\'API Guild Wars 2 pour des données toujours à jour : tokeninfo, items, world boss timers.',
    tag: 'EP-04',
  },
];

// ─── Stack technique ─────────────────────────────────────────────────
export const STACK_ITEMS: StackItem[] = [
  { name: 'Laravel 11',      category: 'Backend',  color: '#FF4444' },
  { name: 'React 18',        category: 'Frontend', color: '#61DAFB' },
  { name: 'MySQL 8',         category: 'Database', color: '#4479A1' },
  { name: 'Docker',          category: 'DevOps',   color: '#2496ED' },
  { name: 'Sanctum',         category: 'Auth',     color: '#C9A84C' },
  { name: 'Vite',            category: 'Frontend', color: '#646CFF' },
  { name: 'TypeScript',      category: 'Frontend', color: '#3178C6' },
  { name: 'Redis',           category: 'Cache',    color: '#DC382D' },
  { name: 'GitHub Actions',  category: 'CI/CD',    color: '#2088FF' },
];

// ─── Membres de l'équipe ─────────────────────────────────────────────
export const TEAM: TeamMember[] = [
  {
    name: 'PERNOT Evan',
    role: 'Frontend & DevOps',
    focus: ['React', 'Docker', 'CI/CD'],
    avatar: 'D1',
    github: 'evan-prn',
  },
  {
    name: 'MORALES Julian',
    role: 'Backend & Base de données',
    focus: ['Laravel', 'MySQL', 'API GW2', 'Auth'],
    avatar: 'D2',
    github: '',
  },
];