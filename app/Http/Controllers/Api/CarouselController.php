<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Illuminate\Http\Request;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // retourne toutes les images du carousel
        return Carousel::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Valide les données de la requête
        $request->validate([
            'image_url' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $carousel = Carousel::create($request->all());

        return response()->json($carousel, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Carousel $carousel)
    {
        return $carousel;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carousel $carousel)
    {
        $request->validate([
            'image_url' => 'required|string',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $carousel->update($request->all());

        return response()->json($carousel, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carousel $carousel)
    {
        // Supprime l'entrée du carousel
        $carousel->delete();

        return response()->json(null, 204);
    }
}
