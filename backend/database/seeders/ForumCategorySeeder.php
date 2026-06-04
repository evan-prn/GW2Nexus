<?php

namespace Database\Seeders;

use App\Models\ForumCategory;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'General',
                'slug' => 'general',
                'description' => 'Discussions generales autour de Guild Wars 2 et de la communaute GW2Nexus.',
                'icon' => 'message-circle',
                'position' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Builds',
                'slug' => 'builds',
                'description' => 'Partage de builds, optimisations, rotations et conseils de profession.',
                'icon' => 'shield',
                'position' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Guildes',
                'slug' => 'guildes',
                'description' => 'Recrutement, presentation de guildes et organisation communautaire.',
                'icon' => 'castle',
                'position' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Objets',
                'slug' => 'objets',
                'description' => 'Discussions sur les objets, skins, collections et recompenses.',
                'icon' => 'gem',
                'position' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Evenements',
                'slug' => 'evenements',
                'description' => 'Organisation de sorties, world bosses, metas et activites en jeu.',
                'icon' => 'map',
                'position' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Support',
                'slug' => 'support',
                'description' => 'Aide, questions techniques et signalement de problemes sur GW2Nexus.',
                'icon' => 'help-circle',
                'position' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ForumCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
