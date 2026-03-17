<?php

namespace App\Http\Controllers\Api\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\ContactRequest;
use App\Mail\ContactMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    /**
     * POST /api/v1/contact
     *
     * Envoie le message de contact vers Mailpit (dev) ou le vrai SMTP (prod).
     * Route publique — pas besoin d'être authentifié.
     */
    public function send(ContactRequest $request): JsonResponse
    {
        // ─── Rate limiting : 3 messages max par IP sur 10 minutes ───────────
        $key = 'contact:' . Str::slug($request->ip());

        if (RateLimiter::tooManyAttempts($key, maxAttempts: 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Trop de messages envoyés. Réessayez dans {$seconds} secondes.",
            ], 429);
        }

        RateLimiter::hit($key, decaySeconds: 600); // fenêtre de 10 minutes

        // ─── Envoi de l'email ────────────────────────────────────────────────
        Mail::to(config('mail.contact_address', config('mail.from.address')))
            ->send(new ContactMail(
                senderName:     $request->validated('name'),
                senderEmail:    $request->validated('email'),
                contactSubject: $request->validated('subject', 'other'),
                messageContent: $request->validated('message'),
            ));

        return response()->json([
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les 48h ouvrées.',
        ], 201);
    }
}