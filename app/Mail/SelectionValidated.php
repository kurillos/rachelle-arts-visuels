<?php

namespace App\Mail;

use App\Models\Gallery;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SelectionValidated extends Mailable
{
    use Queueable, SerializesModels;

    // On passe la galerie au constructeur pour qu'elle soit accessible
    public function __construct(public Gallery $gallery) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✨ Sélection validée : ' . $this->gallery->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.selection-validated',
            with: [
                'title' => $this->gallery->title,
                'client' => $this->gallery->client_name,
                'count' => $this->gallery->photos()->where('is_selected', true)->count(),
            ],
        );
    }
}
