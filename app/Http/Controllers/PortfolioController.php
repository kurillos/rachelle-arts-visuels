<?php

namespace App\Http\Controllers;

use App\Models\PublicImage;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        return $this->renderGallery();
    }

    public function show($slug)
    {
        return $this->renderGallery($slug);
    }

    private function renderGallery($slug = null)
{
    $categories = Category::all();
    
    // On cherche la catégorie
    $currentCategory = $slug 
        ? Category::whereRaw('LOWER(name) = ?', [strtolower($slug)])->first() 
        : null;

    // IMPORTANT : Si on ne trouve pas de catégorie alors qu'un slug est fourni
    // on redirige vers l'index pour éviter de rester bloqué
    if ($slug && !$currentCategory) {
        return redirect()->route('portfolio.index');
    }

    return Inertia::render('Portfolio/Index', [
        'images' => PublicImage::with(['category', 'tags'])
            ->when($currentCategory, function ($query) use ($currentCategory) {
                return $query->where('category_id', $currentCategory->id);
            })
            ->latest()
            ->get(),
        'categories' => $categories,
        'tags' => Tag::all(),
        'activeCategoryId' => $currentCategory ? $currentCategory->id : 'all'
    ]);
}
}