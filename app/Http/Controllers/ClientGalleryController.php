<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\GalleryPhoto;
use App\Models\User;
use App\Mail\SelectionValidated; // ← ajouté : manquait, causait une erreur fatale
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;  // ← ajouté : manquait, causait une erreur fatale
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

        if ($gallery->status === 'envoyé') {
            $gallery->update(['status' => 'ouvert']);
        }

        return Inertia::render('Client/Register', [
            'gallery' => [
                'title'       => $gallery->title,
                'client_name' => $gallery->client_name,
                'slug'        => $gallery->slug,
                'expires_at'  => $gallery->expires_at,
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
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'phone'      => 'required|string',
            'password'   => 'required|confirmed|min:8',
            'cgv'        => 'accepted',
        ]);

        $user = User::create([
            'name'     => $request->first_name . ' ' . $request->last_name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
        ]);

        $gallery = Gallery::where('slug', $slug)->first();
        $gallery->update(['password' => null]);

        return redirect()->route('client.gallery.login', $slug)
            ->with('success', 'Votre compte a été créé avec succès. Connectez-vous pour voir vos photos.');
    }

    public function storeRegister(Request $request, $slug)
    {
        $gallery = Gallery::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'required|string|max:20',
            'password'   => 'required|string|min:6|confirmed',
        ]);

        $gallery->update([
            'client_name'  => $validated['first_name'] . ' ' . $validated['last_name'],
            'password'     => $validated['password'],
            'status'       => 'en cours',
            'client_notes' => 'Compte initialisé le ' . now()->format('d/m/Y'),
        ]);

        // Alignement avec la clé utilisée par login() et updatePhotoComment()
        Session::put("gallery_auth_{$gallery->id}", true);

        return redirect()->route('client.gallery.show', $slug)
            ->with('success', 'Bienvenue ! Votre espace est prêt.');
    }

    /**
     * Enregistre la note de retouche d'une photo.
     * Correction : utilise la même clé de session que login() → "gallery_auth_{id}"
     */
    public function updatePhotoComment(Request $request, GalleryPhoto $photo)
    {
        // ← CORRECTION : clé alignée avec celle définie dans login() et storeRegister()
        if (! Session::get("gallery_auth_{$photo->gallery_id}")) {
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

    /**
     * Valide la sélection du client et envoie un mail à Rachelle.
     * Corrections : import Mail + SelectionValidated, syntaxe PHP $gallery->title
     */
    public function validateSelection($slug)
    {
        $gallery = Gallery::where('slug', $slug)->with('photos')->firstOrFail();

        $selections = $gallery->photos()->where('is_selected', true)->get();

        // ← Une seule mise à jour (le doublon a été supprimé)
        $gallery->update(['status' => 'sélectionnée']);

        // ← Mail et import corrigés
        Mail::to('rachelle.artsvisuels@gmail.com')->send(new SelectionValidated($gallery));

        return Inertia::render('Client/Thanks', [
            'title' => $gallery->title,  // ← CORRECTION : -> au lieu de .
            'count' => $selections->count(),
        ]);
    }
}
