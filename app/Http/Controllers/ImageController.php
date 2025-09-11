<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ImageController extends Controller
{
    /**
     * Affiche l'image depuis le dossier public.
     *
     * @param string $filename Le nom du fichier image.
     * @return \Illuminate\Http\Response
     */
    public function show($filename)
    {
        $path = public_path('images/carousels/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = file_get_contents($path);
        $type = mime_content_type($path);

        return Response::make($file, 200)->header("Content-Type", $type);
    }
}
