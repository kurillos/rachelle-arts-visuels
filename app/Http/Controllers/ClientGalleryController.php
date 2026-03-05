<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\GalleryPhoto;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;

class ClientGalleryController extends Controller
{
    /**
     * Affiche soit le login, soit la galerie si déjà authentifié
     */
    public function show($slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();

        // 1. Vérification de l'expiration (les 60 jours)
        if ($gallery->expires_at && $gallery->expires_at->isPast()) {
            return Inertia::render('Client/Gallery/Expired', [
                'gallery_title' => $gallery->title
            ]);
        }

        // 2. Vérification de la session spécifique à cette galerie
        if (Session::get("gallery_auth_{$gallery->id}")) {
            return Inertia::render('Client/Gallery/Show', [
                // On charge les photos avec l'accessor full_url via le modèle
                'gallery' => $gallery->load('photos'),
            ]);
        }

        // 3. Sinon, afficher le formulaire de mot de passe
        return Inertia::render('Client/Gallery/Login', [
            'gallery_title' => $gallery->title,
            'slug' => $slug
        ]);
    }

    /**
     * Traitement du mot de passe
     */
    public function login(Request $request, $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();

        $request->validate([
            'password' => 'required',
        ]);

        if ($request->password === $gallery->password) {
            // On marque la session comme autorisée pour CETTE galerie
            Session::put("gallery_auth_{$gallery->id}", true);
            return redirect()->route('client.gallery.show', $slug);
        }

        return back()->withErrors(['password' => 'Mot de passe incorrect.']);
    }

    /**
     * Inverser le statut favori (is_selected)
     */
    public function toggleFavorite(GalleryPhoto $photo)
    {
        // On change le boolean
        $photo->update([
            'is_selected' => !$photo->is_selected
        ]);

        return back();
    }

    /**
    * Affiche le formulaire d'inscription via le lien du mail
    */
    public function registerForm($slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();

        // Si le client a déjà ouvert sa galerie, on peut imaginer changer le statut ici aussi
        if ($gallery->status === 'envoyé') {
            $gallery->update(['status' => 'ouvert']);
        }

        return Inertia::render('Client/Register', [
            'gallery' => [
            'title' => $gallery->title,
            'client_name' => $gallery->client_name,
            'slug' => $gallery->slug,
            'expires_at' => $gallery->expires_at, // Pour le timer !
            ]
        ]);
    }

    /**
    * Enregistre le client et lie la galerie à son nouveau compte
    */
    public function register(Request $request, $slug)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'password' => 'required|confirmed|min:8',
            'cgv' => 'accepted',
        ]);

        // 1. Création de l'utilisateur (on peut lui donner un rôle 'client')
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone, 
        ]);

        // 2. Liaison de la galerie à l'user_id ici 
        $gallery = Gallery::where('slug', $slug)->first();
        $gallery->update(['password' => null]); // Le mdp de la galerie devient inutile car l'user est logué

        return redirect()->route('client.gallery.login', $slug)
            ->with('success', 'Votre compte a été créé avec succès. Connectez-vous pour voir vos photos.');
    }

    public function storeRegister(Request $request, $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $gallery->update([
            'client_name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'password' => $validated['password'],
            'status' => 'en cours',
            'client_notes' => 'Compte initialisé le ' . now()->format('d/m/Y'),
        ]);

        // On peut ici connecter le client manuellement en session
        session(['gallery_authenticated' => $gallery->id]);

        return redirect()->route('client.gallery.show', $slug)
                     ->with('success', 'Bienvenue ! Votre espace est prêt.');
    }

    public function updatePhotoComment(Request $request, GalleryPhoto $photo)
    {
        // Sécurité : on vérifie que la photo appartient bien à une galerie authentifiée en session
        if (session('gallery_authenticated') !== $photo->gallery_id) {
            return back()->with('error', 'Action non autorisée.');
        }

        $request->validate([
            'comment' => 'nullable|string|max:500',
        ]);

        $photo->update([
            'client_comment' => $request->comment
        ]);

        return back()->with('success', 'Note de retouche enregistrée.');
    }

    public function validateSelection($slug)
    {
        $gallery = Gallery::where('slug', $slug)->with('photos')->firstOrFail();
    
        // On récupère uniquement les photos sélectionnées
        $selections = $gallery->photos()->where('is_selected', true)->get();
    
        // Mise à jour du statut de la galerie
        $gallery->update([
            'status' => 'sélectionnée', // Le badge passera en violet chez Rachelle !
        ]);

        $gallery->update(['status' => 'sélectionnée']);

        Mail::to('rachelle.artsvisuels@gmail.com')->send(new SelectionValidated($gallery));

    // Optionnel : Envoyer un mail auto à Rachelle pour la prévenir
    // Mail::to('rachelle@exemple.com')->send(new SelectionValidatedMail($gallery));

    return Inertia::render('Client/Thanks', [
        'title' => $gallery.title,
        'count' => $selections->count()
    ]);
}
}