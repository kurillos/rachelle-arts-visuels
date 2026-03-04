<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PublicImage;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicImageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Portfolio/Index', [
            'images' => PublicImage::with(['category', 'tags'])->latest()->get(),
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'activeCategoryId' => 'all',
            'isAdmin' => true
        ]);
    }

    public function show($slug) {
        return $this->renderPortfolio($slug); // Affiche la catégorie
    }

    private function renderPortfolio($slug = null) {
        $categories = Category::all();
        $currentCategory = $slug ? Category::where('name', 'LIKE', $slug)->first() : null;

        return Inertia::render('Portfolio/Index', [
            'images' => PublicImage::with(['category', 'tags'])
                ->when($currentCategory, function($query) use ($currentCategory) {
                    return $query->where('category_id', $currentCategory->id);
                })
                ->latest()
                ->get(),
            'categories' => $categories,
            'tags' => Tag::all(),
            'initialCategory' => $currentCategory ? $currentCategory->id : 'all'
        ]);
    }

    public function update(Request $request, PublicImage $image) {
        $image->update([
            'title' => $request->title,
            'category_id' => $request->category_id
        ]);
    
        // Synchronisation des tags
        $image->tags()->sync($request->tag_ids);
    
        return back();
    }
}