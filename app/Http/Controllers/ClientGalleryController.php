<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

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
}