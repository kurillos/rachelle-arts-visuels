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
     * Affiche la liste des images dans l'admin
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
     * Traite l'upload massif, applique le logo et enregistre en BDD
     */
    public function store(Request $request)
    {
        // 1. Validation
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:10240',
            'category_id' => 'required|exists:categories,id',
            'tag_ids' => 'nullable|array',
        ]);

        $manager = new ImageManager(new Driver());

        try {
            foreach ($request->file('images') as $file) {
                // 2. Lecture et redimensionnement
                $image = $manager->read($file);
                $image->scale(width: 2000);

                // 3. Application du Logo (Filigrane) au centre
                $logoPath = public_path('images/logo.png');
                if (file_exists($logoPath)) {
                    $watermark = $manager->read($logoPath);
                    $watermark->scale(width: 500); 
                    $image->place($watermark, 'center', opacity: 50);
                }

                // 4. Préparation du fichier
                $encoded = $image->toJpeg(80);
                $filename = uniqid() . '.jpg';
                $pathForS3 = "portfolio/{$filename}";

                // 5. Upload vers S3
                Storage::disk('s3')->put($pathForS3, (string) $encoded);

                // 6. Enregistrement en Base de Données
                $item = PublicImage::create([
                    'title' => $file->getClientOriginalName(),
                    'image_path' => $pathForS3,
                    'category_id' => $request->category_id,
                ]);

                // 7. Synchronisation des Tags
                if ($request->has('tag_ids')) {
                    $item->tags()->sync($request->tag_ids);
                }
            }

            return back()->with('success', 'Images traitées, signées et publiées avec succès !');

        } catch (\Exception $e) {
            Log::error("Erreur Store Portfolio : " . $e->getMessage());
            return back()->with('error', "Une erreur est survenue : " . $e->getMessage());
        }
    }

    /**
     * Met à jour les métadonnées d'une image
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
    
        return back()->with('success', 'Image mise à jour.');
    }

    /**
     * Supprime l'image de la BDD et du stockage S3
     */
    public function destroy(PublicImage $image)
    {
        if (Storage::disk('s3')->exists($image->image_path)) {
            Storage::disk('s3')->delete($image->image_path);
        }
        
        $image->delete();
        return back()->with('success', 'Image supprimée définitivement.');
    }
}