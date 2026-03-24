<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\BanCheck;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web:       __DIR__.'/../routes/web.php',
        api:       __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands:  __DIR__.'/../routes/console.php',
        health:    '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // Mode Bearer Token — les routes API sont stateless, pas de session.
        // statefulApi() est retiré : il activait le mode SPA cookie de Sanctum
        // qui exige un cookie CSRF sur chaque requête mutante (POST/PUT/DELETE).
        // En Bearer Token, Laravel authentifie via le header Authorization uniquement.

        // Exclusion du middleware CSRF pour toutes les routes API.
        // En mode Bearer Token, la protection CSRF est inutile — elle est
        // conçue pour les sessions cookie. Les tokens Bearer sont envoyés
        // dans le header Authorization, pas dans un cookie accessible au JS,
        // ce qui les rend naturellement immunisés contre les attaques CSRF.
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Alias middleware — utilisés par leur nom dans les routes
        $middleware->alias([
            'admin'     => AdminMiddleware::class, // Vérifie role === 'admin'
            'ban.check' => BanCheck::class,        // Bloque les utilisateurs bannis
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();