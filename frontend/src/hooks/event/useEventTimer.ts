// =============================================================
// hooks/events/useEventTimer.ts
// Hook principal du timer d'événements GW2
//
// Responsabilités :
//   - Calculer le statut (active / upcoming / idle) de chaque event
//   - Mettre à jour l'état chaque seconde via setInterval
//   - Exposer les utilitaires de formatage (heure locale, countdown)
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import type { GW2Event, EventState, EventStatus, TimelineSlot } from '@/types/events.types';

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

/** Fenêtre "upcoming" : 15 minutes avant le démarrage */
const UPCOMING_THRESHOLD_S = 15 * 60;

/** Nombre de créneaux de 30 minutes dans la timeline (= 3h de fenêtre) */
const TIMELINE_SLOTS_COUNT = 7;

const SECONDS_IN_DAY = 86_400;
const SECONDS_IN_TWO_HOURS = 7_200;

// ─────────────────────────────────────────────────────────────
// Utilitaires de temps
// ─────────────────────────────────────────────────────────────

/** Retourne les secondes écoulées depuis minuit UTC pour une date donnée. */
const utcSecondsSinceMidnight = (date: Date): number =>
  date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds();

/** Retourne les minutes écoulées depuis minuit UTC pour une date donnée. */
const utcMinutesSinceMidnight = (date: Date): number =>
  date.getUTCHours() * 60 + date.getUTCMinutes();

/**
 * Formate une Date en heure locale "HH:MM".
 * Utilise le fuseau horaire du navigateur.
 */
export const formatLocalTime = (date: Date): string =>
  date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

/**
 * Formate une durée en secondes sous la forme "Xm XXs" ou "XXs".
 * Exemple : formatCountdown(95) → "1m 35s"
 */
export const formatCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0s';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
};

// ─────────────────────────────────────────────────────────────
// Calcul du prochain créneau
// ─────────────────────────────────────────────────────────────

interface SlotResult {
  secondsUntilStart: number;
  durationSeconds: number;
  isActive: boolean;
  progressPercent: number;
  secondsRemaining: number;
}

/**
 * Pour un événement GW2 et l'heure courante (secondes UTC depuis minuit),
 * calcule le prochain créneau et le statut courant.
 *
 * Deux modes :
 * - isTwoHourCycle = true  → les slots se répètent chaque 2h
 * - isTwoHourCycle = false → horaires fixes dans la journée
 */
const computeNextSlot = (event: GW2Event, nowSeconds: number): SlotResult => {
  let bestSecondsUntil = SECONDS_IN_DAY + 1;
  let bestDuration = 0;
  let isActive = false;
  let progressPercent = 0;
  let secondsRemaining = 0;

  for (const slot of event.slots) {
    const slotStart = slot.startMinutes * 60;
    const slotDuration = slot.durationMinutes * 60;
    const slotEnd = slotStart + slotDuration;

    // ── L'event est-il en cours ? ───────────────────────────────────────
    if (nowSeconds >= slotStart && nowSeconds < slotEnd) {
      const elapsed = nowSeconds - slotStart;
      isActive = true;
      progressPercent = Math.min(100, (elapsed / slotDuration) * 100);
      secondsRemaining = slotEnd - nowSeconds;
      bestSecondsUntil = 0;
      bestDuration = slotDuration;
      break; // Trouvé — inutile de continuer
    }

    // ── Calcul du temps avant le prochain démarrage ─────────────────────
    let secondsUntil = slotStart - nowSeconds;

    if (secondsUntil < 0) {
      if (event.isTwoHourCycle) {
        // Cycle 2h : trouver la prochaine occurrence dans le cycle courant
        const positionInCycle = nowSeconds % SECONDS_IN_TWO_HOURS;
        const slotInCycle = slotStart % SECONDS_IN_TWO_HOURS;
        secondsUntil = slotInCycle - positionInCycle;
        if (secondsUntil <= 0) secondsUntil += SECONDS_IN_TWO_HOURS;
      } else {
        // Horaires fixes : prochaine occurrence demain (jour suivant)
        secondsUntil += SECONDS_IN_DAY;
      }
    }

    if (secondsUntil < bestSecondsUntil) {
      bestSecondsUntil = secondsUntil;
      bestDuration = slotDuration;
    }
  }

  return {
    secondsUntilStart: Math.max(0, bestSecondsUntil),
    durationSeconds: bestDuration,
    isActive,
    progressPercent,
    secondsRemaining,
  };
};

/** Détermine le statut affiché selon le temps restant. */
const resolveStatus = (isActive: boolean, secondsUntil: number): EventStatus => {
  if (isActive) return 'active';
  if (secondsUntil <= UPCOMING_THRESHOLD_S) return 'upcoming';
  return 'idle';
};

// ─────────────────────────────────────────────────────────────
// Hook useEventTimer
// ─────────────────────────────────────────────────────────────

/**
 * Calcule et met à jour chaque seconde l'état de la liste d'événements fournie.
 *
 * @param events - Liste des GW2Event à surveiller
 * @returns Tableau d'EventState mis à jour en temps réel
 */
export const useEventTimer = (events: GW2Event[]): EventState[] => {
  const compute = useCallback(
    (now: Date): EventState[] =>
      events.map((event) => {
        const nowSec = utcSecondsSinceMidnight(now);
        const result = computeNextSlot(event, nowSec);
        const status = resolveStatus(result.isActive, result.secondsUntilStart);
        // Construire la Date locale du prochain démarrage
        const nextStartLocal = new Date(now.getTime() + result.secondsUntilStart * 1000);

        return {
          event,
          status,
          nextStartLocal,
          secondsUntilStart: result.secondsUntilStart,
          progressPercent: result.progressPercent,
          secondsRemaining: result.secondsRemaining,
        };
      }),
    [events],
  );

  // Initialisation synchrone pour éviter un flash vide au premier rendu
  const [states, setStates] = useState<EventState[]>(() => compute(new Date()));

  useEffect(() => {
    // Recalcul immédiat si la liste d'events change
    setStates(compute(new Date()));

    const interval = setInterval(() => {
      setStates(compute(new Date()));
    }, 1_000);

    return () => clearInterval(interval);
  }, [compute]);

  return states;
};

// ─────────────────────────────────────────────────────────────
// Hook useServerClock
// ─────────────────────────────────────────────────────────────

/**
 * Retourne l'heure serveur GW2 (UTC) et l'heure locale,
 * mises à jour chaque seconde.
 *
 * Affiché dans le TimelineHeader, réplique l'UI du Bus Magique.
 */
export const useServerClock = (): { utcTime: string; localTime: string } => {
  const snapshot = () => {
    const now = new Date();
    return {
      utcTime: `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`,
      localTime: formatLocalTime(now),
    };
  };

  const [times, setTimes] = useState(snapshot);

  useEffect(() => {
    const interval = setInterval(() => setTimes(snapshot()), 1_000);
    return () => clearInterval(interval);
  }, []);

  return times;
};

// ─────────────────────────────────────────────────────────────
// Hook useTimeline
// ─────────────────────────────────────────────────────────────

/**
 * Génère les créneaux horaires affichés dans l'en-tête de la timeline.
 * Couvre une fenêtre de ~3h à partir de l'heure UTC courante.
 * Mis à jour toutes les 30 secondes.
 */
export const useTimeline = (): TimelineSlot[] => {
  const buildSlots = useCallback((): TimelineSlot[] => {
    const now = new Date();
    const currentMinutes = utcMinutesSinceMidnight(now);
    // Arrondir au début de la demi-heure courante
    const startMinutes = Math.floor(currentMinutes / 30) * 30;

    return Array.from({ length: TIMELINE_SLOTS_COUNT }, (_, i) => {
      const totalMinutes = (startMinutes + i * 30) % 1440;
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return {
        label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        minutes: totalMinutes,
        isCurrent: i === 0, // Le premier créneau = heure courante
      };
    });
  }, []);

  const [slots, setSlots] = useState<TimelineSlot[]>(buildSlots);

  useEffect(() => {
    const interval = setInterval(() => setSlots(buildSlots()), 30_000);
    return () => clearInterval(interval);
  }, [buildSlots]);

  return slots;
};