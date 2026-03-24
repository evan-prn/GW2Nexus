<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Gère l'upload et le remplacement de l'avatar utilisateur.
 *
 * Route protégée par auth:sanctum — l'utilisateur doit être authentifié.
 * Le fichier est stocké dans storage/app/public/avatars/ et accessible
 * via le lien symbolique /storage/ créé par php artisan storage:link.
 */
class AvatarController extends Controller
{
    /**
     * Upload et enregistrement du nouvel avatar.
     *
     * Séquence :
     *   1. Validation du fichier (image, formats acceptés, taille max 2 Mo)
     *   2. Suppression de l'ancien avatar local s'il existe
     *   3. Stockage du nouveau fichier dans public/avatars/
     *   4. Génération de l'URL publique accessible via /storage/
     *   5. Persistance de l'URL sur le modèle User en base
     *
     * POST /api/v1/profile/avatar
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Supprime l'ancien avatar s'il est hébergé localement
        // Les avatars externes (URL tierces) ne sont pas supprimés
        if ($user->avatar && str_contains($user->avatar, '/storage/avatars/')) {
            $ancienChemin = str_replace('/storage/', 'public/', $user->avatar);
            Storage::delete($ancienChemin);
        }

        // Stocke le nouveau fichier dans storage/app/public/avatars/
        $chemin = $request->file('avatar')->store('public/avatars');

        // Convertit le chemin de stockage en URL publique accessible par le navigateur
        $url = '/storage/' . str_replace('public/', '', $chemin);

        // Persiste l'URL sur le modèle User — correction Sprint 2
        // Sans cette ligne, l'avatar serait retourné au frontend mais jamais sauvegardé
        $user->update(['avatar' => $url]);

        return response()->json(['avatar_url' => $url]);
    }
}