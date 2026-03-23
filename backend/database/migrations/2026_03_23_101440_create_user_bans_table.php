<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Création de la table user_bans.
 *
 * Stocke l'historique complet des sanctions appliquées aux utilisateurs.
 * Cette approche par table dédiée (vs colonne sur users) permet :
 *   - un historique complet et auditable de toutes les sanctions
 *   - une distinction claire ban temporaire / permanent
 *   - une réversibilité propre sans altérer le modèle User
 *   - l'ajout futur de features (avertissements, appels, etc.)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_bans', function (Blueprint $table): void {
            // Identifiant unique de la sanction
            $table->id();

            // Utilisateur sanctionné
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Administrateur ayant appliqué la sanction
            $table->foreignId('banned_by')
                ->constrained('users')
                ->restrictOnDelete();

            // Type de ban : temporary | permanent
            $table->enum('type', ['temporary', 'permanent'])
                ->default('temporary');

            // Motif de la sanction (obligatoire pour la traçabilité)
            $table->string('reason', 500);

            // Date d'expiration — null = ban permanent
            $table->timestamp('expires_at')->nullable();

            // Date à laquelle le ban a été levé manuellement (unban)
            $table->timestamp('lifted_at')->nullable();

            // Admin ayant levé la sanction
            $table->foreignId('lifted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();

            // Index pour la vérification rapide du statut de ban d'un user
            $table->index(['user_id', 'lifted_at', 'expires_at'], 'idx_bans_user_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_bans');
    }
};
