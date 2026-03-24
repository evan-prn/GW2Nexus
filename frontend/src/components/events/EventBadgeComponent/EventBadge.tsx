// =============================================================
// components/events/EventBadgeComponent/EventBadge.tsx
// Badge de statut d'un événement GW2
//
// Trois états visuels :
//   - active   → "EN COURS" + barre de progression dorée
//   - upcoming → point clignotant + countdown "Xm XXs"
//   - idle     → heure locale du prochain démarrage
// =============================================================

import React from 'react';
import type { EventStatus } from '@/types/events.types';
import { formatCountdown, formatLocalTime } from '@/hooks/event/useEventTimer';
import styles from './EventBadge.module.css';

interface EventBadgeProps {
  status: EventStatus;
  secondsUntilStart: number;
  nextStartLocal: Date;
  progressPercent: number;
  secondsRemaining: number;
}

const EventBadge: React.FC<EventBadgeProps> = ({
  status,
  secondsUntilStart,
  nextStartLocal,
  progressPercent,
  secondsRemaining,
}) => {
  // ── Actif ────────────────────────────────────────────────────────────
  if (status === 'active') {
    return (
      <div className={styles.badge} data-status="active">
        <span className={styles.activeLabel}>EN COURS</span>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression de l'événement"
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.timeRemaining}>
          {formatCountdown(secondsRemaining)}
        </span>
      </div>
    );
  }

  // ── Upcoming ─────────────────────────────────────────────────────────
  if (status === 'upcoming') {
    return (
      <div className={styles.badge} data-status="upcoming">
        <span className={styles.upcomingDot} aria-hidden="true" />
        <span className={styles.countdown}>
          {formatCountdown(secondsUntilStart)}
        </span>
      </div>
    );
  }

  // ── Idle : heure locale ───────────────────────────────────────────────
  return (
    <div className={styles.badge} data-status="idle">
      <span className={styles.nextTime}>{formatLocalTime(nextStartLocal)}</span>
    </div>
  );
};

export default EventBadge;