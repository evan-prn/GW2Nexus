<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory de génération de données fictives pour le modèle User.
 *
 * Utilisée exclusivement dans les tests et les seeders de développement.
 * Les noms des colonnes doivent correspondre exactement à la migration users.
 *
 * @extends Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Mot de passe par défaut partagé entre toutes les instances générées,
     * pour éviter de recalculer le hash bcrypt à chaque appel.
     */
    protected static ?string $password = null;

    /**
     * Définit l'état par défaut d'un utilisateur généré.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Colonne 'nom' — correspond exactement à la migration (pas 'name')
            'nom'               => fake()->name(),

            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),

            // Hash calculé une seule fois et réutilisé pour tous les appels
            'password'          => static::$password ??= Hash::make('password'),

            'pseudo_gw2'        => null,
            'avatar'            => null,
            'role'              => 'user',
            'api_key'           => null,
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * État : email non vérifié.
     *
     * Utilisé pour tester les flux nécessitant une vérification d'email.
     */
    public function nonVerifie(): static
    {
        return $this->state(fn (array $attributs) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * État : administrateur.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributs) => [
            'role' => 'admin',
        ]);
    }

    /**
     * État : modérateur.
     */
    public function moderateur(): static
    {
        return $this->state(fn (array $attributs) => [
            'role' => 'moderateur',
        ]);
    }

    /**
     * État : utilisateur avec une clé API GW2 configurée.
     */
    public function avecApiKey(): static
    {
        return $this->state(fn (array $attributs) => [
            // Format réel d'une clé API GW2 : 72 caractères
            'api_key' => Str::random(72),
        ]);
    }
}