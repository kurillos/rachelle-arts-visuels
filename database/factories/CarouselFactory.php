<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Carousel;

class CarouselFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Générer un chemin d'image local qui sera traité par l'accesseur du modèle
        // Assurez-vous d'avoir des images dans le dossier public/images/carousels
        $imagePath = 'images/carousels/' . $this->faker->numberBetween(1, 6) . '.jpg';
        
        return [
            'image_path' => $imagePath,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(2),
        ];
    }
}
