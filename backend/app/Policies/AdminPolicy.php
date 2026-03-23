<?php

namespace App\Policies;

use App\Models\User;

/**
 * Policy d'accès au back-office administrateur.
 *
 * Centralise les règles d'autorisation pour les actions admin,
 * conformément au principe Separation of Concerns.
 *
 * Enregistrement dans AuthServiceProvider (ou AppServiceProvider) :
 *   Gate::policy(User::class, AdminPolicy::class);
 *
 * Utilisation dans les contrôleurs :
 *   $this->authorize('manageUsers', $request->user());
 */
class AdminPolicy
{
    /**
     * Seuls les administrateurs peuvent accéder au back-office.
     * Les super-admins contournent automatiquement via `before()`.
     */
    public function before(User $user): ?bool
    {
        // Un admin a accès à tout — court-circuite les autres méthodes
        if ($user->isAdmin()) {
            return true;
        }

        return null; // laisse passer aux méthodes spécifiques
    }

    /** Lister et rechercher les utilisateurs */
    public function manageUsers(User $user): bool
    {
        return $user->isModerator();
    }

    /** Appliquer ou lever un ban */
    public function banUsers(User $user): bool
    {
        return $user->isAdmin();
    }

    /** CRUD des catégories de forum */
    public function manageCategories(User $user): bool
    {
        return $user->isAdmin();
    }

    /** Consulter les statistiques globales */
    public function viewStats(User $user): bool
    {
        return $user->isModerator();
    }
}
