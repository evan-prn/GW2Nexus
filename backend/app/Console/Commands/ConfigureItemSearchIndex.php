<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Meilisearch\Client;

/**
 * Configure les réglages de l'index Meilisearch `items` (filtres/tri/tolérance
 * aux fautes). Scout ne couvre pas tous ces réglages — on utilise le client
 * Meilisearch directement. À lancer une fois après le premier déploiement
 * (idempotent, peut être relancé sans risque après une modification du schéma).
 */
class ConfigureItemSearchIndex extends Command
{
    protected $signature = 'items:configure-search-index';

    protected $description = "Configure les attributs filtrables/triables et la tolérance aux fautes de l'index Meilisearch des objets";

    public function handle(): int
    {
        $client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key'),
        );

        $index = $client->index('items');

        $index->updateSettings([
            // Champs de recherche texte, par ordre de pertinence.
            'searchableAttributes' => ['name', 'description'],

            // Champs exploitables par les filtres de l'encyclopédie.
            'filterableAttributes' => [
                'type', 'weapon_type', 'armor_type', 'armor_weight',
                'rarity', 'level', 'binding',
                'stat_set_id', 'stat_set_name',
                'restrictions', 'game_types', 'flags',
            ],

            'sortableAttributes' => ['level', 'name'],

            // Tolérance aux fautes de frappe — activée par défaut, réglages explicites
            // pour rester correct même sur les noms d'objets très courts.
            'typoTolerance' => [
                'enabled' => true,
                'minWordSizeForTypos' => [
                    'oneTypo' => 4,
                    'twoTypos' => 8,
                ],
            ],
        ]);

        $this->info("Réglages de l'index `items` appliqués.");

        return self::SUCCESS;
    }
}
