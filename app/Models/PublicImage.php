<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PublicImage extends Model
{
    protected $fillable = ['category_id', 'image_path', 'title'];

    // Relation vers la catégorie
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relation vers les tags (Many-to-Many)
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'public_image_tag');
    }

    // Petit bonus : un attribut pour avoir l'URL S3 directement
    public function getImageUrlAttribute()
    {
        return Storage::disk('s3')->url($this->image_path);
    }
}