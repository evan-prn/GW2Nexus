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
        Schema::create('users', function (Blueprint $table) {
            // Clé primaire
            $table->id();

            // Identité
            $table->string('nom', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255);

            // Profil GW2
            $table->string('pseudo_gw2', 100)->nullable();
            $table->string('avatar', 500)->nullable();

            // Rôle — enum aligné sur le dictionnaire de données
            $table->enum('role', ['user', 'moderateur', 'admin'])->default('user');

            // Clé API GW2 — 72 chars, stockée chiffrée (AES-256 via encrypt())
            // Pas de contrainte UNIQUE : plusieurs NULL autorisés, et la validation
            // métier se fait au niveau applicatif (Gw2ApiService)
            $table->string('api_key', 72)->nullable();

            // Vérification email (standard Laravel)
            $table->timestamp('email_verified_at')->nullable();

            // "Se souvenir de moi" (standard Laravel)
            $table->rememberToken();

            // Timestamps et soft delete (requis par le MLD)
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};