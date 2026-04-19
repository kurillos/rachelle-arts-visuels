<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class GalleryPhoto extends Model
{
    protected $fillable = [
        'gallery_id',
        'image_path',
        'title',
        'is_selected',
        'sort_order',
        'client_comment', // ← ajouté : nécessaire pour sauvegarder les commentaires clients
    ];

    protected $casts = [
        'is_selected' => 'boolean',
    ];

    protected $appends = ['full_url'];

    /**
     * Génère une URL S3 signée temporaire avec mise en cache (15 min).
     * Évite de multiplier les appels AWS à chaque render de page.
     */
    public function getFullUrlAttribute(): string
    {
        return Cache::remember(
            "photo_url_{$this->id}",
            now()->addMinutes(15),
            fn () => Storage::disk('s3')->temporaryUrl(
                $this->image_path,
                now()->addMinutes(20)
            )
        );
    }

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }
}
