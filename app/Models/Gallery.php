<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'password', 'event_date'];

    // Génère un slug automatique avant la création
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($gallery) {
            $gallery->slug = Str::slug($gallery->title) . '-' . rand(1000, 9999);
        });
    }

    // Relation : Une galerie a plusieurs photos
    public function photos()
    {
        return $this->hasMany(GalleryPhoto::class);
    }
}