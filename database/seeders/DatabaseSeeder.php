<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Création des Catégories
        $categories = [
            'Photographie', 
            'Faire-part', 
            'Logo & Graphisme', 
            'Mise en page'
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate([
                'name' => $cat,
                'slug' => str()->slug($cat)
            ]);
        }

        // Création des Tags de filtres
        $tags = [
            'Lueurs Sauvages', 
            'Compagnons de vie', 
            'Promesses d\'unions', 
            'Contes d\'hiver', 
            'Instants divers'
                ];
        foreach ($tags as $tagName) {
            Tag::firstOrCreate([
                'name' => $tagName,
                'slug' => str()->slug($tagName)
            ]);
        }

        // Optionnel : Création d'un utilisateur admin si besoin
        // User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        // ]);
    }
}
