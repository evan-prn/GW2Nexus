<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserBan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Service métier pour la gestion des utilisateurs depuis le back-office.
 *
 * Centralise toute la logique métier admin dans un service injectable,
 * gardant les contrôleurs légers (SRP, Separation of Concerns).
 */
class AdminUserService
{
    /**
     * Liste paginée des utilisateurs avec recherche et filtres.
     *
     * @param  array{search?: string, role?: string, status?: string, per_page?: int}  $filters
     */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = User::withTrashed()
            ->with(['activeBan'])
            ->orderByDesc('created_at');

        // Filtre de recherche — nom, email ou pseudo GW2
        if (! empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search): void {
                $q->where('nom', 'like', $search)
                    ->orWhere('email', 'like', $search)
                    ->orWhere('pseudo_gw2', 'like', $search);
            });
        }

        // Filtre par rôle
        if (! empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        // Filtre par statut
        if (! empty($filters['status'])) {
            match ($filters['status']) {
                'banned'  => $query->whereHas('bans', fn ($q) => $q->active()),
                'deleted' => $query->whereNotNull('deleted_at'),
                'active'  => $query->whereNull('deleted_at')
                    ->whereDoesntHave('bans', fn ($q) => $q->active()),
                default   => null,
            };
        }

        $perPage = min((int) ($filters['per_page'] ?? 20), 100);

        return $query->paginate($perPage);
    }

    /**
     * Applique un ban à un utilisateur.
     *
     * @param  array{type: string, reason: string, expires_at?: string|null}  $data
     *
     * @throws \InvalidArgumentException Si on tente de bannir un admin
     */
    public function ban(User $target, User $admin, array $data): UserBan
    {
        // Empêche de bannir un autre administrateur
        if ($target->isAdmin()) {
            throw new \InvalidArgumentException('Impossible de bannir un administrateur.');
        }

        // Empêche l'auto-ban
        if ($target->id === $admin->id) {
            throw new \InvalidArgumentException('Impossible de se bannir soi-même.');
        }

        return DB::transaction(function () use ($target, $admin, $data): UserBan {
            // Lève les bans actifs précédents avant d'en appliquer un nouveau
            $target->bans()->active()->update([
                'lifted_at' => now(),
                'lifted_by' => $admin->id,
            ]);

            // Révoque tous les tokens Sanctum — déconnexion immédiate
            $target->tokens()->delete();

            return UserBan::create([
                'user_id'    => $target->id,
                'banned_by'  => $admin->id,
                'type'       => $data['type'],
                'reason'     => $data['reason'],
                'expires_at' => $data['type'] === 'permanent' ? null : ($data['expires_at'] ?? null),
            ]);
        });
    }

    /**
     * Lève le ban actif d'un utilisateur.
     *
     * @throws \RuntimeException Si l'utilisateur n'a pas de ban actif
     */
    public function unban(User $target, User $admin): UserBan
    {
        $activeBan = $target->bans()->active()->latest()->first();

        if ($activeBan === null) {
            throw new \RuntimeException("L'utilisateur n'a pas de ban actif.");
        }

        $activeBan->update([
            'lifted_at' => now(),
            'lifted_by' => $admin->id,
        ]);

        return $activeBan->fresh();
    }

    /**
     * Statistiques globales pour le tableau de bord admin.
     *
     * @return array<string, int>
     */
    public function stats(): array
    {
        return [
            'total_users'   => User::count(),
            'active_users'  => User::whereNull('deleted_at')
                ->whereDoesntHave('bans', fn ($q) => $q->active())
                ->count(),
            'banned_users'  => UserBan::active()->distinct('user_id')->count('user_id'),
            'deleted_users' => User::onlyTrashed()->count(),
            'admins'        => User::where('role', 'admin')->count(),
            'moderateurs'   => User::where('role', 'moderateur')->count(),
        ];
    }
}
