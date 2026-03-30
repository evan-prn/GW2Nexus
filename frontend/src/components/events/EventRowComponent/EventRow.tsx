// =============================================================
// components/events/EventRowComponent/EventRow.tsx — v3
// Ligne d'un événement dans le timer
//
// Améliorations v3 :
//  - clic sur le nom de l'event → navigation vers /events/{id}
//  - tooltip heure UTC sur chaque barre (title attribut)
//  - iconFallback avec style cohérent (pas d'emoji brut)
//  - overflow:hidden sur timelineCell pour éviter les débordements
// =============================================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EventState, TimelineSlot } from '../../../types/events.types';
import EventBadge from '@/components/events/EventBadgeComponent/EventBadge';
import styles from './EventRow.module.css';

interface EventRowProps {
  eventState: EventState;
  timelineSlots: TimelineSlot[];
  zoneColor: string;
}

// ─────────────────────────────────────────────────────────────
// Calcul de position d'une barre sur la timeline
// ─────────────────────────────────────────────────────────────

interface BarPosition {
  leftPercent: number;
  widthPercent: number;
}

const computeBarPosition = (
  slotStartMin: number,
  slotDurationMin: number,
  slots: TimelineSlot[],
): BarPosition | null => {
  if (slots.length < 2) return null;

  const windowStart = slots[0].minutes;
  // +30 min pour inclure la dernière colonne complète
  const windowEnd = slots[slots.length - 1].minutes + 30;
  const windowRange = windowEnd - windowStart;
  if (windowRange <= 0) return null;

  const slotEnd = slotStartMin + slotDurationMin;

  // Hors fenêtre
  if (slotStartMin >= windowEnd || slotEnd <= windowStart) return null;

  const clampedStart = Math.max(slotStartMin, windowStart);
  const clampedEnd = Math.min(slotEnd, windowEnd);

  const leftPercent = ((clampedStart - windowStart) / windowRange) * 100;
  const widthPercent = ((clampedEnd - clampedStart) / windowRange) * 100;

  return {
    leftPercent: Math.max(0, Math.min(100, leftPercent)),
    // min 0.5% pour rester visible
    widthPercent: Math.max(0.5, Math.min(100 - leftPercent, widthPercent)),
  };
};

/** Formate les minutes UTC en "HH:MM UTC" pour les tooltips */
const formatUtcTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} UTC`;
};

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

const EventRow: React.FC<EventRowProps> = ({ eventState, timelineSlots, zoneColor }) => {
  const { event, status, nextStartLocal, secondsUntilStart, progressPercent, secondsRemaining } =
    eventState;

  const navigate = useNavigate();

  const bars = useMemo(
    () =>
      event.slots
        .map((slot, idx) => {
          const pos = computeBarPosition(slot.startMinutes, slot.durationMinutes, timelineSlots);
          if (!pos) return null;
          return {
            ...pos,
            key: `${event.id}-${idx}`,
            tooltipLabel: `${event.name} — ${formatUtcTime(slot.startMinutes)}`,
          };
        })
        .filter(Boolean) as (BarPosition & { key: string; tooltipLabel: string })[],
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
          <img
            src={event.iconUrl}
            alt={event.name}
            className={styles.icon}
            loading="lazy"
          />
        ) : (
          <span className={styles.iconFallback} aria-hidden="true">⚔</span>
        )}
        <div className={styles.nameBlock}>
          {/* Clic sur le nom → page détail de l'event */}
          <span
            className={styles.eventName}
            onClick={() => navigate(`/events/${event.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/events/${event.id}`)}
            aria-label={`Voir le détail de ${event.name}`}
          >
            {event.name}
          </span>
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
      <div className={styles.timelineCell} aria-hidden="true">
        {/* Grille de fond */}
        <div className={styles.timelineGrid}>
          {timelineSlots.map((s) => (
            <div
              key={s.minutes}
              className={`${styles.gridCol} ${s.isCurrent ? styles.gridColCurrent : ''}`}
            />
          ))}
        </div>

        {/* Barres de créneaux */}
        {bars.map((bar) => (
          <div
            key={bar.key}
            className={`${styles.eventBar} ${status === 'active' ? styles.eventBarActive : ''}`}
            style={{
              left: `${bar.leftPercent}%`,
              width: `${bar.widthPercent}%`,
              backgroundColor: zoneColor,
            }}
            title={bar.tooltipLabel}
          >
            {bar.widthPercent > 7 && (
              <span className={styles.barLabel}>{event.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRow;