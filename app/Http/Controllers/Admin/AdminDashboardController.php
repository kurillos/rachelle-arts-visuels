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
    $request->validate([
        'images.*' => 'required|image|max:10000', 
        'title' => 'nullable|string|max:100',
    ]);

    try {
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            // Si pas de titre, on utilise "image" par défaut
            $baseTitle = $request->input('title') ?? 'image';
            
            // On regarde en base combien on en a déjà avec ce nom
            $existingCount = \App\Models\Carousel::where('title', 'like', $baseTitle . '-%')->count();

            foreach ($files as $index => $file) {
                $currentNumber = $existingCount + $index + 1;
                $finalTitle = $baseTitle . '-' . $currentNumber;

                $path = $file->store('carousels', 's3');
                $url = \Illuminate\Support\Facades\Storage::disk('s3')->url($path);

                \App\Models\Carousel::create([
                    'image_url' => $url,
                    'image_path' => $path,
                    'title' => $finalTitle,
                ]);
            }
            return back()->with('success', count($files) . ' photos envoyées sur S3 !');
        }
    } catch (\Exception $e) {
        return back()->with('error', 'Erreur S3 : ' . $e->getMessage());
    }
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