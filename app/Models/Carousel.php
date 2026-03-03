<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Carousel extends Model
{
    use HasFactory;

    // Autorisation du stockage du chemin S3
    protected $fillable = [
        'image_path', 
        'title',
        'description',
    ];

    // On ajoute 'image_url' dynamiquement aux données envoyées à React
    protected $appends = ['image_url'];

    /**
     * Accesseur qui transforme le chemin interne en URL publique S3.
     */
    public function getImageUrlAttribute()
    {
        // Si le chemin existe, on demande au disque S3 l'URL complète
        if ($this->image_path) {
            return Storage::disk('s3')->url($this->image_path);
        }
        return null;
    }
}