<?php

namespace App\Mail;

use App\Models\Gallery;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class GalleryInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    public function __construct(public Gallery $gallery)
    {
        // On génère l'URL signée ici
        $this->url = URL::temporarySignedRoute(
            'client.gallery.register',
            now()->addDays(7),
            ['slug' => $this->gallery->slug]
        );
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "✨ Vos souvenirs sont prêts - {$this->gallery->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.gallery.invitation',
            with: [
                'url' => $this->url,
            ],
        );
    }
}