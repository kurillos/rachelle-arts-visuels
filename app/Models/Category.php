<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = ['name', 'slug'];

    // Relation : Une catégorie a plusieurs images
    public function publicImages()
    {
        return $this->hasMany(PublicImage::class);
    }

    // Auto-génère le slug à la création
    protected static function boot() {
        parent::boot();
        static::creating(fn ($category) => $category->slug = Str::slug($category->name));
    }
}