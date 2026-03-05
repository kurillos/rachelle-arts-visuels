<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'mariage');

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::where('type', $type)
                ->withCount('photos')
                ->latest()
                ->get(),
            'currentType' => $type
        ]);
    }

    public function store(Request $request)
{
    // 1. Validation (on garde la validation en dehors du try pour avoir les erreurs classiques si possible)
    $request->validate([
        'title' => 'required|string|max:255',
        'type' => 'required|in:mariage,shooting',
        'password' => 'required|string|min:4',
        'images' => 'required|array',
        'expires_at' => 'nullable|date',
    ]);

    try {
        // Début de la logique
        $gallery = Gallery::create([
            'title' => $request->title,
            'client_name' => $request->client_name,
            'type' => $request->type,
            'password' => $request->password,
            'event_date' => $request->event_date,
            'expires_at' => $request->expires_at,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
                
                // Tentative d'upload sur S3
                $path = $file->store("galleries/{$folder}/{$gallery->slug}", 's3');

                GalleryPhoto::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $path,
                    'title' => $file->getClientOriginalName(),
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->back()->with('success', "Galerie créée avec succès.");

    } catch (\Exception $e) {
        // Si ça plante, on affiche l'erreur réelle (très utile pour S3)
        dd([
            'Erreur' => $e->getMessage(),
            'Fichier' => $e->getFile(),
            'Ligne' => $e->getLine(),
            'Note' => "Vérifie tes accès S3 dans le .env ou la taille des fichiers PHP"
        ]);
    }
}

    public function destroy(Gallery $gallery)
    {
        // On définit le chemin exact tel qu'enregistré dans store
        $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
        Storage::disk('s3')->deleteDirectory("galleries/{$folder}/{$gallery->slug}");

        $gallery->delete();

        return redirect()->back()->with('success', 'Galerie supprimée.');
    }

    /**
    * Affiche le détail d'une galerie (Vue Admin)
    */
    public function show(Gallery $gallery)
    {
        // On charge les photos liées à cette galerie avant d'envoyer à Inertia
        // L'accessor 'full_url' que nous avons ajouté au modèle fera le reste
        return Inertia::render('Admin/Galleries/Show', [
            'gallery' => $gallery->load('photos'),
        ]);
    }
}