// =============================================================
// components/events/TimelineHeaderComponent/TimelineHeader.tsx — v2
// En-tête sticky : horloges UTC/locale + colonnes horaires
// Ajout : label "Heure suivante" sur la dernière colonne
// =============================================================

import React from 'react';
import type { TimelineSlot } from '@/types/events.types';
import { useServerClock } from '@/hooks/event/useEventTimer';
import styles from './TimelineHeader.module.css';

interface TimelineHeaderProps {
  timelineSlots: TimelineSlot[];
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ timelineSlots }) => {
  const { utcTime, localTime } = useServerClock();

  return (
    <div className={styles.header} role="rowgroup">

      {/* ── Col 1 : Label ────────────────────────────────────────────── */}
      <div className={styles.infoCol}>
        <span className={styles.colLabel}>Événement</span>
      </div>

      {/* ── Col 2 : Horloges ─────────────────────────────────────────── */}
      <div className={styles.clockCol}>
        {/* Heure serveur GW2 = UTC */}
        <div className={styles.clockBlock}>
          <span
            className={styles.clockTime}
            data-type="utc"
            aria-label={`Heure serveur : ${utcTime}`}
          >
            {utcTime}
          </span>
          <span className={styles.clockLabel}>Heure serveur</span>
        </div>

        {/* Heure locale navigateur */}
        <div className={styles.clockBlock}>
          <span
            className={styles.clockTime}
            data-type="local"
            aria-label={`Votre heure : ${localTime}`}
          >
            {localTime}
          </span>
          <span className={styles.clockLabel}>Votre heure</span>
        </div>
      </div>

      {/* ── Col 3 : Créneaux horaires ─────────────────────────────────── */}
      <div className={styles.timelineCol} aria-label="Créneaux horaires UTC">
        {timelineSlots.map((slot, index) => {
          const isLast = index === timelineSlots.length - 1;

          return (
            <div
              key={slot.minutes}
              className={[
                styles.timeSlot,
                slot.isCurrent ? styles.timeSlotCurrent : '',
                isLast        ? styles.timeSlotNext    : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={slot.isCurrent ? 'true' : undefined}
            >
              <span className={styles.slotLabel}>{slot.label}</span>
              {/* Sous-label discret uniquement sur la dernière colonne */}
              {isLast && (
                <span className={styles.nextHourLabel} aria-hidden="true">
                  suivante
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineHeader;