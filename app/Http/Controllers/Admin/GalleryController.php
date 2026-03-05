<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryPhoto;
use App\Models\Offer;
use App\Mail\GalleryInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        // On récupère le type pour le filtrage (par défaut 'mariage')
        $type = $request->query('type', 'mariage');

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::where('type', $type)
                ->with(['offer']) // Charge l'offre liée pour afficher le quota
                ->withCount('photos')
                ->latest()
                ->get(),
            'offers' => Offer::all(), // On envoie les offres pour la modale de création
            'currentType' => $type
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'type' => 'required|in:mariage,shooting',
            'offer_id' => 'required|exists:offers,id',
            'password' => 'required|string|min:4',
            'images' => 'required|array',
            'event_date' => 'nullable|date',
            'expires_at' => 'nullable|date',
        ]);

        try {
            // On récupère l'offre pour enregistrer le quota fixe dans la galerie (sécurité)
            $offer = Offer::find($request->offer_id);

            $gallery = Gallery::create([
                'title' => $request->title,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'type' => $request->type,
                'offer_id' => $request->offer_id,
                'quota' => $offer->quota,
                'password' => $request->password,
                'event_date' => $request->event_date,
                'expires_at' => $request->expires_at,
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
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
            return back()->with('error', "Erreur : " . $e->getMessage());
        }
    }

    // Le reste de tes méthodes (destroy, show, sendInvitation) reste inchangé...
    
    public function destroy(Gallery $gallery)
    {
        $folder = ($gallery->type === 'mariage') ? 'mariages' : 'shootings';
        Storage::disk('s3')->deleteDirectory("galleries/{$folder}/{$gallery->slug}");
        $gallery->delete();
        return redirect()->back()->with('success', 'Galerie supprimée.');
    }

    public function show(Gallery $gallery)
    {
        return Inertia::render('Admin/Galleries/Show', [
            'gallery' => $gallery->load(['photos', 'offer']),
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