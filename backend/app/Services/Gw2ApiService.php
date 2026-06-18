<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Gw2ApiService
{
    private const CACHE_TTL = 300;
    private const TOKEN_TTL = 60;

    private readonly string $baseUrl;
    private readonly int $timeout;

    public function __construct(private readonly string $apiKey = '')
    {
        $this->baseUrl = config('services.gw2.base_url', 'https://api.guildwars2.com/v2');
        $this->timeout = (int) config('services.gw2.timeout', 10);
    }

    public function validerCle(string $cle): ?array
    {
        $cacheKey = 'gw2.tokeninfo.' . hash('sha256', $cle);
        return Cache::remember($cacheKey, self::TOKEN_TTL, function () use ($cle) {
            try {
                $response = Http::timeout($this->timeout)
                    ->withHeader('Authorization', "Bearer {$cle}")
                    ->get($this->baseUrl . '/tokeninfo');
                return $response->failed() ? null : $response->json();
            } catch (RequestException $e) {
                Log::warning('GW2 tokeninfo : échec', ['message' => $e->getMessage()]);
                return null;
            }
        });
    }

    public function getCompte(string $cle): ?array
    {
        $cacheKey = 'gw2.account.' . hash('sha256', $cle);
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($cle) {
            return $this->requeteAuthentifiee('/account', $cle);
        });
    }

    /**
     * Récupère les personnages avec détails complets via /v2/characters?ids=all
     */
    public function getPersonnages(string $cle): ?array
    {
        $cacheKey = 'gw2.characters.' . hash('sha256', $cle);
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($cle) {
            return $this->requeteAuthentifiee('/characters?ids=all', $cle);
        });
    }

    public function getWorldBossStatus(string $cle): ?array
    {
        $cacheKey = 'gw2.worldbosses.' . hash('sha256', $cle);
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($cle) {
            return $this->requeteAuthentifiee('/account/worldbosses', $cle);
        });
    }

    public function invaliderCache(string $cle): void
    {
        Cache::forget('gw2.tokeninfo.'   . hash('sha256', $cle));
        Cache::forget('gw2.account.'     . hash('sha256', $cle));
        Cache::forget('gw2.characters.'  . hash('sha256', $cle));
        Cache::forget('gw2.worldbosses.' . hash('sha256', $cle));
    }

    private function requeteAuthentifiee(string $endpoint, string $cle): ?array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeader('Authorization', "Bearer {$cle}")
                ->get($this->baseUrl . $endpoint);
            if ($response->failed()) {
                Log::warning("GW2 API {$endpoint} : réponse échouée", ['status' => $response->status()]);
                return null;
            }
            return $response->json();
        } catch (RequestException $e) {
            Log::error("GW2 API {$endpoint} : exception", ['message' => $e->getMessage()]);
            return null;
        }
    }
}