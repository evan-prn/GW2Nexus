<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ModeratorMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isModerator()) {
            return response()->json([
                'message' => 'Acces reserve a la moderation.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
