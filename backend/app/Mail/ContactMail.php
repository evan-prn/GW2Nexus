<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Crée une nouvelle instance du mail de contact.
     */
    public function __construct(
        public readonly string $senderName,
        public readonly string $senderEmail,
        public readonly string $contactSubject,
        public readonly string $messageContent,
    ) {}

    /**
     * Objet de l'email dans la boîte mail.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from:     new Address(config('mail.from.address'), config('mail.from.name') - ' Contact'),
            replyTo: [new Address($this->senderEmail, $this->senderName)],
            subject:  '[GW2Nexus] ' . $this->getSubjectLabel(),
        );
    }

    /**
     * Contenu de l'email — vue Blade.
     * Les variables sont passées explicitement à la vue.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
            with: [
                'senderName'     => $this->senderName,
                'senderEmail'    => $this->senderEmail,
                'contactSubject' => $this->getSubjectLabel(),
                'messageContent' => $this->messageContent,
            ],
        );
    }

    /**
     * Traduit le slug de sujet en libellé lisible.
     */
    public function getSubjectLabel(): string
    {
        return match ($this->contactSubject) {
            'bug'         => 'Signalement de bug',
            'feature'     => 'Suggestion de fonctionnalité',
            'account'     => 'Problème de compte',
            'api'         => 'Problème avec la clé API GW2',
            'partnership' => 'Partenariat / Presse',
            default       => 'Autre demande',
        };
    }
}