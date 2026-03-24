// src/api/events.api.ts

// ---------------------------------------------------------------------------
// Service API — Événements GW2
//
// Responsabilité unique : communiquer avec les endpoints /api/v1/events/*.
// Aucune logique métier ici — uniquement des appels HTTP via httpClient.
//
// Sprint 2 : fetchSchedule() retourne l'heure serveur UTC (endpoint stub).
// Sprint 4 : fetchSchedule() retournera les horaires dynamiques depuis
//            le cache Redis (synchronisé par Gw2ApiService côté Laravel).
//
// Utilisé par : hooks/events/useEventTimer.ts (optionnel — le timer
// fonctionne aussi entièrement en statique sans appel réseau).
// ---------------------------------------------------------------------------

import httpClient from './httpClient';
import ENDPOINTS from './endpoint';

// ─── Types de réponse ────────────────────────────────────────────────────────

/**
 * Réponse de GET /api/v1/events/schedule
 *
 * Sprint 2 : contient uniquement l'heure serveur et une note.
 * Sprint 4 : contiendra les groupes d'événements avec leurs créneaux.
 */
export interface ScheduleResponse {
  data: {
    message: string;
    note: string;
    wiki: string;
  };
  meta: {
    /** Heure serveur GW2 (UTC) au moment de la réponse — format ISO 8601 */
    server_time_utc: string;
    version: string;
  };
}

// ─── Appels API ──────────────────────────────────────────────────────────────

/**
 * Récupère les horaires des événements GW2 depuis le backend.
 *
 * Endpoint public — pas d'authentification requise.
 * La réponse est utilisée pour synchroniser l'horloge serveur avec le timer
 * côté client (correction du décalage UTC éventuel du navigateur).
 *
 * @returns La réponse du backend avec l'heure serveur UTC
 */
export const fetchSchedule = async (): Promise<ScheduleResponse> => {
  const response = await httpClient.get<ScheduleResponse>(ENDPOINTS.events.schedule);
  return response.data;
};