<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    /**
     * Affiche la liste des galeries filtrée par type (mariage ou shooting)
     */
    public function index(Request $request)
    {
        $type = $request->query('type', 'mariage'); // Par défaut 'mariage'

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::where('type', $type)
                ->withCount('photos')
                ->latest()
                ->get(),
            'currentType' => $type
        ]);
    }

    /**
     * Stocke une nouvelle galerie et ses images sur S3
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:mariage,shooting',
            'password' => 'required|string|min:4',
            'event_date' => 'nullable|date',
            'images.*' => 'required|image|max:10000', // 10Mo max par photo
        ]);

        // 1. Création de l'album
        $gallery = Gallery::create([
            'title' => $request->title,
            'type' => $request->type,
            'password' => $request->password,
            'event_date' => $request->event_date,
        ]);

        // 2. Upload multiple vers le dossier spécifique sur S3
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                // Le dossier sera soit 'mariages/slug...' soit 'shootings/slug...'
                $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
                $path = $file->store("{$folder}/{$gallery->slug}", 's3');

                GalleryPhoto::create([
                    'gallery_id' => $gallery->id,
                    'image_path' => $path,
                    'title' => $gallery->title . '-' . ($index + 1),
                ]);
            }
        }

        return redirect()->back()->with('success', "La galerie {$gallery->title} a été créée avec succès.");
    }

    /**
     * Supprime une galerie et ses fichiers sur S3
     */
    public function destroy(Gallery $gallery)
    {
        // Supprimer le dossier complet sur S3
        $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
        Storage::disk('s3')->deleteDirectory("{$folder}/{$gallery->slug}");

        $gallery->delete();

        return redirect()->back()->with('success', 'Galerie supprimée.');
    }
}