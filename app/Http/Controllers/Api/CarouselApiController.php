<?php

namespace App\Http\Controllers\Api;

use App\Models\Carousel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class CarouselController extends Controller
{
    
    public function create()
    {
        return view('admin.carousels.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Gérer le téléchargement de l'image
        // On stocke l'image et on garde le chemin relatif
        $path = $request->file('image')->store('public/images/carousels');
        
        // On retire le "public/" pour que l'accesseur du modèle fonctionne
        $relativePath = str_replace('public/', '', $path);
        
        $carouselItem = new Carousel;
        $carouselItem->image_url = $relativePath;
        $carouselItem->title = $request->input('title');
        $carouselItem->description = $request->input('description');
        $carouselItem->save();

        return response()->json($carouselItem, 201);
    }
}
