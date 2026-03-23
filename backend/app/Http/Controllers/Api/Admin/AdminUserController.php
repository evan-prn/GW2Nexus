<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BanUserRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use App\Services\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Contrôleur de gestion des utilisateurs pour le back-office.
 *
 * Toutes les routes de ce contrôleur sont protégées par :
 *   - middleware auth:sanctum  (hérité du groupe parent dans api.php)
 *   - middleware ban.check     (hérité du groupe parent dans api.php)
 *   - middleware admin         (vérifie role === 'admin')
 *
 * Routes enregistrées dans api.php :
 *   GET    /api/v1/admin/users            → index()
 *   GET    /api/v1/admin/users/{user}     → show()
 *   POST   /api/v1/admin/users/{user}/ban → ban()
 *   DELETE /api/v1/admin/users/{user}/ban → unban()
 *   GET    /api/v1/admin/stats            → stats()
 */
class AdminUserController extends Controller
{
    public function __construct(
        private readonly AdminUserService $userService
    ) {}

    /**
     * GET /api/v1/admin/users
     *
     * Liste paginée des utilisateurs avec filtres de recherche.
     *
     * @queryParam search   string  Recherche par nom, email ou pseudo GW2
     * @queryParam role     string  Filtre par rôle (user|moderateur|admin)
     * @queryParam status   string  Filtre par statut (active|banned|deleted)
     * @queryParam per_page int     Nombre d'éléments par page (max: 100, défaut: 20)
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $users = $this->userService->paginate($request->only([
            'search', 'role', 'status', 'per_page',
        ]));

        return AdminUserResource::collection($users);
    }

    /**
     * GET /api/v1/admin/users/{user}
     *
     * Détail complet d'un utilisateur avec son historique de bans.
     */
    public function show(User $user): JsonResponse
    {
        $user->loadMissing(['bans.bannedBy', 'bans.liftedBy', 'activeBan']);

        return response()->json([
            'user' => new AdminUserResource($user),
        ]);
    }

    /**
     * POST /api/v1/admin/users/{user}/ban
     *
     * Applique une sanction à un utilisateur.
     * Révoque tous ses tokens Sanctum côté backend (déconnexion immédiate).
     */
    public function ban(BanUserRequest $request, User $user): JsonResponse
    {
        try {
            $ban = $this->userService->ban(
                target: $user,
                admin:  $request->user(),
                data:   $request->validated(),
            );
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Utilisateur banni avec succès.',
            'ban'     => [
                'id'         => $ban->id,
                'type'       => $ban->type,
                'reason'     => $ban->reason,
                'expires_at' => $ban->expires_at?->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * DELETE /api/v1/admin/users/{user}/ban
     *
     * Lève le ban actif d'un utilisateur.
     */
    public function unban(Request $request, User $user): JsonResponse
    {
        try {
            $this->userService->unban(target: $user, admin: $request->user());
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Ban levé avec succès.',
        ]);
    }

    /**
     * GET /api/v1/admin/stats
     *
     * Statistiques globales de la plateforme.
     * Accessible aux administrateurs et modérateurs.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'stats' => $this->userService->stats(),
        ]);
    }
}