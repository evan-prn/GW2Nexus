<?php

use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\MeController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\ResetPasswordController;
use App\Http\Controllers\Api\Contact\ContactController;
use App\Http\Controllers\Api\Profile\AvatarController;
use App\Http\Controllers\Api\Profile\UserProfileController;
use App\Http\Controllers\Api\Events\EventController;
use Illuminate\Support\Facades\Route;

/*
|==========================================================================
| Routes API — GW2Nexus
|==========================================================================
|
| Toutes les routes sont préfixées par /api (défini dans bootstrap/app.php).
|
| Structure :
|   /api/health              — healthcheck Docker (public)
|   /api/v1/auth/*           — authentification (public)
|   /api/v1/contact          — formulaire de contact (public)
|   /api/v1/auth/logout*     — déconnexion (protégé)
|   /api/v1/auth/me          — utilisateur courant (protégé)
|   /api/v1/profile/*        — profil utilisateur (protégé)
|   /api/v1/admin/*          — back-office admin (protégé + rôle admin)
|
*/

// ---------------------------------------------------------------------------
// Healthcheck — utilisé par Docker et les outils de monitoring
// ---------------------------------------------------------------------------
Route::get('/health', static fn() => response()->json(['status-backend' => 'ok']));

// ---------------------------------------------------------------------------
// Routes versionnées — préfixe /api/v1
// ---------------------------------------------------------------------------
Route::prefix('v1')->group(function (): void {

    /*
    |--------------------------------------------------------------------------
    | Routes publiques — Authentification
    |--------------------------------------------------------------------------
    |
    | Aucun token requis. Le rate limiting est géré par Laravel Throttle.
    | Le login est limité dans LoginController via RateLimiter.
    |
    */
    Route::prefix('auth')->name('auth.')->group(function (): void {

        // POST /api/v1/auth/register — Création d'un nouveau compte
        Route::post('register', [RegisterController::class, 'store'])
            ->name('register');

        // POST /api/v1/auth/login — Connexion et émission d'un token Sanctum
        Route::post('login', [LoginController::class, 'store'])
            ->name('login');

        // POST /api/v1/auth/forgot-password — Envoi du lien de réinitialisation
        // Limité à 3 tentatives par minute pour prévenir l'énumération d'emails
        Route::post('forgot-password', [ForgotPasswordController::class, 'store'])
            ->name('password.forgot')
            ->middleware('throttle:3,1');

        // POST /api/v1/auth/reset-password — Réinitialisation via token email
        Route::post('reset-password', [ResetPasswordController::class, 'store'])
            ->name('password.reset');
    });

    /*
    |--------------------------------------------------------------------------
    | Routes publiques — Hors authentification
    |--------------------------------------------------------------------------
    */

    // POST /api/v1/contact — Envoi d'un message de contact
    // Limité à 3 messages par tranche de 10 minutes (anti-spam)
    Route::post('contact', [ContactController::class, 'send'])
        ->name('contact.send')
        ->middleware('throttle:3,10');

    // Point d'extension — futures routes publiques
    Route::prefix('events')->name('events.')->group(function () {

        // GET /api/v1/events/schedule
        // Retourne les horaires des événements GW2.
        // Public — pas d'authentification requise.
        Route::prefix('events')->name('events.')->group(function (): void {
            Route::get('schedule', [EventController::class, 'schedule'])
                ->name('schedule')
                ->middleware('throttle:60,1');
        });

    });

    /*
    |--------------------------------------------------------------------------
    | Routes protégées — Token Sanctum obligatoire
    |--------------------------------------------------------------------------
    |
    | Toutes les routes ci-dessous exigent un header :
    |   Authorization: Bearer <token>
    |
    | Le middleware BanCheck est ajouté globalement ici pour bloquer
    | tout accès aux utilisateurs actuellement bannis.
    |
    */
    Route::middleware(['auth:sanctum', 'ban.check'])->group(function (): void {

        // POST /api/v1/auth/logout — Révocation du token courant
        Route::post('auth/logout', [LogoutController::class, 'destroy'])
            ->name('auth.logout');

        // POST /api/v1/auth/logout-all — Révocation de tous les tokens (tous les appareils)
        Route::post('auth/logout-all', [LogoutController::class, 'destroyAll'])
            ->name('auth.logout-all');

        // GET /api/v1/auth/me — Retourne l'utilisateur authentifié courant
        // Utilisé par le frontend au rechargement de page pour restaurer la session
        Route::get('auth/me', MeController::class)
            ->name('auth.me');

        /*
        |----------------------------------------------------------------------
        | Profil utilisateur
        |----------------------------------------------------------------------
        */
        Route::prefix('profile')->name('profile.')->group(function (): void {

            // GET /api/v1/profile — Données complètes du profil (user + profil GW2)
            Route::get('/', [UserProfileController::class, 'show'])
                ->name('show');

            // PUT /api/v1/profile — Mise à jour des infos de base (nom, pseudo_gw2)
            Route::put('/', [UserProfileController::class, 'update'])
                ->name('update');

            // POST /api/v1/profile/avatar — Upload et remplacement de l'avatar
            Route::post('avatar', [AvatarController::class, 'upload'])
                ->name('avatar.upload');

            // POST /api/v1/profile/api-key — Validation et enregistrement de la clé API GW2
            // Appelle /v2/tokeninfo pour vérifier la clé avant de la chiffrer en base
            Route::post('api-key', [UserProfileController::class, 'updateApiKey'])
                ->name('api-key.update');

            // DELETE /api/v1/profile/api-key — Suppression de la clé API GW2
            Route::delete('api-key', [UserProfileController::class, 'deleteApiKey'])
                ->name('api-key.delete');

            // GET /api/v1/profile/gw2-data — Données GW2 fraîches (compte + personnages)
            // Appelle l'API GW2 ou retourne les données cachées (Redis/cache Laravel)
            Route::get('gw2-data', [UserProfileController::class, 'gw2Data'])
                ->name('gw2-data');
        });

        /*
        |----------------------------------------------------------------------
        | Back-office administrateur
        |----------------------------------------------------------------------
        |
        | Groupe supplémentaire avec le middleware 'admin' qui vérifie
        | que l'utilisateur possède le rôle 'admin'.
        |
        | Note : 'auth:sanctum' et 'ban.check' sont déjà appliqués par le
        | groupe parent — on n'a pas besoin de les répéter ici.
        |
        | Enregistrement des alias dans bootstrap/app.php :
        |   'admin'     => AdminMiddleware::class
        |   'ban.check' => BanCheck::class
        |
        */
        Route::prefix('admin')
            ->middleware('admin')
            ->name('admin.')
            ->group(function (): void {

                // GET /api/v1/admin/stats — Statistiques globales de la plateforme
                Route::get('stats', [AdminUserController::class, 'stats'])
                    ->name('stats');

                /*
                |--------------------------------------------------------------
                | Gestion des utilisateurs
                |--------------------------------------------------------------
                */
                Route::prefix('users')->name('users.')->group(function (): void {

                    // GET    /api/v1/admin/users           — Liste paginée + filtres (search, role, status)
                    Route::get('/', [AdminUserController::class, 'index'])
                        ->name('index');

                    // GET    /api/v1/admin/users/{user}    — Détail + historique de bans
                    Route::get('{user}', [AdminUserController::class, 'show'])
                        ->name('show');

                    // POST   /api/v1/admin/users/{user}/ban   — Appliquer un ban (temporaire ou permanent)
                    Route::post('{user}/ban', [AdminUserController::class, 'ban'])
                        ->name('ban');

                    // DELETE /api/v1/admin/users/{user}/ban   — Lever le ban actif
                    Route::delete('{user}/ban', [AdminUserController::class, 'unban'])
                        ->name('unban');
                });

                /*
                |--------------------------------------------------------------
                | Point d'extension — futures features admin
                |--------------------------------------------------------------
                |
                | Décommenter au fur et à mesure des sprints :
                |
                |   Route::apiResource('categories', AdminCategoryController::class);
                |   Route::apiResource('discussions', AdminDiscussionController::class);
                |   Route::get('logs', AdminLogController::class)->name('logs');
                |
                */
            });
    });
});