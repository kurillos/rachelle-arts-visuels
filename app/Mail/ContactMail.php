<?php 

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $formData;

    /**
     * Crée une nouvelle instance de message
     *
     * @param array $formData
     * @return void
     */
    public function __construct(array $formData)
    {
        $this->formData = $formData;
    }

    public function build()
    {
        return $this->subject('Nouveau message de contact depuis le formulaire')
                    ->markdown('emails.contact');
    }
}
