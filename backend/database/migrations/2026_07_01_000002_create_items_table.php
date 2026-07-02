<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Catalogue synchronisé depuis /v2/items (GW2 API).
     *
     * `details` regroupe en un seul JSON toutes les données spécifiques
     * au type d'objet (arme, armure, amélioration, upgrade infusé...) —
     * un champ plutôt que dix tables par sous-type, pour rester scalable
     * et éviter la duplication de structure entre sous-types.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table): void {
            $table->id();

            $table->unsignedInteger('gw2_id')->unique();
            $table->string('name', 255);
            $table->string('icon_url', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('chat_link', 100)->nullable();

            $table->string('type', 50);
            $table->string('rarity', 20);
            $table->unsignedTinyInteger('level')->default(0);
            $table->unsignedInteger('vendor_value')->default(0);

            // Dérivé des `flags` GW2 au moment du sync — filtrage rapide
            // sans avoir à parser le JSON à chaque requête.
            $table->string('binding', 20)->default('none');

            $table->json('game_types')->nullable();
            $table->json('flags')->nullable();
            $table->json('restrictions')->nullable();
            $table->json('details')->nullable();

            // unsignedInteger (pas foreignId/unsignedBigInteger) : doit correspondre
            // au type de item_stat_sets.id, qui réutilise l'id GW2 (unsignedInteger).
            $table->unsignedInteger('stat_set_id')->nullable();
            $table->foreign('stat_set_id')->references('id')->on('item_stat_sets')->nullOnDelete();

            // Contenu curé manuellement (pas de scraping automatique du wiki).
            $table->text('wiki_obtain')->nullable();
            $table->string('wiki_url', 500)->nullable();

            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('rarity');
            $table->index('level');
            $table->index('binding');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
