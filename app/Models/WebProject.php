<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebProject extends Model
{
    protected $fillable = [
        'title', 
        'url_site', 
        'description', 
        'cover_image', 
        'tech_stack', 
        'role_graphiste', 
        'role_dev'
    ];
}
