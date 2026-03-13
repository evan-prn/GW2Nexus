<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\MeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes d'authentification — API v1
|--------------------------------------------------------------------------
|
| Toutes les routes sont préfixées par /api/v1 (défini dans bootstrap/app.php
| ou RouteServiceProvider selon la version de Laravel).
|
| Routes publiques  : accessibles sans token
| Routes protégées  : nécessitent un token Sanctum valide (middleware auth:sanctum)
|
*/

Route::prefix('v1')->group(function (): void {

    /*
    |----------------------------------------------------------------------
    | Routes publiques — authentification
    |----------------------------------------------------------------------
    */
    Route::prefix('auth')->name('auth.')->group(function (): void {

        // POST /api/v1/auth/register — Création de compte
        Route::post('register', [RegisterController::class, 'store'])
            ->name('register');

        // POST /api/v1/auth/login — Connexion
        Route::post('login', [LoginController::class, 'store'])
            ->name('login');

        // POST /api/v1/auth/forgot-password — Demande de lien de réinitialisation
        Route::post('forgot-password', [ForgotPasswordController::class, 'store'])
            ->name('password.forgot')
            ->middleware('throttle:3,1'); // 3 demandes max par minute (protection spam mail)

        // POST /api/v1/auth/reset-password — Réinitialisation effective du mot de passe
        Route::post('reset-password', [ResetPasswordController::class, 'store'])
            ->name('password.reset');
    });

    /*
    |----------------------------------------------------------------------
    | Routes protégées — token Sanctum obligatoire
    |----------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function (): void {

        // POST /api/v1/auth/logout — Déconnexion (session courante)
        Route::post('auth/logout', [LogoutController::class, 'destroy'])
            ->name('auth.logout');

        // POST /api/v1/auth/logout-all — Déconnexion globale (tous les appareils)
        Route::post('auth/logout-all', [LogoutController::class, 'destroyAll'])
            ->name('auth.logout-all');
        
        // GET /api/v1/auth/me — Récupère les infos de l'utilisateur connecté
        Route::get('auth/me', MeController::class)->name('auth.me');

        /*
        |------------------------------------------------------------------
        | Point d'extension — les futures features s'ajoutent ici
        | Exemple :
        |   Route::apiResource('profile', UserProfileController::class);
        |   Route::apiResource('discussions', DiscussionController::class);
        |------------------------------------------------------------------
        */
    });
});