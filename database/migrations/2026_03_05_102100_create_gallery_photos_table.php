<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('gallery_photos', function (Blueprint $table) {
            $table->id();
            // Le onDelete('cascade') est vital : si on supprime la galerie, les photos partent avec
            $table->foreignId('gallery_id')->constrained()->onDelete('cascade');
            $table->string('image_path'); // Chemin vers S3
            $table->string('title')->nullable();
            $table->boolean('is_selected')->default(false); // LA SÉLECTION CLIENT
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_photos');
    }
};
