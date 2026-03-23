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

        // Sanctum SPA — gestion des cookies de session pour l'API
        $middleware->statefulApi();

        // Alias middleware — utilisés par leur nom dans les routes
        $middleware->alias([
            'admin'     => AdminMiddleware::class, // Vérifie role === 'admin'
            'ban.check' => BanCheck::class,        // Bloque les utilisateurs bannis
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();