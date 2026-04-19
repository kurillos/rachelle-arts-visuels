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
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type', 'mariage');

        return Inertia::render('Admin/Galleries/Index', [
            'galleries' => Gallery::where('type', $type)
                ->with(['offer'])
                ->withCount('photos')
                ->latest()
                ->get(),
            'offers' => Offer::all(),
            'currentType' => $type
        ]);
    }

    public function store(Request $request)
    {
        ini_set('memory_limit', '512M');

        $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'type' => 'required|in:mariage,shooting,graphisme',
            'offer_id' => 'required|exists:offers,id',
            'password' => 'required|string|min:4',
            'images' => 'nullable|array',
            'event_date' => 'nullable|date',
            'expires_at' => 'nullable|date',
        ]);

        try {
            $offer = Offer::find($request->offer_id);

            $gallery = Gallery::create([
                'title' => $request->title,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'type' => $request->type,
                'offer_id' => $request->offer_id,
                'photo_quota' => $offer->quota,
                'extra_photo_price' => $offer->extra_price ?? 10,
                'password' => $request->password,
                'event_date' => $request->event_date,
                'expires_at' => $request->expires_at ?? now()->addDays(60),
                'status' => 'brouillon',
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {

                    $image = Image::read($file);
                    $image->scale(width: 2000);


                    // Logique de filigrane sécurisée
                    try {
                        $logoPath = public_path('images/logo.png');

                        if (file_exists($logoPath)) {
                            // 1. On lit le logo d'abord
                            $watermark = Image::read($logoPath);

                            // 2. On redimensionne le logo
                            $watermark->scale(width: 500);

                            // 3. On applique le logo au centre
                            $image->place($watermark, 'center', opacity: 35);
                        } else {
                            \Log::warning("Le logo n'a pas été trouvé au chemin : " . $logoPath);
                        }
                    } catch (\Exception $e) {
                        // Si une erreur survient (format non supporté, etc.), on log l'erreur
                        // Mais on n'affiche plus de spirales car l'image originale reste intacte
                        \Log::error("Erreur Watermark : " . $e->getMessage());
                    }

                    $encoded = $image->toJpeg(80);

                    $folder = match ($gallery->type) {
                        'mariage' => 'mariages',
                        'shooting' => 'shootings',
                        'graphisme' => 'graphisme',
                        default => 'autres'
                    };

                    $filename = uniqid() . '.jpg';
                    $path = "galleries/{$folder}/{$gallery->slug}/{$filename}";

                    Storage::disk('s3')->put($path, (string) $encoded);

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
            Log::error("Erreur Store Gallery : " . $e->getMessage());
            return back()->with('error', "Erreur technique : " . $e->getMessage());
        }
    }

    public function destroy(Gallery $gallery)
    {
        $folder = match ($gallery->type) {
            'mariage' => 'mariages',
            'shooting' => 'shootings',
            'graphisme' => 'graphisme',
            default => 'autres'
        };
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
        $gallery->update(['status' => 'envoyé']);
        return back()->with('success', "L'invitation a été envoyée !");
    }
}
