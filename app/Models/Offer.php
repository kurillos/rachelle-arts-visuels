<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offer extends Model
{
    protected $fillable = ['name', 'quota', 'description', 'price'];

    // Une offre peut être liée à plusieurs galeries
    public function galleries(): HasMany
    {
        return $this->hasMany(Gallery::class);
    }
}