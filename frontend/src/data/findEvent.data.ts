// =============================================================
// data/findEvent.data.ts
// Recherche d'un événement par son ID dans EVENT_GROUPS
// =============================================================

import { EVENT_GROUPS } from './events.data';
import type { EventExpansionGroup } from '../types/events.types';

export interface FoundEvent {
  event: EventExpansionGroup['zones'][0]['events'][0];
  zone:  EventExpansionGroup['zones'][0];
  group: EventExpansionGroup;
}

export const findEventById = (id: string): FoundEvent | null => {
  for (const group of EVENT_GROUPS) {
    for (const zone of group.zones) {
      const event = zone.events.find((e) => e.id === id);
      if (event) return { event, zone, group };
    }
  }
  return null;
};