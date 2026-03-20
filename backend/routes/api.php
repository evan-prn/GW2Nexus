<?php

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Contact\ContactController;
use App\Http\Controllers\Api\Profile\UserProfileController;
use Illuminate\Support\Facades\Route;

// GET /api/health — point de santé pour le healthcheck Docker
Route::get('/health', fn() => response()->json(['status-backend' => 'ok']));

/*
|--------------------------------------------------------------------------
| Routes API v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function (): void {

    /*
    |----------------------------------------------------------------------
    | Routes publiques — authentification
    |----------------------------------------------------------------------
    */
    Route::prefix('auth')->name('auth.')->group(function (): void {

        // POST /api/v1/auth/register
        Route::post('register', [RegisterController::class, 'store'])
            ->name('register');

        // POST /api/v1/auth/login
        Route::post('login', [LoginController::class, 'store'])
            ->name('login');

        // POST /api/v1/auth/forgot-password
        Route::post('forgot-password', [ForgotPasswordController::class, 'store'])
            ->name('password.forgot')
            ->middleware('throttle:3,1');

        // POST /api/v1/auth/reset-password
        Route::post('reset-password', [ResetPasswordController::class, 'store'])
            ->name('password.reset');
    });

    /*
    |----------------------------------------------------------------------
    | Routes publiques — hors authentification
    |----------------------------------------------------------------------
    */

    // POST /api/v1/contact — Envoi d'un message de contact
    Route::post('contact', [ContactController::class, 'send'])
        ->name('contact.send')
        ->middleware('throttle:3,10'); // 3 messages max par tranche de 10 minutes

    /*
    |----------------------------------------------------------------------
    | Routes protégées — token Sanctum obligatoire
    |----------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function (): void {

        // POST /api/v1/auth/logout
        Route::post('auth/logout', [LogoutController::class, 'destroy'])
            ->name('auth.logout');

        // POST /api/v1/auth/logout-all
        Route::post('auth/logout-all', [LogoutController::class, 'destroyAll'])
            ->name('auth.logout-all');

        // GET /api/v1/auth/me
        Route::get('auth/me', MeController::class)
            ->name('auth.me');

        
        /*
        |--------------------------------------------------------------------------
        | Profile utilisateur
        |--------------------------------------------------------------------------
        */
        Route::prefix('profile')->name('profile.')->group(function (): void {
        
            // GET    /api/v1/profile          — données profil complet
            Route::get('/', [UserProfileController::class, 'show'])
                ->name('show');
        
            // PUT    /api/v1/profile          — mise à jour infos de base (nom, pseudo_gw2, avatar)
            Route::put('/', [UserProfileController::class, 'update'])
                ->name('update');
        
            // POST   /api/v1/profile/api-key  — valider + enregistrer clé API GW2
            Route::post('api-key', [UserProfileController::class, 'updateApiKey'])
                ->name('api-key.update');
        
            // DELETE /api/v1/profile/api-key  — supprimer la clé API GW2
            Route::delete('api-key', [UserProfileController::class, 'deleteApiKey'])
                ->name('api-key.delete');
        
            // GET    /api/v1/profile/gw2-data — données GW2 fraîches (compte + personnages)
            Route::get('gw2-data', [UserProfileController::class, 'gw2Data'])
                ->name('gw2-data');
        });
    });
});