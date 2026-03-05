<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'client_name',
        'client_email', 
        'type',
        'password',
        'event_date',
        'expires_at', 
        'offer_id',
        'quota',
        'status',
        'client_notes'
    ];

    // Génère un slug automatique avant la création
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($gallery) {
            $gallery->slug = Str::slug($gallery->title) . '-' . rand(1000, 9999);
        });
    }

    protected $casts = [
        'expires_at' => 'datetime',
        'event_date' => 'date',
    ];

    // Relation : Une galerie a plusieurs photos
    public function photos()
    {
        return $this->hasMany(GalleryPhoto::class);
    }

    // Helper pour compter les sélections clients
    public function getFavoritesCountAttribute()
    {
        return $this->photos()->where('is_selected', true)->count();
    }

    // On utilise les "Booted" events pour définir la date à la création
    protected static function booted()
    {
        static::creating(function ($gallery) {
            if (!$gallery->expires_at) {
                $gallery->expires_at = now()->addDays(60);
            }
        });
    }

    /**
    * Helper pour savoir si la galerie est encore valide
    */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }
}