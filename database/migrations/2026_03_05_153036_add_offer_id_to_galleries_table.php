<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // On ajoute la clé étrangère. On laisse nullable pour ne pas casser les galeries existantes.
            $table->foreignId('offer_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropForeign(['offer_id']);
            $table->dropColumn('offer_id');
        });
    }
};
