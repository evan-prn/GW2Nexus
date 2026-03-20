<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateApiKeyRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\ProfilGw2;
use App\Services\Gw2ApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function __construct(private readonly Gw2ApiService $gw2)
    {
    }

    // ─── GET /api/v1/profile ──────────────────────────────────────

    /**
     * Retourne le profil complet de l'utilisateur connecté
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('profilGw2');

        return response()->json([
            'user'      => $this->formatUser($user),
            'profil_gw2'=> $user->profilGw2,
        ]);
    }

    // ─── PUT /api/v1/profile ──────────────────────────────────────

    /**
     * Met à jour les informations de base du profil utilisateur
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Profil mis à jour.',
            'user'    => $this->formatUser($user->fresh()),
        ]);
    }

    // ─── POST /api/v1/profile/api-key ────────────────────────────

    /**
     * Valide et enregistre la clé API GW2 de l'utilisateur
     * 1. Valide le format (72 car.)
     * 2. Appelle /v2/tokeninfo pour vérifier la clé
     * 3. Récupère les données du compte et met à jour profils_gw2
     */
    public function updateApiKey(UpdateApiKeyRequest $request): JsonResponse
    {
        $user = $request->user();
        $cle  = $request->input('api_key');

        // Invalide le cache de l'ancienne clé si elle existe
        if ($user->api_key) {
            $this->gw2->invaliderCache($user->api_key);
        }

        // Validation via l'API GW2
        $tokenInfo = $this->gw2->validerCle($cle);

        if (! $tokenInfo) {
            return response()->json([
                'message' => 'Clé API GW2 invalide ou expirée.',
            ], 422);
        }

        // Sauvegarde la clé chiffrée
        $user->update(['api_key' => $cle]);

        // Récupère et met à jour les données du compte GW2
        $compte = $this->gw2->getCompte($cle);

        $profilData = [
            'valide'           => true,
            'derniere_synchro' => now(),
            'nom_compte'       => $compte['name']  ?? null,
            'monde'            => $compte['world']  ?? null,
        ];

        $profil = ProfilGw2::updateOrCreate(
            ['user_id' => $user->id],
            $profilData
        );

        return response()->json([
            'message'    => 'Clé API GW2 validée et enregistrée.',
            'profil_gw2' => $profil,
        ]);
    }

    // ─── DELETE /api/v1/profile/api-key ──────────────────────────

    /**
     * Supprime la clé API GW2 de l'utilisateur
     */
    public function deleteApiKey(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->api_key) {
            $this->gw2->invaliderCache($user->api_key);
        }

        $user->update(['api_key' => null]);

        // Marque le profil comme invalide
        $user->profilGw2?->update([
            'valide'     => false,
            'nom_compte' => null,
            'monde'      => null,
        ]);

        return response()->json([
            'message' => 'Clé API GW2 supprimée.',
        ]);
    }

    // ─── GET /api/v1/profile/gw2-data ────────────────────────────

    /**
     * Retourne les données GW2 fraîches depuis l'API (avec cache)
     */
    public function gw2Data(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->api_key) {
            return response()->json([
                'message' => 'Aucune clé API GW2 enregistrée.',
            ], 404);
        }

        $compte      = $this->gw2->getCompte($user->api_key);
        $personnages = $this->gw2->getPersonnages($user->api_key);

        if (! $compte) {
            return response()->json([
                'message' => 'Impossible de récupérer les données GW2. Clé invalide ou API indisponible.',
            ], 503);
        }

        return response()->json([
            'compte'      => $compte,
            'personnages' => $personnages ?? [],
        ]);
    }

    // ─── Helper ───────────────────────────────────────────────────

    private function formatUser($user): array
    {
        return [
            'id'          => $user->id,
            'nom'         => $user->nom,
            'email'       => $user->email,
            'pseudo_gw2'  => $user->pseudo_gw2,
            'avatar'      => $user->avatar,
            'role'        => $user->role,
            'has_api_key' => ! is_null($user->api_key),
        ];
    }
}