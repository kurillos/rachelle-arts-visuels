<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class GalleryPhoto extends Model
{
    protected $fillable = ['gallery_id', 'image_path', 'title', 'is_selected', 'sort_order'];

    protected $casts = [
        'is_selected' => 'boolean',
    ];

    protected $appends = ['full_url'];

    // Accessor pour obtenir l'URL S3 complète facilement
    public function getFullUrlAttribute()
    {
        return \Storage::disk('s3')->temporaryUrl(
            $this->image_path, 
            now()->addMinutes(20)
        );
    }

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }
}