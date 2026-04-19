@component('mail::message')
# ✨ Nouvelle sélection validée !

Bonjour Rachelle,

Bonne nouvelle : **{{ $client }}** vient de valider sa sélection de photos pour la galerie **"{{ $title }}"**.

---

## Résumé de la commande

| | |
|---|---|
| **Galerie** | {{ $title }} |
| **Client** | {{ $client }} |
| **Photos sélectionnées** | {{ $count }} photo(s) |

---

Vous pouvez consulter la sélection complète (avec les notes de retouche) directement depuis votre espace admin :

@component('mail::button', ['url' => url('/admin/galleries'), 'color' => 'purple'])
Voir la sélection dans l'admin
@endcomponent

Bonne continuation !

**— Votre site Rachelle Arts Visuels**
@endcomponent
