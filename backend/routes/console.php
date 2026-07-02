<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Resynchronise le catalogue d'objets GW2 (nouveaux objets, changements
// d'équilibrage) et réindexe Meilisearch — encyclopédie d'objets.
Schedule::command('items:sync')->daily();
