<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profils_gw2', function (Blueprint $table) {
            $table->id();

            // Relation 1-1 avec utilisateurs
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->string('nom_compte', 100)->nullable();   // format: Nom.1234
            $table->string('monde', 100)->nullable();        // ex: Piken Square
            $table->json('personnages')->nullable();          // [{nom, race, profession, niveau}]
            $table->timestamp('derniere_synchro')->nullable();
            $table->boolean('valide')->default(false);       // clé API opérationnelle

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profils_gw2');
    }
};