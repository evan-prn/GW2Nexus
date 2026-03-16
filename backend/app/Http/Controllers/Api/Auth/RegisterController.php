<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * Gère l'inscription de nouveaux utilisateurs.
 *
 * Responsabilité unique : créer le compte utilisateur et retourner
 * un token Sanctum valide permettant une connexion immédiate après inscription.
 */
class RegisterController extends Controller
{
    /**
     * Enregistre un nouvel utilisateur et retourne son token d'authentification.
     *
     * L'opération est encapsulée dans une transaction pour garantir la cohérence :
     * si la génération du token échoue, l'utilisateur n'est pas créé non plus.
     *
     * @throws Throwable
     */
    public function store(RegisterRequest $request): JsonResponse
    {
        $user = DB::transaction(function () use ($request): User {
            return User::create([
                'nom'      => $request->string('nom')->trim()->value(),
                'email'    => $request->string('email')->lower()->value(),
                'password' => $request->string('password')->value(),
                // Le hash bcrypt est appliqué automatiquement via le cast 'hashed' du modèle
            ]);
        });

        // refresh() force le rechargement depuis la base de données,
        // ce qui garantit que les colonnes avec valeur par défaut MySQL
        // (comme 'role' => 'user') sont bien présentes dans l'instance.
        $user->refresh();

        // Génération du token Sanctum — nommé pour identifier l'appareil/contexte
        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès. Bienvenue sur GW2Nexus !',
            'user'    => new UserResource($user),
            'token'   => $token,
        ], 201);
    }
}