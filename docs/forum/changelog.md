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

## 2026-06-05 - Etape 6 - API authentifiee d'ecriture forum

Fichiers modifies:

- `backend/routes/api.php`
- `backend/app/Http/Controllers/Api/Forum/ForumThreadController.php`
- `backend/app/Http/Controllers/Api/Forum/ForumPostController.php`
- `backend/app/Http/Requests/Forum/StoreForumThreadRequest.php`
- `backend/app/Http/Requests/Forum/StoreForumPostRequest.php`
- `backend/app/Http/Requests/Forum/UpdateForumPostRequest.php`
- `docs/forum/FORUM_API.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout de la creation de sujet authentifiee.
- Creation automatique du premier post lors de la creation d'un sujet.
- Ajout de la creation de reponse authentifiee.
- Ajout de l'edition d'un post.
- Ajout de la suppression d'un post.
- Ajout des Form Requests de validation forum.
- Ajout des routes protegees sous `auth:sanctum` et `ban.check`.
- Ajout d'une transaction pour creer sujet + premier post de maniere atomique.
- Generation de slugs uniques pour les sujets.

Raison:

- Permettre l'ecriture forum cote API avant l'integration frontend.

Commandes executees:

- `docker compose exec laravel php artisan route:list`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario HTTP complet: register, create thread, create reply, update reply, delete reply.
- Verification 401 avec `Accept: application/json`.
- Verification 422 avec payload invalide.

Resultat des tests:

- Route list: 35 routes, dont les routes d'ecriture forum.
- Tests Laravel: 18 passed, 59 assertions.
- Creation de sujet: HTTP 201.
- Creation de reponse: HTTP 201.
- Edition de reponse: HTTP 200.
- Suppression de reponse: HTTP 200.
- Non authentifie avec `Accept: application/json`: HTTP 401.
- Validation invalide: HTTP 422.

Problemes restants:

- Sans header `Accept: application/json`, Laravel peut produire une reponse non adaptee API sur certaines erreurs d'authentification. Le frontend Axios envoie deja ce header, mais un durcissement global dans `bootstrap/app.php` pourra etre propose plus tard.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-05 - Etape 7 - Frontend API, types et hooks forum

Fichiers modifies:

- `frontend/src/types/forum.types.ts`
- `frontend/src/api/endpoint.ts`
- `frontend/src/api/forum.api.ts`
- `frontend/src/hooks/forum/useForumCategories.ts`
- `frontend/src/hooks/forum/useForumThreads.ts`
- `frontend/src/hooks/forum/useForumThread.ts`
- `frontend/src/hooks/forum/useForumMutations.ts`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout des types TypeScript du forum.
- Ajout des endpoints forum centralises dans `ENDPOINTS`.
- Ajout du service `forum.api.ts`.
- Ajout des hooks de lecture pour categories, sujets et posts.
- Ajout du hook `useForumMutations` pour creation, edition et suppression.
- Aucun composant visuel forum cree a cette etape.

Raison:

- Preparer l'integration des pages React du forum avec une couche API typee et testable.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd exec vite build`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- `npm.cmd run build`: echec sur `tsconfig.node.json` avec `TS18003 No inputs were found`.
- `npm.cmd exec vite build` hors sandbox: OK, 228 modules transformed.

Problemes restants:

- `npm run build` reste bloque par la configuration `tsconfig.node.json`, independamment de la couche forum.
- Les pages React forum ne sont pas encore implementees.

## 2026-06-05 - Etape 8 - Pages publiques forum

Fichiers modifies:

- `frontend/src/router/index.tsx`
- `frontend/src/components/forum/ForumBreadcrumbComponent/ForumBreadcrumb.tsx`
- `frontend/src/components/forum/ForumBreadcrumbComponent/ForumBreadcrumb.module.css`
- `frontend/src/components/forum/ForumCategoryCardComponent/ForumCategoryCard.tsx`
- `frontend/src/components/forum/ForumCategoryCardComponent/ForumCategoryCard.module.css`
- `frontend/src/components/forum/ForumThreadCardComponent/ForumThreadCard.tsx`
- `frontend/src/components/forum/ForumThreadCardComponent/ForumThreadCard.module.css`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.tsx`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.module.css`
- `frontend/src/pages/Forum/ForumHomePage/ForumHomePage.tsx`
- `frontend/src/pages/Forum/ForumHomePage/ForumHomePage.module.css`
- `frontend/src/pages/Forum/ForumCategoryPage/ForumCategoryPage.tsx`
- `frontend/src/pages/Forum/ForumCategoryPage/ForumCategoryPage.module.css`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.module.css`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout de la page publique `/forum` listant les categories.
- Ajout de la page publique `/forum/:categorySlug` listant les sujets d'une categorie.
- Ajout de la page publique `/forum/thread/:threadSlug` affichant un sujet et ses posts.
- Ajout des composants de presentation forum: fil d'Ariane, carte categorie, carte sujet et carte post.
- Ajout des routes React publiques du forum.
- Ajout des etats loading, empty et error.
- Suppression du risque de navigation cassee vers `/forum/new/:categorySlug` tant que le formulaire de creation n'est pas implemente.

Raison:

- Rendre la partie lecture du forum consultable cote frontend avant d'ajouter les formulaires connectes.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `npm.cmd exec vite build`
- `Invoke-WebRequest -Uri http://localhost:5174/forum -UseBasicParsing`
- `git status --short --untracked-files=all`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Build Vite direct: OK, 246 modules transformed.
- Verification HTTP `/forum`: HTTP 200.
- Verification navigateur automatique: non executee car aucun outil browser control n'est expose dans cette session.

Problemes restants:

- `npm run build` reste bloque par la configuration `tsconfig.node.json`, deja documentee a l'etape 7.
- Le build Vite direct a regenere `frontend/dist/`; ces artefacts doivent etre nettoyes dans une etape separee apres validation.
- Les formulaires de creation de sujet et de reponse ne sont pas encore implementes.

## 2026-06-05 - Etape 8.1 - Nettoyage des artefacts de build Vite

Fichiers modifies:

- `frontend/dist/`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Suppression du dossier genere `frontend/dist/`.
- Conservation des fichiers source et de la documentation existante.

Raison:

- `frontend/dist/` est un artefact local produit par `npm.cmd exec vite build`.
- Le conserver dans l'etat Git melangerait le code source avec des fichiers generes.
- Le dossier est regenerable a tout moment par un build Vite.

Commandes executees:

- `git status --short --untracked-files=all`
- `Remove-Item -LiteralPath frontend/dist -Recurse -Force`

Resultat des tests:

- Nettoyage effectue apres resolution du chemin absolu dans le workspace.
- Aucun test applicatif relance volontairement, car un nouveau build recreerait `frontend/dist/`.

Problemes restants:

- Les formulaires de creation de sujet et de reponse ne sont pas encore implementes.

## 2026-06-05 - Etape 9 - Creation de sujet et reponse frontend

Fichiers modifies:

- `frontend/src/router/index.tsx`
- `frontend/src/hooks/forum/useForumThread.ts`
- `frontend/src/pages/Forum/ForumCategoryPage/ForumCategoryPage.tsx`
- `frontend/src/pages/Forum/ForumNewThreadPage/ForumNewThreadPage.tsx`
- `frontend/src/pages/Forum/ForumNewThreadPage/ForumNewThreadPage.module.css`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.module.css`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout de la page protegee `/forum/new/:categorySlug`.
- Ajout du formulaire de creation de sujet avec titre et contenu.
- Redirection vers `/forum/thread/{slug}` apres creation reussie.
- Activation du lien `Creer un sujet` sur les pages categorie pour les utilisateurs connectes.
- Ajout du formulaire de reponse sur la page sujet.
- Ajout local de la reponse publiee via `appendPost`, sans recharger le detail du sujet.
- Conservation de l'affichage existant du compteur `views_count` sur les cartes sujet et la page sujet.

Raison:

- Permettre aux utilisateurs connectes de participer au forum depuis l'interface React.
- Eviter que la publication d'une reponse appelle a nouveau `GET /forum/threads/{slug}`, car cet endpoint incremente volontairement le compteur de vues.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario API complet: register, create thread, create reply, read thread twice.
- `Invoke-WebRequest -Uri http://localhost:5174/forum/new/general -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/verification-compteur-vues-20260605092008 -UseBasicParsing`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Seeder categories forum: OK.
- Creation de sujet API: OK.
- Creation de reponse API: OK.
- Verification compteur vues: premiere lecture `views_count = 1`, deuxieme lecture `views_count = 2`, increment `+1`.
- Verification posts: `posts_count = 2` apres sujet initial + reponse.
- Verification HTTP `/forum/new/general`: HTTP 200.
- Verification HTTP `/forum/thread/verification-compteur-vues-20260605092008`: HTTP 200.

Problemes restants:

- La verification navigateur automatique n'est pas disponible dans cette session.
- L'edition/suppression frontend des posts existe cote API et hook, mais n'est pas encore exposee dans l'interface.
- La moderation frontend n'est pas encore preparee.

## 2026-06-05 - Etape 10 - Preparation moderation legere

Fichiers modifies:

- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.tsx`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.module.css`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.module.css`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Affichage plus clair des roles auteur sur les messages.
- Ajout d'un indicateur discret `Gestion possible` pour les messages gerables par l'utilisateur courant.
- Affichage des badges `Epingle` et `Verrouille` sur la page sujet.
- Ajout d'une zone informative `Actions de moderation` visible uniquement pour `admin` et `moderateur`.
- Aucune action de moderation active ajoutee.
- Aucun endpoint backend supplementaire ajoute.

Raison:

- Preparer l'interface a la moderation future sans sur-implementer le MVP.
- Eviter d'afficher des boutons destructeurs ou trompeurs tant que les endpoints dedies aux sujets n'existent pas.
- Conserver la regle de securite: le frontend est indicatif, Laravel reste responsable des autorisations.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/verification-compteur-vues-20260605092008 -UseBasicParsing`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Verification HTTP sujet: HTTP 200.

Problemes restants:

- Les endpoints de moderation de sujet ne sont pas encore implementes.
- L'edition et la suppression frontend des posts ne sont pas encore exposees dans l'interface.

## 2026-06-05 - Etape 11 - Edition, suppression et citation des messages

Fichiers modifies:

- `frontend/src/hooks/forum/useForumThread.ts`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.tsx`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.module.css`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout de `replacePost` et `removePostById` dans le hook de sujet forum.
- Ajout de l'edition inline d'un message.
- Ajout de la suppression d'un message apres confirmation navigateur.
- Ajout du bouton `Citer` pour pre-remplir le formulaire de reponse.
- Ajout du focus et scroll vers le formulaire de reponse apres citation.
- Mise a jour locale des posts apres edition ou suppression, sans recharger le detail du sujet.

Raison:

- Exposer les endpoints d'edition/suppression deja disponibles cote API.
- Permettre une interaction forum essentielle: citer un message avant de repondre.
- Preserver le compteur de vues en evitant les appels inutiles a `GET /forum/threads/{slug}`.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/verification-compteur-vues-20260605092008 -UseBasicParsing`
- Scenario API complet: register, create thread, create reply, update reply, delete reply.

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Verification HTTP sujet: HTTP 200.
- Edition API: OK, contenu retourne `Message apres modification.`.
- Suppression API: OK, message retourne `Message supprime.`.

Problemes restants:

- La citation est une citation texte simple, sans relation backend `quoted_post_id`.
- Les endpoints de moderation de sujet ne sont pas encore implementes.

## 2026-06-05 - Etape 12 - Repondre a un message et deduplication des vues

Fichiers modifies:

- `backend/app/Http/Controllers/Api/Forum/ForumThreadController.php`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.tsx`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Remplacement du bouton `Citer` par `Repondre`.
- Renommage des handlers frontend pour refleter l'action `repondre a un message`.
- Conservation du pre-remplissage du formulaire avec le contexte du message cible.
- Ajout d'une deduplication backend des vues avec cache Laravel.
- Une vue est comptee au maximum une fois toutes les 10 minutes par sujet et visiteur.

Raison:

- Le libelle `Repondre` correspond mieux a l'intention utilisateur.
- Le compteur `views_count` pouvait augmenter de `+2` en local a cause d'appels rapproches du detail sujet.
- React `StrictMode` peut declencher des effets deux fois en developpement, ce qui rendait le compteur trop sensible aux requetes brutes.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario API: register, create thread, read thread twice quickly.
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/verification-vues-dedupliquees-20260605094542 -UseBasicParsing`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Tests Laravel: 18 passed, 59 assertions.
- Verification deduplication vues: premiere lecture `views_count = 1`, deuxieme lecture rapide `views_count = 1`, delta `0`.
- Verification HTTP sujet: HTTP 200.

Problemes restants:

- La reponse contextualisee reste une citation texte, sans liaison persistante entre posts.
- Le systeme de signalement n'est pas encore implemente.

## 2026-06-05 - Etape 13 - Signalement des messages

Fichiers modifies:

- `backend/database/migrations/2026_06_05_000004_create_forum_post_reports_table.php`
- `backend/app/Models/ForumPostReport.php`
- `backend/app/Models/ForumPost.php`
- `backend/app/Models/User.php`
- `backend/app/Http/Requests/Forum/StoreForumPostReportRequest.php`
- `backend/app/Http/Controllers/Api/Forum/ForumPostReportController.php`
- `backend/app/Http/Resources/ForumPostReportResource.php`
- `backend/routes/api.php`
- `frontend/src/types/forum.types.ts`
- `frontend/src/api/endpoint.ts`
- `frontend/src/api/forum.api.ts`
- `frontend/src/hooks/forum/useForumMutations.ts`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.tsx`
- `frontend/src/components/forum/ForumPostCardComponent/ForumPostCard.module.css`
- `frontend/src/pages/Forum/ForumThreadPage/ForumThreadPage.tsx`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_API.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Creation de la table `forum_post_reports`.
- Creation du modele `ForumPostReport`.
- Ajout des relations de signalements sur `ForumPost` et `User`.
- Ajout de la validation `StoreForumPostReportRequest`.
- Ajout de l'endpoint protege `POST /api/v1/forum/posts/{post}/reports`.
- Ajout des types, endpoints, service API et mutation frontend.
- Ajout du bouton `Signaler` et d'un formulaire inline sur les messages.
- Blocage des doublons par index unique `forum_post_id + reporter_id`.
- Blocage du signalement de son propre message.

Raison:

- Ajouter une securite communautaire pour permettre a la moderation d'intervenir sur les contenus problematiques.
- Collecter les signalements de maniere structuree avant de construire une interface de traitement admin.

Commandes executees:

- `docker compose exec laravel php artisan migrate`
- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan route:list --path=forum`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario API: register author, register reporter, create thread, create reply, report reply, retry report, report own reply.

Resultat des tests:

- Migration `2026_06_05_000004_create_forum_post_reports_table`: OK.
- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Tests Laravel: 18 passed, 59 assertions.
- Route list forum: 10 routes, dont `POST /api/v1/forum/posts/{post}/reports`.
- Premier signalement: cree, `report_id = 1`.
- Doublon meme utilisateur/message: HTTP 422.
- Signalement de son propre message: HTTP 422.

Problemes restants:

- Les signalements sont collectes, mais l'interface admin de traitement n'est pas encore implementee.
- Aucun rate limit dedie n'est encore applique a l'endpoint de signalement.

## 2026-06-05 - Etape 14 - Consultation admin des signalements forum

Fichiers modifies:

- `backend/app/Http/Controllers/Api/Admin/AdminForumReportController.php`
- `backend/app/Http/Resources/AdminForumPostReportResource.php`
- `backend/routes/api.php`
- `frontend/src/types/admin.types.ts`
- `frontend/src/api/endpoint.ts`
- `frontend/src/api/admin.api.ts`
- `frontend/src/hooks/admin/useAdminForumReports.ts`
- `frontend/src/pages/Admin/AdminForumPage/AdminForumPage.tsx`
- `frontend/src/pages/Admin/AdminForumPage/AdminForumPage.module.css`
- `frontend/src/router/index.tsx`
- `docs/forum/FORUM_ARCHITECTURE.md`
- `docs/forum/FORUM_API.md`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Resume:

- Ajout de l'endpoint admin `GET /api/v1/admin/forum/reports`.
- Ajout d'une ressource admin dediee aux signalements forum.
- Ajout de la page React `/admin/forum`.
- Ajout du hook `useAdminForumReports`.
- Ajout des filtres `status` et `reason`.
- Affichage des signalements avec reporter, message, auteur, sujet et categorie.
- Ajout d'un lien rapide vers le sujet public concerne.

Raison:

- Permettre a l'administration de consulter les signalements collectes.
- S'appuyer sur la route et le layout admin existants sans creer de structure parallele.

Commandes executees:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan route:list --path=admin/forum`
- `Invoke-WebRequest -Uri http://localhost:5174/admin/forum -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/admin/forum/reports -UseBasicParsing`

Resultat des tests:

- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Tests Laravel: 18 passed, 59 assertions.
- Route list admin/forum: `GET api/v1/admin/forum/reports` OK.
- `/admin/forum`: HTTP 200.
- API admin sans token: HTTP 401.

Problemes restants:

- La page est consultative; le traitement `reviewed` ou `dismissed` n'est pas encore implemente.
- L'acces reste reserve aux admins selon le middleware existant.

## 2026-06-05 - Etape 14.2 - Contenu initial du forum Guild Wars 2

Donnees modifiees:

- `forum_categories`
- `forum_threads`
- `forum_posts`

Documentation modifiee:

- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Sauvegarde:

- `backend/storage/app/backups/forum/forum_before_starter_topics_verified_20260605_142231.sql`
- Encodage UTF-8 sans BOM.
- Tables verifiees: `forum_categories`, `forum_threads`, `forum_posts`, `forum_post_reports`.

Resume:

- Conservation des sujets existants `salutt` et `test`.
- Creation de 6 categories canoniques.
- Creation de 12 sujets Guild Wars 2.
- Creation du premier message de chaque sujet.
- Attribution des nouveaux sujets au compte administrateur `Oui`, identifiant 13.
- Utilisation d'une transaction et d'operations idempotentes.
- Suppression du script temporaire apres verification.

Categories ajoutees:

- `general`
- `builds`
- `guildes`
- `objets`
- `evenements`
- `support`

Resultat avant insertion:

- Categories: 1.
- Sujets: 2.
- Messages: 2.
- Signalements: 0.

Resultat apres insertion:

- Categories: 7.
- Sujets: 14.
- Messages: 14.
- Signalements: 0.
- Les 2 sujets existants sont toujours presents.
- Les 12 nouveaux sujets sont presents.
- Chaque nouvelle categorie contient exactement 2 sujets.

Verification d'idempotence:

- Deuxieme execution:
  - Categories creees: 0.
  - Sujets crees: 0.
  - Messages crees: 0.

Commandes executees:

- Sauvegarde `mysqldump --no-tablespaces`.
- Transaction Laravel temporaire via Tinker.
- Lectures Laravel des compteurs, slugs et associations.
- Requetes API sur les six categories.

Problemes restants:

- La categorie historique `oui` avec le slug `Jeu` existe toujours et contient `salutt` et `test`.
- Elle n'a pas ete modifiee afin de respecter la conservation stricte des donnees existantes.

## 2026-06-05 - Etape 14.3 - Recuperation ciblee du contenu initial

Donnees modifiees:

- `users`
- `forum_categories`
- `forum_threads`
- `forum_posts`
- `forum_post_reports`

Fichiers modifies:

- `backend/phpunit.xml`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Sauvegarde:

- `backend/storage/app/backups/forum/empty_state_before_targeted_recovery_20260605_152157.sql`

Incident:

- L'execution d'un test de moderation a utilise la base MySQL locale au lieu de la base SQLite en memoire.
- Les variables Docker avaient priorite sur les variables PHPUnit qui n'etaient pas forcees.
- Les donnees applicatives locales ont ete supprimees par le mecanisme de rafraichissement de base des tests.

Correction de securite:

- Les variables critiques de `backend/phpunit.xml` utilisent desormais `force="true"`.
- Les tests doivent imposer `DB_CONNECTION=sqlite` et `DB_DATABASE=:memory:` meme dans le conteneur Docker.
- Aucun nouveau test Laravel n'a ete execute pendant la recuperation afin de ne pas exposer de nouveau la base restauree.

Recuperation appliquee:

- Creation d'un compte editorial technique `GW2Nexus`.
- Creation des 6 categories canoniques.
- Creation des 12 sujets Guild Wars 2 prepares.
- Creation d'un premier message pour chacun des 12 sujets.
- Aucune restauration des sujets historiques `salutt` et `test`.
- Execution dans une transaction avec refus automatique si la base applicative n'est pas vide.
- Suppression du script temporaire apres verification.

Resultat final:

- Utilisateurs: 1.
- Categories: 6.
- Sujets: 12.
- Messages: 12.
- Signalements: 0.
- Sujet `salutt`: absent.
- Sujet `test`: absent.
- Chaque categorie publique expose exactement 2 sujets par l'API.

Verifications executees:

- Verification des compteurs et des slugs apres transaction.
- `docker compose exec laravel php artisan route:list --path=api/v1/forum`
- Requetes HTTP sur les six endpoints `/api/v1/forum/categories/{slug}/threads`.

Problemes restants:

- Le compte editorial utilise un mot de passe aleatoire non communique et n'est pas destine a une connexion interactive.
- La suite Laravel doit etre revalidee dans une etape separee, apres un controle explicite de l'isolation SQLite.

## 2026-06-05 - Etape 14.4 - Validation securisee de l'isolation PHPUnit

Fichiers modifies:

- `backend/phpunit.xml`
- `docs/forum/FORUM_IMPLEMENTATION_PLAN.md`
- `docs/forum/FORUM_CHANGELOG.md`

Fichier temporaire cree puis supprime:

- `backend/tests/Feature/DatabaseIsolationTest.php`

Diagnostic:

- Docker injecte les variables locales dans `getenv()`, `$_ENV` et `$_SERVER`.
- Les balises PHPUnit `<env force="true">` corrigent `getenv()` et `$_ENV`, mais pas `$_SERVER`.
- Laravel lisait donc encore `APP_ENV=local` et la connexion MySQL depuis `$_SERVER`.
- L'absence de cache `bootstrap/cache/config.php` a ete verifiee.

Correction:

- Conservation des balises `<env force="true">`.
- Ajout des balises PHPUnit `<server>` pour l'environnement, la base et les drivers de test.
- Normalisation ASCII des commentaires mal encodes dans `backend/phpunit.xml`.

Execution de la sentinelle:

- Premier essai via `php artisan test`: echec protecteur, environnement reel `local`.
- Deuxieme essai via `vendor/bin/phpunit`: echec protecteur identique avant correction de `$_SERVER`.
- Apres correction: succes avec environnement `testing`, connexion `sqlite` et base `:memory:`.
- Le test temporaire ne contenait ni migration, ni `RefreshDatabase`, ni ecriture.

Tests de moderation:

- Commande: `vendor/bin/phpunit --configuration phpunit.xml --filter ForumModerationTest`.
- Resultat: 5 tests reussis, 14 assertions.

Controle de la base MySQL:

- Avant sentinelle: 1 utilisateur, 6 categories, 12 sujets, 12 messages, 0 signalement.
- Apres sentinelle: compteurs inchanges.
- Apres tests de moderation: compteurs inchanges.
- API publique: 6 categories, 12 sujets uniques, aucun `salutt`, aucun `test`.

Regle de securite:

- Les tests Docker doivent conserver les doubles declarations `<env>` et `<server>` dans `phpunit.xml`.
- Toute modification de cette configuration doit etre validee par une sentinelle sans migration avant un test utilisant `RefreshDatabase`.

## 2026-06-05 - Etape 14.5 - Verification fonctionnelle de la moderation

Donnees temporaires creees puis supprimees:

- 4 utilisateurs: administrateur, moderateur, auteur et rapporteur.
- 1 categorie inactive.
- 1 sujet.
- 1 message.
- 1 signalement.
- Jetons Sanctum associes aux comptes temporaires.

Sauvegarde:

- `backend/storage/app/backups/forum/forum_before_functional_moderation_20260605_154015.sql`
- Taille verifiee: 16 136 octets.
- Encodage UTF-8 sans BOM.

Precautions:

- La categorie temporaire etait inactive et n'apparaissait pas dans le forum public.
- Toutes les suppressions ont cible les identifiants enregistres par le scenario.
- Les mots de passe et jetons temporaires n'ont pas ete affiches.
- Le script et le fichier de secrets temporaires ont ete supprimes.

Matrice d'autorisation API:

- Visiteur vers les signalements: HTTP 401.
- Utilisateur standard vers les signalements: HTTP 403.
- Moderateur vers les signalements: HTTP 200.
- Moderateur vers la gestion des utilisateurs: HTTP 403.
- Administrateur vers les signalements: HTTP 200.
- Administrateur vers la gestion des utilisateurs: HTTP 200.

Actions de moderation:

- Verrouillage du sujet par le moderateur: HTTP 200.
- Epinglage du sujet par le moderateur: HTTP 200.
- Marquage du signalement comme traite par le moderateur: HTTP 200.
- Rejet du signalement par l'administrateur: HTTP 200.
- Etat lu en base avant nettoyage: sujet verrouille et epingle, signalement rejete avec reviseur et date.

Frontend:

- `/admin/forum`: HTTP 200 et racine React presente.
- `/forum`: HTTP 200.
- TypeScript `--noEmit`: OK.
- ESLint: OK.
- Le parcours visuel automatise n'a pas pu etre execute: l'environnement du navigateur integre a echoue au demarrage sous Windows, y compris apres reinitialisation.

Incident du scenario:

- Le premier jeu temporaire a attribue le role `user` aux quatre comptes, car `role` n'est pas assignable en masse dans le modele.
- Toutes les requetes de moderation ont alors retourne HTTP 403 et aucune action n'a ete appliquee.
- Ce premier jeu a ete integralement nettoye.
- Le scenario a ete recree avec `forceFill`, puis toutes les autorisations attendues ont ete validees.
- Ce point concerne uniquement le script temporaire; les flux applicatifs existants n'ont pas ete modifies.

Etat final apres nettoyage:

- Utilisateurs: 1.
- Categories: 6.
- Sujets: 12.
- Messages: 12.
- Signalements: 0.
- Comptes temporaires restants: 0.
- Categories temporaires restantes: 0.
- Slugs publics uniques: 12.
- `salutt`: absent.
- `test`: absent.
