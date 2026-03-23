<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware AdminMiddleware
 *
 * Vérifie que l'utilisateur authentifié possède le rôle 'admin'.
 * À enregistrer dans bootstrap/app.php :
 *
 *   ->withMiddleware(function (Middleware $middleware) {
 *       $middleware->alias([
 *           'admin'     => \App\Http\Middleware\AdminMiddleware::class,
 *           'ban.check' => \App\Http\Middleware\BanCheck::class,
 *       ]);
 *   })
 */
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            return response()->json([
                'message' => 'Accès réservé aux administrateurs.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
