// src/api/events.api.ts
// ---------------------------------------------------------------------------
// Service API — Événements GW2
//
// Responsabilité unique : communiquer avec les endpoints /api/v1/events/*
// et l'API officielle GW2 pour les données de compte.
// Aucune logique métier ici — uniquement des appels HTTP via httpClient.
//
// Sprint 2 : fetchSchedule() retourne l'heure serveur UTC (endpoint stub).
// Sprint 4 : fetchSchedule() retournera les horaires dynamiques depuis
//            le cache Redis (synchronisé par Gw2ApiService côté Laravel).
//
// Utilisé par :
//   hooks/event/useEventTimer.ts      — synchronisation horloge UTC
//   hooks/event/useWorldBossStatus.ts — statut "tué aujourd'hui"
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
 * Récupère l'heure serveur UTC depuis le backend GW2Nexus.
 *
 * Endpoint public — pas d'authentification requise.
 * La réponse est utilisée pour synchroniser l'horloge du timer côté client
 * et corriger un éventuel décalage UTC du navigateur.
 *
 * @returns La réponse du backend avec l'heure serveur UTC
 */
export const fetchSchedule = async (): Promise<ScheduleResponse> => {
  const response = await httpClient.get<ScheduleResponse>(ENDPOINTS.events.schedule);
  return response.data;
};

/**
 * Récupère les world bosses Core Tyria déjà tués aujourd'hui
 * depuis l'API officielle Guild Wars 2.
 *
 * Endpoint authentifié — nécessite une clé API avec le scope "progression".
 * Le token Bearer est injecté automatiquement par httpClient via localStorage.
 *
 * Utilisé sur la page EventDetailPage pour afficher le statut
 * "déjà tué aujourd'hui" sur les world bosses Core Tyria uniquement.
 *
 * @returns Un tableau d'IDs GW2 (ex: ["tequatl_the_sunless", "shadow_behemoth"])
 */
export const fetchWorldBossStatus = async (): Promise<string[]> => {
  const response = await httpClient.get<string[]>(ENDPOINTS.gw2.accountWorldBosses);
  return response.data;
};