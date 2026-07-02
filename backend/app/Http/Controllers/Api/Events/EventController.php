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
        $path = resource_path('data/events_schedule.json');
        $groups = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);

        return response()->json([
            'data' => $groups,
            'meta' => [
                'server_time_utc' => now()->utc()->toISOString(),
                'version'         => 'v1',
                'source'          => 'frontend/static-events',
                'wiki'            => 'https://wiki.guildwars2.com/wiki/Event_timers',
            ],
        ]);
    }
}
