@component('mail::message')
# Bonjour {{ $gallery->client_name }},

C'est Rachelle ! J'ai le plaisir de vous annoncer que les photos de votre séance **"{{ $gallery->title }}"** sont enfin prêtes à être découvertes.

Vous disposez de **60 jours** pour parcourir votre galerie, partager vos photos préférées et finaliser votre sélection.

@component('mail::button', ['url' => route('client.gallery.show', $gallery->slug)])
Accéder à ma galerie privée
@endcomponent

*Note : Pour votre première connexion, vous devrez définir votre mot de passe personnel.*

Si vous avez la moindre question, je reste à votre entière disposition.

Merci pour votre confiance,

**Rachelle - Conception Visuelles et Photographie**
@endcomponent