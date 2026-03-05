<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // On ajoute le status avec 'brouillon' par défaut
            $table->string('status')->default('brouillon')->after('type');
        
            // On ajoute aussi un champ pour les notes du client (pour ses demandes de retouches)
            $table->text('client_notes')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropColumn(['status', 'client_notes']);
        });
    }
};
