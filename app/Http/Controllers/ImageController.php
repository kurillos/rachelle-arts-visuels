<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ImageController extends Controller
{
    /**
     * Affiche le formulaire de téléchargement.
     *
     * @return \Inertia\Response
     */
    public function showUploadForm()
    {
        return Inertia::render('UploadForm');
    }
}
