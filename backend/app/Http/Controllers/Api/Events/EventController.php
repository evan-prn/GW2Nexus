<?php

namespace App\Http\Controllers\Api\Events;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * EventController
 *
 * Contrôleur pour les endpoints liés aux événements GW2.
 *
 * Sprint 2 (actuel) : endpoint de santé uniquement.
 * Sprint 4 : ce contrôleur sera enrichi avec :
 *   - Synchronisation du cache GW2 API (/v2/events)
 *   - Retour des horaires dynamiques depuis la BDD
 *   - Mise en cache Redis des appels API GW2
 *
 * Pour l'instant, le frontend utilise les horaires statiques
 * définis dans src/data/events.data.ts — les timings GW2 sont
 * fixes et bien documentés, un backend n'est pas nécessaire
 * pour le timer de base.
 */
class EventController extends Controller
{
    /**
     * Retourne la liste des groupes d'événements avec leurs horaires.
     *
     * Sprint 2 : retourne les données statiques (même contenu que le frontend).
     * Sprint 4 : sera remplacé par un appel à Gw2ApiService + cache Redis.
     *
     * GET /api/v1/events/schedule
     */
    public function schedule(): JsonResponse
    {
        // Pour l'instant : réponse statique couvrant les zones principales.
        // À Sprint 4, ces données viendront de la BDD (table items_gw2 + cache).
        return response()->json([
            'data' => [
                'message' => 'Endpoint disponible en Sprint 4.',
                'note'    => 'Le timer frontend utilise les horaires statiques (events.data.ts).',
                'wiki'    => 'https://wiki.guildwars2.com/wiki/Event_timers',
            ],
            'meta' => [
                'server_time_utc' => now()->utc()->toISOString(),
                'version'         => 'v1',
            ],
        ]);
    }
}