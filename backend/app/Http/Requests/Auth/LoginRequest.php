<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Requête de validation pour la connexion d'un utilisateur.
 *
 * Intègre le rate limiting natif de Laravel afin de limiter les tentatives
 * de connexion par brute-force : 5 essais maximum par minute par couple
 * (email + adresse IP).
 */
class LoginRequest extends FormRequest
{
    /**
     * Tout visiteur peut tenter de se connecter.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour les champs de connexion.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required'    => 'L\'adresse email est obligatoire.',
            'email.email'       => 'L\'adresse email fournie n\'est pas valide.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ];
    }

    /**
     * Vérifie que le rate limiter n'est pas dépassé avant toute tentative
     * d'authentification.
     *
     * Lève une ValidationException si la limite est atteinte, ce qui
     * déclenche automatiquement l'event Lockout pour les listeners éventuels
     * (logs, notifications, etc.).
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            // Déclenche l'event Lockout (utile pour les logs ou notifications futures)
            event(new Lockout($this));

            $secondsRestants = RateLimiter::availableIn($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __(
                    'Trop de tentatives de connexion. Veuillez réessayer dans :seconds secondes.',
                    ['seconds' => $secondsRestants]
                ),
            ]);
        }
    }

    /**
     * Incrémente le compteur du rate limiter après une tentative échouée.
     * Doit être appelé explicitement par le contrôleur en cas d'échec.
     */
    public function incrementRateLimiter(): void
    {
        RateLimiter::hit($this->throttleKey(), 60);
    }

    /**
     * Remet le compteur à zéro après une connexion réussie.
     * Doit être appelé explicitement par le contrôleur en cas de succès.
     */
    public function clearRateLimiter(): void
    {
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Génère une clé unique pour le rate limiter.
     *
     * La clé est composée de l'email normalisé et de l'adresse IP du visiteur,
     * ce qui permet de bloquer un attaquant même s'il change d'email cible.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(
            Str::lower($this->string('email')) . '|' . $this->ip()
        );
    }
}