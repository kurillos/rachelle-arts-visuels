<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryTagController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/CategoriesTags', [
            'categories' => Category::all(),
            'tags' => Tag::all()
        ]);
    }

    // Ajouter une catégorie
    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|max:50|unique:categories']);
        Category::create(['name' => $request->name]);
        return redirect()->back()->with('success', 'Catégorie ajoutée');
    }

    // Ajouter un tag
    public function storeTag(Request $request)
    {
        $request->validate(['name' => 'required|string|max:50|unique:tags']);
        Tag::create(['name' => $request->name]);
        return redirect()->back()->with('success', 'Filtre ajouté');
    }

    // Supprimer une catégorie
    public function destroyCategory(Category $category)
    {
        // Optionnel: vérifier si des images sont liées avant de supprimer
        $category->delete();
        return redirect()->back()->with('success', 'Catégorie supprimée');
    }

    // Supprimer un tag (filtre)
    public function destroyTag(Tag $tag)
    {
        $tag->delete();
        return redirect()->back()->with('success', 'Filtre supprimé');
    }

    // Modifier une catégorie
    public function updateCategory(Request $request, Category $category)
    {
        $request->validate(['name' => 'required|string|max:50|unique:categories,name,'.$category->id]);
        $category->update(['name' => $request->name]);
        return redirect()->back()->with('success', 'Catégorie renommée');
    }

    // Modifier un tag
    public function updateTag(Request $request, Tag $tag)
    {
        $request->validate(['name' => 'required|string|max:50|unique:tags,name,'.$tag->id]);
        $tag->update(['name' => $request->name]);
        return redirect()->back()->with('success', 'Filtre renommé');
    }
}