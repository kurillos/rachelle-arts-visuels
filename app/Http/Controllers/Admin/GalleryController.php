<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryPhoto;
use App\Mail\GalleryInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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
        // 1. Validation : Ajout de client_email et client_name
        $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'type' => 'required|in:mariage,shooting',
            'password' => 'required|string|min:4',
            'images' => 'required|array',
            'event_date' => 'nullable|date',
            'expires_at' => 'nullable|date',
        ]);

        try {
            // 2. Création de la galerie avec le nouvel email
            $gallery = Gallery::create([
                'title' => $request->title,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'type' => $request->type,
                'password' => $request->password,
                'event_date' => $request->event_date,
                'expires_at' => $request->expires_at,
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
                
                    // Upload sur S3
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
            // En cas d'erreur S3 ou autre
            dd([
                'Erreur' => $e->getMessage(),
                'Note' => "Vérifie si la colonne 'client_email' existe bien dans ta table 'galleries'."
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

    public function sendInvitation(Gallery $gallery)
    {
        if (!$gallery->client_email) {
            return back()->with('error', "L'email du client n'est pas renseigné.");
        }

        Mail::to($gallery->client_email)->send(new GalleryInvitation($gallery));

        return back()->with('success', "L'invitation a été envoyée avec succès !");
    }
}