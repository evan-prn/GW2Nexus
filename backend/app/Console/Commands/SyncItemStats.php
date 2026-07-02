<?php

namespace App\Console\Commands;

use App\Services\Gw2ItemSyncService;
use Illuminate\Console\Command;

class SyncItemStats extends Command
{
    protected $signature = 'items:sync-stats';

    protected $description = "Synchronise /v2/itemstats (combinaisons de statistiques d'équipement) — à lancer avant items:sync";

    public function handle(Gw2ItemSyncService $sync): int
    {
        $this->info('Synchronisation des itemstats GW2...');

        $count = $sync->syncStatSets();

        $this->info("{$count} itemstats synchronisés.");

        return self::SUCCESS;
    }
}
