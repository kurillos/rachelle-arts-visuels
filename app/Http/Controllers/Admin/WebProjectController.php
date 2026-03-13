<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WebProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/WebProjects/Index', [
            'projects' => WebProject::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url_site' => 'required|url',
            'description' => 'required',
            'tech_stack' => 'required',
            'role_graphiste' => 'required',
            'role_dev' => 'required',
            'image' => 'required|image|max:102400',
        ]);

        // Upload sur S3 (ton node eu-north-1)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('web-portfolio', 's3');
            $validated['cover_image'] = Storage::disk('s3')->url($path);
        }

        WebProject::create($validated);

        return redirect()->back()->with('success', 'Projet ajouté avec succès !');
    }
}