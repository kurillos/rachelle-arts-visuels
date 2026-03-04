<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tag extends Model
{
    protected $fillable = ['name', 'slug'];

    // Relation : Un tag appartient à plusieurs images (Many-to-Many)
    public function publicImages()
    {
        return $this->belongsToMany(PublicImage::class, 'public_image_tag');
    }

    protected static function boot() {
        parent::boot();
        static::creating(fn ($tag) => $tag->slug = Str::slug($tag->name));
    }
}