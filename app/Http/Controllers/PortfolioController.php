<?php

namespace App\Http\Controllers;

use App\Models\PublicImage;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Affiche l'index du portfolio (Toutes les images)
     */
    public function index()
    {
        return $this->renderGallery();
    }

    /**
     * Affiche une catégorie spécifique via son slug dans l'URL
     */
    public function show($slug)
    {
        return $this->renderGallery($slug);
    }

    /**
     * Logique de rendu centralisée
     */
    private function renderGallery($slug = null)
    {
        $categories = Category::all();
        $currentCategory = null;

        if ($slug) {
            // 1. On cherche la catégorie correspondante
            $currentCategory = $categories->first(function ($category) use ($slug) {
                return Str::slug($category->name) === $slug;
            });

            // 2. Si un slug est fourni mais introuvable, on évite le mélange d'images
            if (!$currentCategory) {
                return redirect()->route('portfolio.index');
            }
        }

        // 3. Récupération des images avec filtrage STRICT par catégorie
        $images = PublicImage::with(['category', 'tags'])
            ->when($currentCategory, function ($query) use ($currentCategory) {
                // Si on est dans une galerie spécifique, on ne prend QUE ses images
                return $query->where('category_id', $currentCategory->id);
            })
            ->latest()
            ->get();

        // 4. Récupération des tags (tous, ou filtrés si tu préfères plus tard)
        $tags = Tag::all();

        return Inertia::render('Portfolio/Index', [
            'images' => $images,
            'categories' => $categories,
            'tags' => $tags,
            'activeCategoryId' => $currentCategory ? $currentCategory->id : 'all'
        ]);
    }
}