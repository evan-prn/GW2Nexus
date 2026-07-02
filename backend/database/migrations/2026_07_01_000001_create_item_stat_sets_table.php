<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Miroir de /v2/itemstats — table de référence (~300 lignes),
     * synchronisée via `items:sync-stats` avant `items:sync`.
     */
    public function up(): void
    {
        Schema::create('item_stat_sets', function (Blueprint $table): void {
            // Pas d'auto-increment : on réutilise l'id GW2 tel quel,
            // c'est la clé stable partagée avec l'API officielle.
            $table->unsignedInteger('id')->primary();
            $table->string('name', 150);
            $table->json('attributes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_stat_sets');
    }
};
