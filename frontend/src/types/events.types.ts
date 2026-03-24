// =============================================================
// types/events.types.ts
// Types TypeScript — Feature Timer d'Événements GW2
// =============================================================

/**
 * Catégories d'événements GW2 par extension.
 */
export type EventCategory =
  | 'world_boss' // Boss mondiaux de Tyrie centrale
  | 'hot'        // Heart of Thorns
  | 'pof'        // Path of Fire
  | 'icebrood'   // Épopée du Givre (IBS)
  | 'eod'        // End of Dragons
  | 'soto'       // Secrets of the Obscure
  | 'jw';        // Janthir Wilds

/**
 * Statut calculé en temps réel d'un événement.
 * Déterminé par useEventTimer à chaque tick.
 */
export type EventStatus = 'active' | 'upcoming' | 'idle';

/**
 * Un créneau horaire fixe pour un événement.
 * Les minutes sont exprimées depuis minuit UTC (0 = 00:00 UTC).
 */
export interface EventSlot {
  /** Début du créneau en minutes depuis minuit UTC */
  startMinutes: number;
  /** Durée de l'événement en minutes */
  durationMinutes: number;
  /** Durée du pré-événement en minutes (0 si aucun) */
  preEventMinutes: number;
}

/**
 * Définition statique d'un événement GW2.
 * Les horaires GW2 sont fixes et documentés sur le wiki officiel.
 */
export interface GW2Event {
  /** Identifiant unique (ex: "tequatl", "chak-gerent") */
  id: string;
  /** Nom affiché en français */
  name: string;
  /** Nom de la carte/zone */
  zone: string;
  /** Catégorie de contenu */
  category: EventCategory;
  /** URL icône ArenaNet (optionnelle) */
  iconUrl?: string;
  /** Lien wiki GW2 (optionnel) */
  wikiUrl?: string;
  /** Créneaux horaires fixes dans la journée UTC */
  slots: EventSlot[];
  /**
   * Si true : les horaires tournent sur un cycle de 2h.
   * Les world bosses classiques utilisent ce mécanisme.
   * Si false : horaires fixes uniques dans la journée de 24h.
   */
  isTwoHourCycle: boolean;
}

/**
 * Groupe d'événements d'une même carte/zone.
 * Correspond à une "section" dans l'interface (comme le Bus Magique).
 */
export interface EventZone {
  id: string;
  /** Nom de la zone affiché en en-tête */
  name: string;
  /** Couleur principale (barre latérale + barres timeline) */
  color: string;
  /** Icône de la zone (emoji GW2) */
  icon: string;
  /** Liste des événements de cette zone */
  events: GW2Event[];
}

/**
 * Groupe d'expansion (ex: "Janthir Wilds", "World Bosses").
 * Permet de filtrer l'affichage par extension.
 */
export interface EventExpansionGroup {
  /** Identifiant utilisé pour les filtres */
  id: string;
  /** Label affiché dans les boutons de filtre */
  label: string;
  /** Zones de cette expansion */
  zones: EventZone[];
}

/**
 * État calculé en temps réel pour un événement.
 * Produit par useEventTimer à chaque seconde.
 */
export interface EventState {
  event: GW2Event;
  /** Statut courant */
  status: EventStatus;
  /** Heure locale du prochain démarrage */
  nextStartLocal: Date;
  /** Secondes avant le prochain démarrage (0 si actif) */
  secondsUntilStart: number;
  /** Progression si actif (0-100) */
  progressPercent: number;
  /** Secondes restantes si actif */
  secondsRemaining: number;
}

/**
 * Créneau de la timeline (en-tête des colonnes horaires).
 */
export interface TimelineSlot {
  /** Label affiché (ex: "09:00") */
  label: string;
  /** Minutes depuis minuit UTC */
  minutes: number;
  /** True si ce créneau couvre l'heure courante */
  isCurrent: boolean;
}