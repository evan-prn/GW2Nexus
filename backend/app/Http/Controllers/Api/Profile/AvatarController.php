<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AvatarController extends Controller
{
    /**
     * POST /api/v1/profile/avatar
     * Upload d'un fichier image comme avatar utilisateur.
     * Stocké dans storage/app/public/avatars/
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Supprime l'ancien avatar s'il est stocké localement
        if ($user->avatar && str_contains($user->avatar, '/storage/avatars/')) {
            $ancienChemin = str_replace('/storage/', 'public/', $user->avatar);
            Storage::delete($ancienChemin);
        }

        // Stocke le nouveau fichier
        $chemin = $request->file('avatar')->store('public/avatars');

        // Génère l'URL publique
        $url = '/storage/' . str_replace('public/', '', $chemin);

        return response()->json(['avatar_url' => $url]);
    }
}