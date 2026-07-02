<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\ItemStatSet;
use App\Services\Gw2ItemSyncService;
use Illuminate\Console\Command;

class SyncItems extends Command
{
    protected $signature = 'items:sync
        {--limit= : Ne synchronise que les N premiers objets (utile pour valider en dev)}
        {--ids= : Liste d\'IDs GW2 séparés par des virgules — restreint la sync à ces objets}
        {--no-index : Synchronise MySQL sans réindexer Meilisearch (utile en itérations rapides)}';

    protected $description = "Synchronise le catalogue d'objets GW2 (/v2/items) vers MySQL puis réindexe Meilisearch";

    public function handle(Gw2ItemSyncService $sync): int
    {
        if (ItemStatSet::count() === 0) {
            $this->warn("Aucun itemstat en base — lancez d'abord `items:sync-stats` pour que les items d'équipement soient rattachés à leurs statistiques.");
        }

        $onlyIds = $this->option('ids')
            ? array_map('intval', explode(',', (string) $this->option('ids')))
            : null;

        $limit = $this->option('limit') !== null ? (int) $this->option('limit') : null;

        $this->info($onlyIds !== null
            ? 'Synchronisation de '.count($onlyIds).' objet(s) spécifique(s)...'
            : 'Récupération de la liste complète des objets GW2...');

        $startedAt = now();
        $bar = null;

        $synced = $sync->syncItems($onlyIds, $limit, function (int $done, int $total) use (&$bar): void {
            if ($bar === null) {
                $bar = $this->output->createProgressBar($total);
                $bar->start();
            }
            $bar->setProgress($done);
        });

        $bar?->finish();
        $this->newLine();
        $this->info("{$synced} objets synchronisés en base.");

        if ($this->option('no-index')) {
            return self::SUCCESS;
        }

        $this->info('Indexation Meilisearch...');
        $indexed = 0;

        Item::query()
            ->where('synced_at', '>=', $startedAt)
            ->orderBy('id')
            ->chunkById(500, function ($items) use (&$indexed): void {
                $items->searchable();
                $indexed += $items->count();
            });

        $this->info("{$indexed} objets indexés dans Meilisearch.");

        return self::SUCCESS;
    }
}
