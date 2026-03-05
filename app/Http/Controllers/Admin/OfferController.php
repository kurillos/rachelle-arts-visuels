<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Offers/Index', [
            'offers' => Offer::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
        ]);

        Offer::create($validated);
        return redirect()->back()->with('success', 'Offre créée !');
    }

    public function destroy(Offer $offer)
    {
        $offer->delete();
        return redirect()->back()->with('success', 'Offre supprimée.');
    }
}