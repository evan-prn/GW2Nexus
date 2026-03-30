// =============================================================
// data/events.data.ts
// Horaires statiques des événements GW2
//
// Source officielle : https://wiki.guildwars2.com/wiki/Event_timers
// Les créneaux sont en minutes depuis minuit UTC.
// Mise à jour : 2025 — à ajuster si ArenaNet modifie les horaires.
// =============================================================

import type { EventExpansionGroup } from '../types/events.types';

// ─────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────

/**
 * Convertit "HH:MM" (UTC) en minutes depuis minuit.
 * Exemple : hm("07:30") → 450
 */
const hm = (hhMm: string): number => {
  const [h, m] = hhMm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Génère 12 créneaux espacés de 2h à partir d'une heure de départ.
 * Utilisé pour les méta-événements dont le cycle est fixe de 2h.
 *
 * Exemple : cycle2h("01:00", 15) → slots à 01:00, 03:00, 05:00...
 */
const cycle2h = (startHHMM: string, durationMin: number, preEventMin = 5) => {
  const base = hm(startHHMM);
  return Array.from({ length: 12 }, (_, i) => ({
    startMinutes: (base + i * 120) % 1440,
    durationMinutes: durationMin,
    preEventMinutes: preEventMin,
  }));
};

// ─────────────────────────────────────────────────────────────
// WORLD BOSSES — Tyrie Centrale, horaires fixes
// Source : https://wiki.guildwars2.com/wiki/World_boss
// ─────────────────────────────────────────────────────────────

const WORLD_BOSSES_GROUP: EventExpansionGroup = {
  id: 'world_bosses',
  label: 'World Bosses',
  zones: [
    {
      id: 'cote-maree-sanglante',
      name: 'Côte de la Marée Sanglante',
      color: '#4a90d9',
      icon: '🌊',
      events: [
        {
          id: 'tequatl',
          name: 'Tequatl le Sans-Soleil',
          zone: 'Côte de la Marée Sanglante',
          category: 'world_boss',
          isTwoHourCycle: false,
          // Horaires fixes Tequatl (UTC) — source : wiki GW2
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('03:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('07:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('11:30'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('19:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Tequatl_the_Sunless',
        },
      ],
    },
    {
      id: 'champs-gendarran',
      name: 'Champs de Gendarran',
      color: '#c9619a',
      icon: '⚔️',
      events: [
        {
          id: 'triple-terreur',
          name: 'Triple Terreur',
          zone: 'Champs de Gendarran',
          category: 'world_boss',
          isTwoHourCycle: false,
          // Horaires fixes Triple Terreur (UTC) — source : wiki GW2
          slots: [
            { startMinutes: hm('01:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('12:30'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('17:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Triple_Trouble',
        },
      ],
    },
    {
      id: 'rive-aux-epaves-wb',
      name: 'Rive aux Épaves',
      color: '#c9619a',
      icon: '👥',
      events: [
        {
          id: 'behemoth-ombres',
          name: 'Béhémoth des Ombres',
          zone: 'Rive aux Épaves',
          category: 'world_boss',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Shadow_Behemoth',
        },
      ],
    },
    {
      id: 'pays-kessex',
      name: 'Pays de Kessex',
      color: '#c9619a',
      icon: '⚙️',
      events: [
        {
          id: 'golem-mark-ii',
          name: 'Golem Mark II',
          zone: 'Pays de Kessex',
          category: 'world_boss',
          isTwoHourCycle: true,
          slots: cycle2h('01:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Golem_Mark_II',
        },
      ],
    },
    {
      id: 'hautes-plaines',
      name: 'Hautes Plaines Brûlées',
      color: '#c9619a',
      icon: '🔥',
      events: [
        {
          id: 'megadestructeur',
          name: 'Le Mégadestructeur',
          zone: 'Hautes Plaines Brûlées',
          category: 'world_boss',
          isTwoHourCycle: true,
          slots: cycle2h('00:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Megadestroyer',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// HEART OF THORNS — Méta-événements HoT
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const HOT_GROUP: EventExpansionGroup = {
  id: 'hot',
  label: 'Heart of Thorns',
  zones: [
    {
      id: 'oree-emeraude',
      name: "Orée d'Émeraude",
      color: '#6ab04c',
      icon: '🌿',
      events: [
        {
          id: 'oree-meta',
          name: "Méta de l'Orée d'Émeraude",
          zone: "Orée d'Émeraude",
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 90, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Verdant_Brink_meta_event_chain',
        },
      ],
    },
    {
      id: 'bassin-aurique',
      name: 'Bassin Aurique',
      color: '#f0c040',
      icon: '🏆',
      events: [
        {
          id: 'auric-basin-meta',
          name: 'Octovine',
          zone: 'Bassin Aurique',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('00:45', 20, 15),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Auric_Basin_meta_event_chain',
        },
      ],
    },
    {
      id: 'profondeurs-verdoyantes',
      name: 'Profondeurs Verdoyantes',
      color: '#9b59b6',
      icon: '🕳️',
      events: [
        {
          id: 'chak-gerent',
          name: 'Chak Gérent',
          zone: 'Profondeurs Verdoyantes',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('00:30', 20, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Chak_Gerent',
        },
      ],
    },
    {
      id: 'repli-dragon',
      name: 'Repli du Dragon',
      color: '#e74c3c',
      icon: '🐉',
      events: [
        {
          id: 'liberation-soleil-dragon',
          name: 'Libération du Soleil Dragon',
          zone: 'Repli du Dragon',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('01:30', 20, 5),
          wikiUrl: "https://wiki.guildwars2.com/wiki/Dragon%27s_Stand_meta_event_chain",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// PATH OF FIRE — Méta-événements PoF
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const POF_GROUP: EventExpansionGroup = {
  id: 'pof',
  label: 'Path of Fire',
  zones: [
    {
      id: 'deserts-cristal',
      name: 'Déserts de Cristal',
      color: '#e8a030',
      icon: '🏜️',
      events: [
        {
          id: 'palawadan',
          name: 'Palawadan, Joyau du Désert',
          zone: 'Déserts de Cristal',
          category: 'pof',
          isTwoHourCycle: false,
          // Horaires fixes toutes les 2h à xx:00 (UTC)
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('02:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('06:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('10:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('12:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('14:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('18:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('22:00'), durationMinutes: 30, preEventMinutes: 5 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Palawadan,_Jewel_of_the_Desert',
        },
      ],
    },
    {
      id: 'domaine-vabbi',
      name: 'Domaine de Vabbi',
      color: '#e8a030',
      icon: '🕌',
      events: [
        {
          id: 'grand-court-sekhara',
          name: 'La Grande Cour de Sekhara',
          zone: 'Domaine de Vabbi',
          category: 'pof',
          isTwoHourCycle: true,
          slots: cycle2h('00:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Grand_Court_of_Sekhara',
        },
      ],
    },
    {
      id: 'bassin-elon',
      name: "Bassin d'Elon",
      color: '#e8a030',
      icon: '🌊',
      events: [
        {
          id: 'boucher-abomination',
          name: "Abomination du Boucher",
          zone: "Bassin d'Elon",
          category: 'pof',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 20, 5),
          wikiUrl: "https://wiki.guildwars2.com/wiki/Elon_Riverlands",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// END OF DRAGONS — Méta-événements EoD
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const EOD_GROUP: EventExpansionGroup = {
  id: 'eod',
  label: 'End of Dragons',
  zones: [
    {
      id: 'fin-du-dragon',
      name: "Fin du Dragon",
      color: '#4a90d9',
      icon: '🐲',
      events: [
        {
          id: 'temple-moisson',
          name: 'Temple de la Moisson',
          zone: "Fin du Dragon",
          category: 'eod',
          isTwoHourCycle: false,
          // Horaires fixes toutes les 2h à xx:00 (UTC)
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('02:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('06:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('10:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('12:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('14:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('18:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('22:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: "https://wiki.guildwars2.com/wiki/Dragon%27s_End",
        },
      ],
    },
    {
      id: 'nouvelle-kaineng',
      name: 'Nouvelle Kaineng',
      color: '#4a90d9',
      icon: '🏙️',
      events: [
        {
          id: 'kaineng-surpeuplee',
          name: 'Surpopulation de Kaineng',
          zone: 'Nouvelle Kaineng',
          category: 'eod',
          isTwoHourCycle: true,
          slots: cycle2h('00:45', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/New_Kaineng_City',
        },
      ],
    },
    {
      id: 'echos-ecarlates',
      name: 'Échos Écarlates',
      color: '#4a90d9',
      icon: '🎋',
      events: [
        {
          id: 'arborstone',
          name: 'Méta Arborstone',
          zone: 'Échos Écarlates',
          category: 'eod',
          isTwoHourCycle: true,
          slots: cycle2h('01:15', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Seitung_Province',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECRETS OF THE OBSCURE — Méta-événements SotO
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const SOTO_GROUP: EventExpansionGroup = {
  id: 'soto',
  label: 'Secrets of the Obscure',
  zones: [
    {
      id: 'skywatch-archipelago',
      name: 'Archipel de Skywatch',
      color: '#8e44ad',
      icon: '☁️',
      events: [
        {
          id: 'skywatch-meta',
          name: "Méta de l'Archipel de Skywatch",
          zone: 'Archipel de Skywatch',
          category: 'soto',
          isTwoHourCycle: true,
          slots: cycle2h('00:00', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Skywatch_Archipelago',
        },
      ],
    },
    {
      id: 'amnytas',
      name: 'Amnytas',
      color: '#8e44ad',
      icon: '🌌',
      events: [
        {
          id: 'amnytas-meta',
          name: "Méta d'Amnytas",
          zone: 'Amnytas',
          category: 'soto',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 30, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Amnytas',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// JANTHIR WILDS — Méta-événements JW
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// Note : syntri-meta démarre à xx:40 (confirmé wiki GW2)
// ─────────────────────────────────────────────────────────────

const JW_GROUP: EventExpansionGroup = {
  id: 'jw',
  label: 'Janthir Wilds',
  zones: [
    {
      id: 'rive-aux-epaves',
      name: 'Rive aux Épaves',
      color: '#c9619a',
      icon: '⚓',
      events: [
        {
          id: 'bagarre-cerf-marteau',
          name: 'Bagarre des Cerf-Marteau !',
          zone: 'Rive aux Épaves',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:40', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'bois-etoile',
      name: 'Bois Étoilé',
      color: '#c9619a',
      icon: '🌳',
      events: [
        {
          id: 'secrets-du-bois',
          name: 'Secrets du Bois',
          zone: 'Bois Étoilé',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'bava-nisos',
      name: 'Bava Nisos',
      color: '#4a90d9',
      icon: '🏝️',
      events: [
        {
          id: 'voyage-titanesque',
          name: 'Un Voyage Titanesque',
          zone: 'Bava Nisos',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:20', 25, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'convergences-mont-balrior',
      name: 'Convergences : Mont Balrior',
      color: '#4a90d9',
      icon: '⛰️',
      events: [
        {
          id: 'convergences-balrior',
          name: 'Convergences',
          zone: 'Convergences : Mont Balrior',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('02:00', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Convergences',
        },
      ],
    },
    {
      id: 'syntri-de-janthir',
      name: 'Syntri de Janthir',
      color: '#4a90d9',
      icon: '🌐',
      events: [
        {
          id: 'syntri-meta',
          name: 'Méta de Syntri',
          zone: 'Syntri de Janthir',
          category: 'jw',
          isTwoHourCycle: true,
          // Départ xx:40 — confirmé wiki GW2 (Of Mists and Monsters)
          slots: cycle2h('00:40', 30, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Of_Mists_and_Monsters',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// VISIONS OF ETERNITY — Méta-événements VoE
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// Hammerhart Rumble + Secrets of the Weald : cycle 2h, départ xx:40
// Confirmé : wiki GW2 + gw2tldr.com live timer
// ─────────────────────────────────────────────────────────────

const VOE_GROUP: EventExpansionGroup = {
  id: 'voe',
  label: 'Visions of Eternity',
  zones: [
    {
      id: 'shipwreck-strand',
      name: 'Rive aux Épaves de Castora',
      color: '#3d8bbf',
      icon: '⚓',
      events: [
        {
          id: 'hammerhart-rumble',
          name: 'Bagarre des Hammerhart !',
          zone: 'Rive aux Épaves de Castora',
          category: 'voe',
          isTwoHourCycle: true,
          // Départ xx:40 — confirmé wiki GW2 + gw2tldr live timer
          slots: cycle2h('00:40', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Hammerhart_Rumble!',
        },
      ],
    },
    {
      id: 'starlit-weald',
      name: 'Forêt Étoilée',
      color: '#6a5acd',
      icon: '🌟',
      events: [
        {
          id: 'secrets-of-the-weald',
          name: 'Secrets de la Forêt',
          zone: 'Forêt Étoilée',
          category: 'voe',
          isTwoHourCycle: true,
          // Départ xx:40 — même fenêtre que Hammerhart Rumble
          slots: cycle2h('00:40', 25, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Secrets_of_the_Weald',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Export principal — ordre d'affichage dans l'UI
// Ordre chronologique des extensions GW2
// ─────────────────────────────────────────────────────────────

export const EVENT_GROUPS: EventExpansionGroup[] = [
  WORLD_BOSSES_GROUP, // Core Tyria
  HOT_GROUP,          // Heart of Thorns (2015)
  POF_GROUP,          // Path of Fire (2017)
  EOD_GROUP,          // End of Dragons (2022)
  SOTO_GROUP,         // Secrets of the Obscure (2023)
  JW_GROUP,           // Janthir Wilds (2024)
  VOE_GROUP,          // Visions of Eternity (2025)
];

/** IDs des groupes pour les filtres de l'UI */
export const EXPANSION_FILTER_IDS = EVENT_GROUPS.map((g) => g.id);