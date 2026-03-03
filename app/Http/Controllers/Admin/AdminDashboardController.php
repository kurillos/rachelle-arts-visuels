<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Affiche la liste des images présentes dans le carrousel.
     */
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'images' => Carousel::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Gère l'upload de l'image vers Amazon S3.
     */
    public function upload(Request $request)
    {
        // Validation du type de fichier pour la sécurité.
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,tiff', 
            'title' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                
                // On génère un nom unique pour éviter les conflits sur S3
                $path = $file->store('public/carousels', 's3');

                $url = Storage::disk('s3')->url($path);

                Carousel::create([
                    'image_url' => $url,
                    'image_path' => $path,
                    'title' => $request->input('title') ?? 'Nouvelle Photo HD',
                    'description' => $request->input('description'),
                ]);

                return redirect()->back()->with('success', 'Photo HD publiée sur le Cloud !');
            }
        } catch (\Exception $e) {
            \Log::error('Erreur Upload S3 : ' . $e->getMessage());
            return redirect()->back()->with('error', 'Le serveur a refusé le fichier (trop lourd ou problème de connexion).');
        }

        return redirect()->back();
    }

    /**
     * Supprime une image de la base de données et du Cloud S3.
     */
    public function destroy($id)
    {
        $carouselItem = Carousel::findOrFail($id);

        try {
            if ($carouselItem->image_path) {
                Storage::disk('s3')->delete($carouselItem->image_path);
            }
            $carouselItem->delete();
            return redirect()->back()->with('success', 'L\'image a été supprimée du Cloud.');
        } catch (\Exception $e) {
            \Log::error('Erreur Suppression S3 : ' . $e->getMessage());
            return redirect()->back()->with('error', 'Erreur lors de la suppression.');
        }
    }
}