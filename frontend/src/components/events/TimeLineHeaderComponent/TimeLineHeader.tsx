// =============================================================
// components/events/TimelineHeaderComponent/TimelineHeader.tsx
// En-tête sticky de la timeline
//
// Affiche (en 3 colonnes, alignées sur EventRow) :
//   col 1 — label "Événement"
//   col 2 — horloges UTC (heure serveur) et locale
//   col 3 — créneaux horaires toutes les 30 min
//
// Réplique fidèle de l'UI du Bus Magique (lebusmagique.fr).
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
      {/* ── Col 1 : Titre ────────────────────────────────────────────── */}
      <div className={styles.infoCol}>
        <span className={styles.colLabel}>Événement</span>
      </div>

      {/* ── Col 2 : Horloges ─────────────────────────────────────────── */}
      <div className={styles.clockCol} aria-label="Horloges">
        {/* Heure serveur GW2 = UTC */}
        <div className={styles.clockBlock}>
          <span className={styles.clockTime} data-type="utc" aria-label="Heure serveur">
            {utcTime}
          </span>
          <span className={styles.clockLabel}>Heure serveur</span>
        </div>

        {/* Heure locale du navigateur */}
        <div className={styles.clockBlock}>
          <span className={styles.clockTime} data-type="local" aria-label="Votre heure">
            {localTime}
          </span>
          <span className={styles.clockLabel}>Votre heure</span>
        </div>
      </div>

      {/* ── Col 3 : Créneaux horaires ─────────────────────────────────── */}
      <div className={styles.timelineCol} role="row" aria-label="Créneaux horaires">
        {timelineSlots.map((slot) => (
          <div
            key={slot.minutes}
            className={`${styles.timeSlot} ${slot.isCurrent ? styles.timeSlotCurrent : ''}`}
            aria-current={slot.isCurrent ? 'true' : undefined}
          >
            <span className={styles.slotLabel}>{slot.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;