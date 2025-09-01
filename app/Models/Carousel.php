<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Carousel extends Model
{
    use HasFactory;


    /**
     * La base de données doit utiliser ce modèle.
     *
     * @var string
     */
    protected $connection = 'mongodb';

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
