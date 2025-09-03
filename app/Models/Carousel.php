<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carousel extends Model
{
    use HasFactory;

    /**
     * Le nom de la collection associée au modèle.
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'image_url',
        'title',
        'description',
    ];
}
