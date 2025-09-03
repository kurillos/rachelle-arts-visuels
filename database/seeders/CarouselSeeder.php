<?php

namespace Database\Seeders;

use App\Models\Carousel;
use Illuminate\Database\Seeder;

class CarouselSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Carousel::create([
            'image_url' => 'https:via.placeholder.com/1200x800.png?tecxt=Image+1',
            'title' => 'Titre de l\'image 1',
            'description' => 'Description de l\'image 1',
        ]);

        Carousel::create([
            'image_url' => 'https:via.placeholder.com/1200x800.png?tecxt=Image+2',
            'title' => 'Titre de l\'image 2',
            'description' => 'Description de l\'image 2',
        ]);

        Carousel::create([
            'image_url' => 'https:via.placeholder.com/1200x800.png?tecxt=Image+3',
            'title' => 'Titre de l\'image 3',
            'description' => 'Description de l\'image 3',
        ]);
    }
}