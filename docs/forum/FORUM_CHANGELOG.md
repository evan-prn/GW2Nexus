# Forum Changelog - GW2Nexus

## 2026-06-04 - Etape 1 - Documentation forum initiale

Fichiers modifies:

- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`
- `docs/forum/FORUM_API.md`

Resume:

- Creation du dossier `docs/forum`.
- Creation de la documentation initiale du module Forum.
- Definition de l'architecture cible.
- Definition des endpoints API prevus.
- Decoupage du plan en etapes validables.

Raison:

- Poser un cadre clair avant toute modification applicative Laravel ou React.

Commandes executees:

- `git status --short`

Resultat des tests:

- Documentation uniquement.
- Aucun test applicatif necessaire a cette etape.

Problemes restants:

- Les migrations forum ne sont pas encore creees.
- Les modeles forum ne sont pas encore crees.
- Les routes API forum ne sont pas encore implementees.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-04 - Etape 2 - Backend base de donnees forum

Fichiers modifies:

- `backend/database/migrations/2026_06_04_000001_create_forum_categories_table.php`
- `backend/database/migrations/2026_06_04_000002_create_forum_threads_table.php`
- `backend/database/migrations/2026_06_04_000003_create_forum_posts_table.php`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Creation de la migration `forum_categories`.
- Creation de la migration `forum_threads`.
- Creation de la migration `forum_posts`.
- Ajout des index utiles pour les listes de categories, sujets et reponses.
- Utilisation de `restrictOnDelete` vers `users` pour conserver le contenu forum avec les soft deletes existants.

Raison:

- Poser la structure SQL minimale avant les modeles Eloquent et les endpoints API.

Commandes executees:

- `docker compose exec laravel php artisan migrate`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan route:list`

Resultat des tests:

- Migrations executees avec succes:
  - `2026_06_04_000001_create_forum_categories_table`
  - `2026_06_04_000002_create_forum_threads_table`
  - `2026_06_04_000003_create_forum_posts_table`
- Tests Laravel: 18 passed, 59 assertions.
- Route list: 26 routes existantes affichees. Aucune route forum attendue a cette etape.

Problemes restants:

- Les modeles forum ne sont pas encore crees.
- Les routes API forum ne sont pas encore implementees.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-04 - Etape 3 - Modeles Laravel et relations forum

Fichiers modifies:

- `backend/app/Models/ForumCategory.php`
- `backend/app/Models/ForumThread.php`
- `backend/app/Models/ForumPost.php`
- `backend/app/Models/User.php`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Creation du modele `ForumCategory`.
- Creation du modele `ForumThread`.
- Creation du modele `ForumPost`.
- Ajout des relations `forumThreads()` et `forumPosts()` sur `User`.
- Ajout des scopes utiles pour les categories et sujets.

Raison:

- Connecter les tables forum a Eloquent avant les seeders et les endpoints API.

Commandes executees:

- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan tinker --execute="App\\Models\\ForumCategory::query()->count(); App\\Models\\ForumThread::query()->count(); App\\Models\\ForumPost::query()->count();"`
- `docker compose exec laravel sh -lc "HOME=/var/www/html php artisan tinker --execute='...'"`
- `docker compose exec laravel php artisan migrate:status`
- `docker compose exec laravel php -r "require 'vendor/autoload.php'; echo class_exists(...);"`

Resultat des tests:

- Tests Laravel: 18 passed, 59 assertions.
- Tinker direct: echec environnemental car PsySH tente d'ecrire dans `/.config/psysh`.
- Tinker avec `HOME=/var/www/html`: echec de quoting shell, sans impact applicatif.
- `migrate:status`: les trois migrations forum sont au statut `Ran`.
- Autoload Composer: `forum models ok`.

Problemes restants:

- Le seeder de categories forum n'est pas encore cree.
- Les routes API forum ne sont pas encore implementees.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-04 - Etape 4 - Seeder des categories forum

Fichiers modifies:

- `backend/database/seeders/ForumCategorySeeder.php`
- `backend/database/seeders/DatabaseSeeder.php`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Creation du seeder `ForumCategorySeeder`.
- Ajout des categories initiales `general`, `builds`, `guildes`, `objets`, `evenements` et `support`.
- Utilisation de `updateOrCreate` pour rendre le seeder idempotent.
- Appel du seeder forum depuis `DatabaseSeeder`.

Raison:

- Fournir des donnees de depart pour les futures routes API et pages React du forum.

Commandes executees:

- `docker compose exec laravel php artisan db:seed --class=ForumCategorySeeder`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- `docker compose exec -e HOME=/var/www/html laravel php artisan tinker --execute "dump(App\\Models\\ForumCategory::query()->count());"`
- `docker compose exec -e HOME=/var/www/html laravel php artisan tinker --execute "dump(App\\Models\\ForumCategory::query()->ordered()->pluck('slug')->all());"`
- `docker compose exec laravel php artisan test`
- `git status --short`

Resultat des tests:

- Seeder court `--class=ForumCategorySeeder`: commande acceptee, mais aucune categorie creee dans l'environnement Docker.
- Seeder namespace `--class=Database\\Seeders\\ForumCategorySeeder`: execution OK.
- Categories creees: 6.
- Slugs verifies dans l'ordre: `general`, `builds`, `guildes`, `objets`, `evenements`, `support`.
- Idempotence verifiee: apres relance du seeder, le compteur reste a 6 categories.
- Tests Laravel: 18 passed, 59 assertions.
- Point restant: Tinker recree `backend/.config/psysh/psysh_history`, artefact local a nettoyer avec validation dediee.

Problemes restants:

- Les routes API forum ne sont pas encore implementees.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-04 - Etape 5 - API publique de lecture forum

Fichiers modifies:

- `backend/routes/api.php`
- `backend/app/Http/Controllers/Api/Forum/ForumCategoryController.php`
- `backend/app/Http/Controllers/Api/Forum/ForumThreadController.php`
- `backend/app/Http/Controllers/Api/Forum/ForumPostController.php`
- `backend/app/Http/Resources/ForumCategoryResource.php`
- `backend/app/Http/Resources/ForumThreadResource.php`
- `backend/app/Http/Resources/ForumPostResource.php`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout des routes publiques de lecture sous `/api/v1/forum`.
- Ajout du listing des categories actives.
- Ajout du detail d'une categorie par slug.
- Ajout du listing pagine des sujets d'une categorie.
- Ajout du detail d'un sujet par slug avec incrementation des vues.
- Ajout du listing pagine des posts d'un sujet.
- Ajout de Resources Laravel pour controler les champs exposes.
- Ajout de `threads_count` et `posts_count` sur les categories.

Raison:

- Fournir la base API publique necessaire avant l'integration frontend du forum.

Commandes executees:

- `docker compose exec laravel php artisan route:list`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/forum/categories -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/forum/categories/general -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/forum/categories/general/threads -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/forum/categories/inconnue -UseBasicParsing`

Resultat des tests:

- Route list: 31 routes, dont 5 routes publiques forum.
- Tests Laravel: 18 passed, 59 assertions.
- `GET /api/v1/forum/categories`: HTTP 200, 6 categories retournees.
- `GET /api/v1/forum/categories/general`: HTTP 200.
- `GET /api/v1/forum/categories/general/threads`: HTTP 200 avec pagination vide.
- `GET /api/v1/forum/categories/inconnue`: HTTP 404.
- Note: les tests existants utilisent `RefreshDatabase`; il faut reseeder les categories apres les tests pour verifier les endpoints avec donnees.

Problemes restants:

- Les routes API d'ecriture forum ne sont pas encore implementees.
- Les pages React forum ne sont pas encore implementees.
