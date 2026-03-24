// =============================================================
// components/events/EventRowComponent/EventRow.tsx
// Ligne d'un événement dans le timer
//
// Layout en 3 colonnes (identique à EventTimer/TimelineHeader) :
//   col 1 (260px) — icône + nom + zone
//   col 2 (130px) — badge de statut
//   col 3 (1fr)   — barres de créneaux sur la timeline visuelle
// =============================================================

import React, { useMemo } from 'react';
import type { EventState, TimelineSlot } from '../../../types/events.types';
import EventBadge from '../EventBadgeComponent/EventBadge';
import styles from './EventRow.module.css';

interface EventRowProps {
  eventState: EventState;
  timelineSlots: TimelineSlot[];
  /** Couleur de la zone parente (barres de la timeline) */
  zoneColor: string;
}

// ─────────────────────────────────────────────────────────────
// Utilitaire : positionner une barre sur la timeline
// ─────────────────────────────────────────────────────────────

interface BarPosition {
  leftPercent: number;
  widthPercent: number;
}

/**
 * Calcule la position et la largeur (en %) d'un créneau d'événement
 * par rapport à la fenêtre de la timeline.
 * Retourne null si le créneau est hors de la fenêtre visible.
 */
const computeBarPosition = (
  slotStartMin: number,
  slotDurationMin: number,
  slots: TimelineSlot[],
): BarPosition | null => {
  if (slots.length < 2) return null;

  const windowStart = slots[0].minutes;
  const windowEnd   = slots[slots.length - 1].minutes + 30; // +30 min pour la dernière colonne
  const windowRange = windowEnd - windowStart;
  if (windowRange <= 0) return null;

  const slotEnd = slotStartMin + slotDurationMin;

  // Hors fenêtre
  if (slotStartMin >= windowEnd || slotEnd <= windowStart) return null;

  // Clipper dans la fenêtre
  const clampedStart = Math.max(slotStartMin, windowStart);
  const clampedEnd   = Math.min(slotEnd, windowEnd);

  const leftPercent  = ((clampedStart - windowStart) / windowRange) * 100;
  const widthPercent = ((clampedEnd - clampedStart) / windowRange) * 100;

  return {
    leftPercent:  Math.max(0, Math.min(100, leftPercent)),
    widthPercent: Math.max(0, Math.min(100 - leftPercent, widthPercent)),
  };
};

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const EventRow: React.FC<EventRowProps> = ({ eventState, timelineSlots, zoneColor }) => {
  const { event, status, nextStartLocal, secondsUntilStart, progressPercent, secondsRemaining } =
    eventState;

  // Calcul des positions des barres (mémoïsé car les slots changent rarement)
  const bars = useMemo(
    () =>
      event.slots
        .map((slot, idx) => {
          const pos = computeBarPosition(slot.startMinutes, slot.durationMinutes, timelineSlots);
          if (!pos) return null;
          return { ...pos, key: `${event.id}-${idx}`, slot };
        })
        .filter(Boolean) as (BarPosition & { key: string })[],
    [event.slots, event.id, timelineSlots],
  );

  return (
    <div
      className={`${styles.row} ${styles[`status_${status}`]}`}
      role="row"
      aria-label={`${event.name} — ${status}`}
    >
      {/* ── Col 1 : Infos ────────────────────────────────────────────── */}
      <div className={styles.infoCell}>
        {event.iconUrl ? (
          <img src={event.iconUrl} alt="" className={styles.icon} aria-hidden="true" />
        ) : (
          <span className={styles.iconFallback} aria-hidden="true">⚔️</span>
        )}
        <div className={styles.nameBlock}>
          <span className={styles.eventName}>{event.name}</span>
          <span className={styles.zoneName}>{event.zone}</span>
        </div>
      </div>

      {/* ── Col 2 : Badge ────────────────────────────────────────────── */}
      <div className={styles.badgeCell}>
        <EventBadge
          status={status}
          secondsUntilStart={secondsUntilStart}
          nextStartLocal={nextStartLocal}
          progressPercent={progressPercent}
          secondsRemaining={secondsRemaining}
        />
      </div>

      {/* ── Col 3 : Timeline ─────────────────────────────────────────── */}
      <div className={styles.timelineCell} role="presentation">
        {/* Grille de fond (colonnes par créneau de 30 min) */}
        <div className={styles.timelineGrid}>
          {timelineSlots.map((s) => (
            <div
              key={s.minutes}
              className={`${styles.gridCol} ${s.isCurrent ? styles.gridColCurrent : ''}`}
            />
          ))}
        </div>

        {/* Barres des créneaux d'événement */}
        {bars.map((bar) => (
          <div
            key={bar.key}
            className={`${styles.eventBar} ${status === 'active' ? styles.eventBarActive : ''}`}
            style={{
              left: `${bar.leftPercent}%`,
              width: `${bar.widthPercent}%`,
              backgroundColor: zoneColor,
            }}
            aria-hidden="true"
          >
            {/* Label dans la barre si assez large (> 8%) */}
            {bar.widthPercent > 8 && (
              <span className={styles.barLabel}>{event.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRow;