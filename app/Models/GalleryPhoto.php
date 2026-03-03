<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryPhoto extends Model
{
    protected $fillable = ['gallery_id', 'image_path', 'title'];

    public function gallery()
    {
        return $this->belongsTo(Gallery::class);
    }
}