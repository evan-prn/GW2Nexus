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

Statut: Appliquee

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

Commandes prevues:

- `docker compose exec laravel php artisan route:list`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- `POST /api/v1/forum/categories/{category:slug}/threads`
- `POST /api/v1/forum/threads/{thread:slug}/posts`
- `PATCH /api/v1/forum/posts/{post}`
- `DELETE /api/v1/forum/posts/{post}`

## Etape 7 - Frontend API, types et hooks

Statut: Appliquee

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

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd exec vite build`

## Etape 8 - Pages publiques forum

Statut: Appliquee

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
- Absence de lien vers une route de creation non implementee.

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `npm.cmd exec vite build`
- `Invoke-WebRequest -Uri http://localhost:5174/forum -UseBasicParsing`

## Etape 9 - Creation de sujet et reponse

Statut: Appliquee

Objectif:

- Ajouter les formulaires connectes.

Routes:

- `/forum/new/:categorySlug`

Critere de validation:

- Formulaire de creation sujet fonctionnel.
- Formulaire de reponse fonctionnel.
- Erreurs Laravel 422 affichees proprement.
- Redirection vers le sujet cree.
- Le compteur de vues augmente d'une unite par lecture du detail sujet.
- L'ajout d'une reponse cote frontend ne recharge pas le detail sujet pour ne pas gonfler artificiellement les vues.

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario API: register, create thread, create reply, read thread twice.
- `Invoke-WebRequest -Uri http://localhost:5174/forum/new/general -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/{slug} -UseBasicParsing`

## Etape 10 - Preparation moderation

Statut: Appliquee

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
- Aucun bouton destructeur ou faux endpoint n'est expose.
- Les etats verrouille et epingle sont lisibles sur la page sujet.
- La zone moderation est informative tant que les endpoints dedies n'existent pas.

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/{slug} -UseBasicParsing`

## Etape 11 - Edition, suppression et citation des messages

Statut: Appliquee

Objectif:

- Permettre la gestion des messages depuis la page sujet.

Actions:

- Editer un message.
- Supprimer un message apres confirmation.
- Citer un message dans une reponse.

Critere de validation:

- Seuls les auteurs, moderateurs et admins voient les actions edit/suppression.
- Les utilisateurs connectes peuvent citer un message.
- La citation pre-remplit le formulaire de reponse sans nouvel endpoint backend.
- Les mises a jour locales n'appellent pas `GET /forum/threads/{slug}` pour ne pas incrementer les vues.

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- Scenario API: register, create thread, create reply, update reply, delete reply.
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/{slug} -UseBasicParsing`

## Etape 12 - Repondre a un message et deduplication des vues

Statut: Appliquee

Objectif:

- Remplacer la notion UI de citation par une action `Repondre`.
- Eviter les doubles increments rapides du compteur de vues.

Actions:

- Renommer le bouton `Citer` en `Repondre`.
- Pre-remplir le formulaire de reponse avec le contexte du message cible.
- Dedupliquer l'increment `views_count` cote Laravel sur 10 minutes par sujet et visiteur.

Critere de validation:

- Deux lectures rapides du meme sujet ne font pas `+2`.
- Le bouton affiche `Repondre`.
- La reponse contextualisee ne necessite pas de nouvel endpoint backend.

Commandes prevues:

- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- Scenario API: create thread, read thread twice quickly.
- `Invoke-WebRequest -Uri http://localhost:5174/forum/thread/{slug} -UseBasicParsing`

## Etape 13 - Signalement des messages

Statut: Appliquee

Objectif:

- Permettre aux utilisateurs connectes de signaler un message a la moderation.

Actions:

- Creer la table `forum_post_reports`.
- Ajouter le modele `ForumPostReport`.
- Ajouter l'endpoint protege `POST /api/v1/forum/posts/{post}/reports`.
- Ajouter le bouton et formulaire inline `Signaler` cote frontend.
- Bloquer les doublons de signalement par utilisateur et message.
- Bloquer le signalement de son propre message.

Critere de validation:

- Premier signalement: HTTP 201.
- Doublon meme utilisateur/message: HTTP 422.
- Signalement de son propre message: HTTP 422.
- TypeScript, ESLint et tests Laravel OK.

Commandes prevues:

- `docker compose exec laravel php artisan migrate`
- `docker compose exec laravel php artisan route:list --path=forum`
- `docker compose exec laravel php artisan test`
- `docker compose exec laravel php artisan db:seed --class=Database\\Seeders\\ForumCategorySeeder`
- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- Scenario API: register author, register reporter, create thread, create reply, report reply, retry report, report own reply.

## Etape 14 - Consultation admin des signalements forum

Statut: Appliquee

Objectif:

- Ajouter une page de moderation forum sous `/admin/forum`.

Actions:

- Ajouter l'endpoint admin `GET /api/v1/admin/forum/reports`.
- Retourner les signalements avec reporter, message, auteur, sujet et categorie.
- Ajouter les filtres `status` et `reason`.
- Ajouter les types, endpoint, API et hook frontend admin.
- Ajouter la page `AdminForumPage`.
- Brancher la route React enfant `forum` sous `/admin`.

Critere de validation:

- `/admin/forum` est servi par la SPA.
- L'API admin refuse un visiteur non authentifie.
- Route list affiche `api/v1/admin/forum/reports`.
- TypeScript, ESLint et tests Laravel OK.

Commandes prevues:

- `docker compose exec laravel php artisan route:list --path=admin/forum`
- `docker compose exec laravel php artisan test`
- `npm.cmd exec tsc -- --noEmit --pretty false`
- `npm.cmd run lint`
- `Invoke-WebRequest -Uri http://localhost:5174/admin/forum -UseBasicParsing`
- `Invoke-WebRequest -Uri http://localhost:5174/api/v1/admin/forum/reports -UseBasicParsing`

## Etape 14.2 - Contenu initial du forum Guild Wars 2

Statut: Appliquee

Objectif:

- Ajouter les sujets de depart valides par l'utilisateur sans supprimer les donnees existantes.

Actions:

- Sauvegarder les tables forum avant insertion.
- Conserver les sujets existants `salutt` et `test`.
- Creer les categories `general`, `builds`, `guildes`, `objets`, `evenements` et `support`.
- Creer deux sujets et leur premier message dans chaque categorie.
- Attribuer les sujets au compte administrateur existant `Oui`.
- Garantir l'idempotence de l'insertion.

Critere de validation:

- Les deux sujets existants sont conserves.
- Les douze sujets prepares existent exactement une fois.
- Chaque nouvelle categorie contient deux sujets.
- Une seconde execution ne cree aucune donnee supplementaire.
- Une sauvegarde SQL verifiee existe avant l'insertion.

Commandes prevues:

- `mysqldump --no-tablespaces` sur les quatre tables forum.
- Transaction Laravel idempotente.
- Verification des compteurs et slugs en lecture.
- Verification des six endpoints de categories.

## Etape 14.3 - Recuperation ciblee apres incident de tests

Statut: Appliquee

Objectif:

- Retablir uniquement le contenu initial Guild Wars 2 valide apres la suppression accidentelle des donnees locales.
- Exclure definitivement les sujets historiques `salutt` et `test`.
- Empecher les tests PHPUnit lances dans Docker d'utiliser la base MySQL locale.

Actions:

- Sauvegarder l'etat vide avant recuperation.
- Forcer les variables d'environnement de test dans `backend/phpunit.xml`.
- Refuser la recuperation si une donnee applicative existe deja.
- Creer un auteur editorial technique avec un mot de passe aleatoire non expose.
- Creer les 6 categories et les 12 sujets prepares dans une transaction unique.
- Verifier les compteurs, les slugs et les reponses de l'API publique.
- Supprimer le script temporaire de recuperation.

Critere de validation:

- 1 utilisateur editorial.
- 6 categories.
- 12 sujets.
- 12 premiers messages.
- 0 signalement.
- Aucun sujet `salutt` ou `test`.
- Deux sujets exposes dans chacune des six categories publiques.
- Le fichier temporaire de recuperation n'existe plus.

Commandes executees:

- Sauvegarde SQL de l'etat vide.
- Transaction Laravel temporaire via Tinker.
- `docker compose exec laravel php artisan route:list --path=api/v1/forum`
- Requetes HTTP sur les six categories du forum.

Precaution restante:

- Ne pas relancer la suite Laravel avant une validation dediee de l'isolation SQLite en memoire.

## Etape 14.4 - Validation securisee de l'isolation PHPUnit

Statut: Appliquee

Objectif:

- Demontrer que les tests Laravel utilises dans Docker travaillent exclusivement sur SQLite en memoire.
- Proteger les 12 sujets restaures avant de relancer les tests de moderation.

Actions:

- Relever les compteurs MySQL avant chaque execution.
- Creer une sentinelle temporaire sans migration ni ecriture.
- Verifier `APP_ENV=testing`, `DB_CONNECTION=sqlite` et `DB_DATABASE=:memory:`.
- Identifier la priorite de `$_SERVER` sur les variables forcees par PHPUnit.
- Ajouter les valeurs de test dans les sections `<env>` et `<server>` de `phpunit.xml`.
- Relancer la sentinelle.
- Executer uniquement `ForumModerationTest` apres validation.
- Comparer les compteurs MySQL et l'API publique apres les tests.
- Supprimer la sentinelle temporaire.

Critere de validation:

- La sentinelle confirme les trois valeurs d'isolation.
- Les 5 tests de moderation passent.
- Les compteurs MySQL restent a 1 utilisateur, 6 categories, 12 sujets, 12 messages et 0 signalement.
- Les 12 sujets publics restent accessibles.
- `salutt` et `test` restent absents.

Resultat:

- Sentinelle: 1 test reussi, 3 assertions.
- Moderation: 5 tests reussis, 14 assertions.
- Base MySQL: strictement inchangee.
- Test temporaire: supprime.

Commandes de reference:

- `docker compose exec -e HOME=/tmp laravel vendor/bin/phpunit --configuration phpunit.xml --filter DatabaseIsolationTest`
- `docker compose exec -e HOME=/tmp laravel vendor/bin/phpunit --configuration phpunit.xml --filter ForumModerationTest`

Regle durable:

- Ne jamais retirer les declarations PHPUnit `<server>` tant que Docker fournit les variables Laravel via `env_file`.

## Etape 14.5 - Verification fonctionnelle de la moderation

Statut: Appliquee

Objectif:

- Valider les autorisations administrateur et moderateur sur les endpoints de moderation.
- Verifier les actions de traitement, rejet, verrouillage et epinglage sans modifier les 12 sujets editoriaux.

Actions:

- Sauvegarder les tables concernees.
- Creer un jeu temporaire complet dans une categorie inactive.
- Tester la matrice visiteur, utilisateur, moderateur et administrateur.
- Verifier les quatre actions de moderation sur le seul sujet temporaire.
- Verifier TypeScript, ESLint et le service HTTP de la SPA.
- Nettoyer les donnees par leurs identifiants.
- Supprimer les fichiers temporaires et secrets.
- Recontroler les 12 sujets publics.

Critere de validation:

- Visiteur refuse en HTTP 401.
- Utilisateur standard refuse en HTTP 403.
- Moderateur autorise sur `/admin/forum` mais refuse sur `/admin/users`.
- Administrateur autorise sur les deux espaces.
- Les quatre actions de moderation retournent HTTP 200.
- Aucune donnee temporaire ne subsiste.
- Les 12 sujets editoriaux sont inchanges.

Resultat:

- Matrice d'autorisation API conforme.
- Traitement, rejet, verrouillage et epinglage conformes.
- TypeScript et ESLint conformes.
- Routes SPA servies en HTTP 200.
- Base restauree exactement a 1 utilisateur, 6 categories, 12 sujets, 12 messages et 0 signalement.
- Parcours visuel automatise non execute en raison de l'indisponibilite technique du navigateur integre sous Windows.

Probleme rencontre:

- Le premier jeu temporaire utilisait une assignation de masse pour `role`, champ protege par le modele.
- Le jeu a ete nettoye puis recree avec `forceFill`.
- Aucune donnee editoriale n'a ete affectee.
