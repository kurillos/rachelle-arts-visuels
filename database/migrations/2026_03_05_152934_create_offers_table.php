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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ex: Pack Naissance, Portrait Solo, etc.
            $table->integer('quota'); // Nombre de photos incluses
            $table->text('description')->nullable(); // Détails de ce que contient l'offre
            $table->decimal('price', 8, 2)->nullable(); // Juste pour info si besoin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
