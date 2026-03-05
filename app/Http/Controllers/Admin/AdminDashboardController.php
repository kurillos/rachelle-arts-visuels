<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            // Statistiques pour les compteurs
            'stats' => [
                'brouillons' => Gallery::where('status', 'brouillon')->count(),
                'envoyees' => Gallery::where('status', 'envoyé')->count(),
                'a_traiter' => Gallery::where('status', 'sélectionnée')->count(),
                'en_cours' => Gallery::where('status', 'en cours')->count(),
            ],
            // Les 6 dernières galeries actives
            'recentGalleries' => Gallery::withCount('photos')
                ->whereIn('status', ['envoyé', 'sélectionnée', 'en cours'])
                ->latest()
                ->take(6)
                ->get(),
            // Les images du carousel (vitrine)
            'carouselImages' => Carousel::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|max:10000', 
            'title' => 'nullable|string|max:100',
        ]);

        try {
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $baseTitle = $request->input('title') ?? 'image';
                $existingCount = Carousel::where('title', 'like', $baseTitle . '-%')->count();

                foreach ($files as $index => $file) {
                    $currentNumber = $existingCount + $index + 1;
                    $finalTitle = $baseTitle . '-' . $currentNumber;

                    $path = $file->store('carousels', 's3');
                    $url = Storage::disk('s3')->url($path);

                    Carousel::create([
                        'image_url' => $url,
                        'image_path' => $path,
                        'title' => $finalTitle,
                    ]);
                }
                return back()->with('success', count($files) . ' photos ajoutées à la vitrine !');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur S3 : ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $carouselItem = Carousel::findOrFail($id);
        try {
            if ($carouselItem->image_path) {
                Storage::disk('s3')->delete($carouselItem->image_path);
            }
            $carouselItem->delete();
            return redirect()->back()->with('success', 'Image supprimée de la vitrine.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la suppression.');
        }
    }
}