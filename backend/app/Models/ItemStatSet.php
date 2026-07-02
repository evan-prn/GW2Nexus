<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Miroir de /v2/itemstats — table de référence pour les combinaisons
 * de statistiques d'équipement (Berserker, Zieveur, etc.).
 */
class ItemStatSet extends Model
{
    public $incrementing = false;

    protected $keyType = 'int';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'name',
        'attributes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attributes' => 'array',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'stat_set_id');
    }
}
