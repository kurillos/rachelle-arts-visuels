<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublicImage;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PublicImageController extends Controller
{
    /**
     * Affiche la page de gestion du portfolio.
     */
    public function index()
    {
        return Inertia::render('Admin/Portfolio/Index', [
            'images' => PublicImage::with(['category', 'tags'])->latest()->get(),
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'isAdmin' => true
        ]);
    }

    /**
     * Enregistre une ou plusieurs images (Upload atomique via React/Axios).
     */
    public function store(Request $request)
    {
        // Validation stricte (100 Mo max par fichier pour la HD)
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:102400', 
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'nullable|array',
        ]);

        $manager = new ImageManager(new Driver());
        $uploadedData = [];

        try {
            foreach ($request->file('images') as $file) {
                // 1. Lecture et redimensionnement (Largeur max 2000px pour le web)
                $image = $manager->read($file);
                $image->scale(width: 2000);

                // 2. Application du filigrane (Watermark)
                $logoPath = public_path('images/logo.png');
                if (file_exists($logoPath)) {
                    $watermark = $manager->read($logoPath);
                    $watermark->scale(width: 500); 
                    $image->place($watermark, 'center', opacity: 40);
                }

                // 3. Encodage JPEG progressif (Optimisation poids/qualité)
                $encoded = $image->toJpeg(80);
                $filename = uniqid() . '.jpg';
                $path = "portfolio/{$filename}";

                // 4. Stockage sur S3
                Storage::disk('s3')->put($path, (string) $encoded);

                // 5. Création de l'entrée en base de données
                $item = PublicImage::create([
                    'title' => $file->getClientOriginalName(),
                    'image_path' => $path,
                    'category_id' => $request->category_id,
                ]);

                // 6. Synchronisation des tags (Univers)
                if ($request->has('tag_ids')) {
                    $item->tags()->sync($request->tag_ids);
                }

                $uploadedData[] = $item->load(['category', 'tags']);
            }

            // --- CRUCIAL POUR L'ANTI-PAGE BLANCHE ---
            // On renvoie du JSON. Axios le réceptionnera proprement sans que le routeur
            // d'Inertia ne tente de rediriger la page au milieu de l'upload.
            return response()->json([
                'success' => true,
                'message' => 'Image traitée avec succès',
                'data' => $uploadedData
            ], 200);

        } catch (\Exception $e) {
            Log::error("Erreur Store Portfolio : " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Erreur lors du traitement de l\'image.'
            ], 500);
        }
    }

    /**
     * Met à jour les métadonnées d'une image.
     */
    public function update(Request $request, PublicImage $image)
    {
        $image->update([
            'title' => $request->title,
            'category_id' => $request->category_id
        ]);
    
        if ($request->has('tag_ids')) {
            $image->tags()->sync($request->tag_ids);
        }
    
        return back(); // Ici le back() est possible car c'est une action unique (Modale)
    }

    /**
     * Supprime une image de la BDD et de S3.
     */
    public function destroy(PublicImage $image)
    {
        try {
            if (Storage::disk('s3')->exists($image->image_path)) {
                Storage::disk('s3')->delete($image->image_path);
            }
            $image->delete();
            return back();
        } catch (\Exception $e) {
            Log::error("Erreur Delete Portfolio : " . $e->getMessage());
            return back()->with('error', 'Erreur lors de la suppression.');
        }
    }
}