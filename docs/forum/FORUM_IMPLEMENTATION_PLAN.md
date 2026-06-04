# Forum Implementation Plan - GW2Nexus

Date: 2026-06-04

## Statuts possibles

- A faire
- A valider
- Validee
- Appliquee
- Bloquee
- Annulee

## Etape 1 - Documentation forum initiale

Statut: Appliquee

Objectif:

- Creer la documentation de reference du module Forum.

Fichiers concernes:

- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`
- `docs/forum/FORUM_API.md`

Critere de validation:

- Les quatre fichiers existent.
- Le plan est decoupe en etapes validables.
- Aucun code applicatif n'est modifie.

Risques:

- Aucun risque applicatif.

Commandes prevues:

- `git status --short`

## Etape 2 - Backend base de donnees

Statut: Appliquee

Objectif:

- Creer les migrations des tables forum.

Fichiers cibles:

- `backend/database/migrations/*_create_forum_categories_table.php`
- `backend/database/migrations/*_create_forum_threads_table.php`
- `backend/database/migrations/*_create_forum_posts_table.php`

Critere de validation:

- Les migrations s'executent.
- Les relations de cle etrangere sont coherentes.
- Les index utiles sont presents.

Risques:

- Migration incorrecte sur une base existante.
- Suppression en cascade mal choisie.

Commandes prevues:

- `docker compose exec laravel php artisan migrate`
- `docker compose exec laravel php artisan test`

## Etape 3 - Modeles Laravel et relations

Statut: Appliquee

Objectif:

- Creer les modeles Eloquent du forum.
- Ajouter les relations forum sur `User`.

Fichiers cibles:

- `backend/app/Models/ForumCategory.php`
- `backend/app/Models/ForumThread.php`
- `backend/app/Models/ForumPost.php`
- `backend/app/Models/User.php`

Critere de validation:

- Relations Eloquent fonctionnelles.
- Aucun champ sensible expose.
- Tests backend OK.

Commandes prevues:

- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan tinker --execute="App\\Models\\ForumCategory::query()->count(); App\\Models\\ForumThread::query()->count(); App\\Models\\ForumPost::query()->count();"`

## Etape 4 - Seeder des categories forum

Statut: Appliquee

Objectif:

- Creer les categories de depart du forum.

Fichiers cibles:

- `backend/database/seeders/ForumCategorySeeder.php`
- `backend/database/seeders/DatabaseSeeder.php`

Categories prevues:

- General
- Builds
- Guildes
- Objets
- Evenements
- Support

Critere de validation:

- Seeder executable.
- Categories creees sans doublon.

Commandes prevues:

- `docker compose exec laravel php artisan db:seed --class=ForumCategorySeeder`
- `docker compose exec laravel php artisan test`

## Etape 5 - API publique de lecture

Statut: Appliquee

Objectif:

- Exposer les endpoints publics de lecture forum.

Fichiers cibles:

- `backend/routes/api.php`
- `backend/app/Http/Controllers/Api/Forum/*`
- `backend/app/Http/Resources/Forum*Resource.php`

Critere de validation:

- `route:list` affiche les routes forum.
- Les listes sont paginees quand necessaire.
- Les reponses JSON suivent le style existant.

Commandes prevues:

- `docker compose exec laravel php artisan route:list`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/forum/categories -UseBasicParsing`

## Etape 6 - API authentifiee d'ecriture

Statut: A valider

Objectif:

- Permettre creation de sujets, reponses, edition et suppression de posts.

Fichiers cibles:

- `backend/app/Http/Requests/Forum/*`
- `backend/app/Http/Controllers/Api/Forum/*`
- `backend/routes/api.php`

Critere de validation:

- 401 si non connecte.
- 403 si action interdite.
- 422 si validation echoue.
- Sujet verrouille refuse les reponses.

## Etape 7 - Frontend API, types et hooks

Statut: A faire

Objectif:

- Creer la couche TypeScript du forum.

Fichiers cibles:

- `frontend/src/types/forum.types.ts`
- `frontend/src/api/forum.api.ts`
- `frontend/src/hooks/forum/*`
- `frontend/src/api/endpoint.ts`

Critere de validation:

- Appels API centralises.
- Types explicites.
- Gestion d'erreurs exploitable par l'UI.

## Etape 8 - Pages publiques forum

Statut: A faire

Objectif:

- Implementer les pages de lecture.

Routes:

- `/forum`
- `/forum/:categorySlug`
- `/forum/thread/:threadSlug`

Critere de validation:

- Lecture publique sans authentification.
- Design coherent avec GW2Nexus.
- Etats loading, empty et error presents.

## Etape 9 - Creation de sujet et reponse

Statut: A faire

Objectif:

- Ajouter les formulaires connectes.

Routes:

- `/forum/new/:categorySlug`

Critere de validation:

- Formulaire de creation sujet fonctionnel.
- Formulaire de reponse fonctionnel.
- Erreurs Laravel 422 affichees proprement.
- Redirection vers le sujet cree.

## Etape 10 - Preparation moderation

Statut: A faire

Objectif:

- Preparer les actions futures de moderation sans les sur-implementer.

Actions futures:

- verrouiller un sujet.
- epingler un sujet.
- supprimer un sujet.
- moderer les posts.

Critere de validation:

- Le code MVP reste simple.
- Les roles `moderateur` et `admin` sont pris en compte pour les evolutions.
