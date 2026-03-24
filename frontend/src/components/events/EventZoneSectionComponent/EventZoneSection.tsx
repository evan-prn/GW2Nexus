// =============================================================
// components/events/EventZoneSectionComponent/EventZoneSection.tsx
// Section d'une zone/carte avec ses événements
//
// Affiche :
//   - En-tête coloré : barre latérale + icône + nom + badge "EN COURS"
//   - Liste des EventRow pour chaque event de la zone
// =============================================================

import React, { useMemo } from 'react';
import type { EventZone, TimelineSlot } from '@/types/events.types';
import { useEventTimer } from '@/hooks/event/useEventTimer';
import EventRow from '../EventRowComponent/EventRow';
import styles from './EventZoneSection.module.css';

interface EventZoneSectionProps {
  zone: EventZone;
  timelineSlots: TimelineSlot[];
}

const EventZoneSection: React.FC<EventZoneSectionProps> = ({ zone, timelineSlots }) => {
  // Calcul des états en temps réel pour les events de cette zone
  const eventStates = useEventTimer(zone.events);

  // Les events actifs remontent en premier pour attirer l'attention
  const sortedStates = useMemo(
    () =>
      [...eventStates].sort((a, b) => {
        const order: Record<string, number> = { active: 0, upcoming: 1, idle: 2 };
        return order[a.status] - order[b.status];
      }),
    [eventStates],
  );

  const hasActive = eventStates.some((s) => s.status === 'active');

  return (
    <section
      className={`${styles.section} ${hasActive ? styles.sectionActive : ''}`}
      // Variable CSS locale pour utiliser la couleur de la zone dans les enfants
      style={{ '--zone-color': zone.color } as React.CSSProperties}
      aria-label={`Zone : ${zone.name}`}
    >
      {/* ── En-tête ───────────────────────────────────────────────────── */}
      <div className={styles.header}>
        {/* Barre colorée à gauche */}
        <div className={styles.colorBar} style={{ backgroundColor: zone.color }} />

        {/* Icône de la zone */}
        <span className={styles.zoneIcon} aria-hidden="true">{zone.icon}</span>

        {/* Nom de la zone — utilise la couleur de la zone */}
        <h3 className={styles.zoneName} style={{ color: zone.color }}>
          {zone.name}
        </h3>

        {/* Badge "EN COURS" visible uniquement si un event est actif */}
        {hasActive && (
          <span className={styles.activeTag} role="status" aria-live="polite">
            EN COURS
          </span>
        )}
      </div>

      {/* ── Liste des events ──────────────────────────────────────────── */}
      <div className={styles.eventList} role="rowgroup">
        {sortedStates.map((state) => (
          <EventRow
            key={state.event.id}
            eventState={state}
            timelineSlots={timelineSlots}
            zoneColor={zone.color}
          />
        ))}
      </div>
    </section>
  );
};

export default EventZoneSection;