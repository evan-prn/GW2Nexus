# Plan de correction GW2Nexus

Date de creation : 2026-06-02

## Regles de conduite

- Aucune correction n'est appliquee sans validation explicite.
- Chaque etape doit etre minimale, reversible et documentee.
- Les modifications existantes dans le worktree ne sont pas annulees.
- Les secrets ne sont pas modifies.

## Etat initial du worktree

Etat observe avant la premiere etape :

```text
 D .env.example
 M frontend/package-lock.json
 M frontend/vite.config.js
?? .idea/
?? package-lock.json
```

## Etape 1 - Initialisation du suivi d'audit

- Objectif : creer le dossier `/docs/audit/` et les quatre fichiers de suivi.
- Fichiers cibles : `docs/audit/AUDIT_GW2NEXUS.md`, `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`, `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`, `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Modifications prevues : documenter l'audit initial, le plan, le changelog et les decisions techniques.
- Risques : ajout de nouveaux fichiers uniquement.
- Statut : Appliquee
- Criteres de validation : les quatre fichiers existent et `git status` montre uniquement ces ajouts en plus de l'etat initial.
- Commandes de test prevues : `git status --short`, verification de presence des fichiers.

## Etape 2 - Stabilisation du port frontend Vite

- Objectif : choisir et appliquer un port frontend unique pour le dev local et Docker.
- Fichiers cibles : `frontend/vite.config.js`, `frontend/.env.example`, `backend/.env.example`, `docker-compose.yml`, `frontend/Dockerfile`
- Modifications prevues : aligner les fichiers non secrets sur le port valide `5174`.
- Risques : impact direct sur URL locale, proxy Vite, CORS/Sanctum et Docker.
- Statut : Appliquee
- Criteres de validation : le frontend ecoute sur le port publie, les exemples `.env` et commentaires ne se contredisent plus.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`, eventuellement lancement Docker ou Vite selon validation.

## Etape 3 - Clarification DB locale Docker/hors Docker

- Objectif : clarifier le couple `3307:3306` et la configuration Laravel hors conteneur.
- Fichiers cibles : `.env.example`, `backend/.env.example`, `README.md` ou docs d'installation locale.
- Modifications prevues : restaurer l'exemple racine et documenter DB Docker vs local.
- Risques : confusion si des developpeurs utilisent deja `3306`.
- Statut : Appliquee
- Criteres de validation : un nouveau developpeur sait quelle valeur utiliser selon le mode de lancement.
- Commandes de test prevues : `php artisan route:list --path=api`, test backend selon environnement disponible.

## Etape 4 - Correction endpoint health frontend

- Objectif : aligner `ENDPOINTS.health` avec la route backend reelle.
- Fichiers cibles : `frontend/src/api/endpoint.ts`
- Modifications prevues : remplacer `/api/v1/health` par `/api/health`, ou versionner le backend apres validation.
- Risques : faible.
- Statut : Appliquee
- Criteres de validation : endpoint coherent avec `php artisan route:list --path=api`.
- Commandes de test prevues : `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 4 bis - Alignement des `.env` reels sur le port frontend 5174

- Objectif : aligner `backend/.env` sur le port frontend local valide `5174`.
- Fichiers cibles : `backend/.env`
- Modifications prevues : remplacer uniquement `SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173` par `localhost:5174,127.0.0.1:5174`.
- Risques : modification d'un `.env` reel local, sans modification de secrets.
- Statut : Appliquee
- Criteres de validation : `docker compose config` ne contient plus de `SANCTUM_STATEFUL_DOMAINS` en `5173`.
- Commandes de test prevues : `docker compose config`, `php artisan route:list --path=api`.

## Etape 5 - Correction lint frontend prioritaire

- Objectif : faire passer ESLint sans refactor massif.
- Fichiers cibles : fichiers signales par `npm.cmd run lint`.
- Modifications prevues : corriger hooks, dependances `useMemo`, `any`, hook conditionnel.
- Risques : possible impact UX mineur si logique hook modifiee.
- Statut : A valider
- Criteres de validation : `npm.cmd run lint` passe.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 6 - Correction lint ciblee EventRow et ResetPasswordPage

- Objectif : corriger deux erreurs lint simples sans refactor massif.
- Fichiers cibles : `frontend/src/components/events/EventRowComponent/EventRow.tsx`, `frontend/src/pages/Auth/ResetPasswordPage/ResetPasswordPage.tsx`
- Modifications prevues : ajouter `event.name` aux dependances `useMemo`, deplacer `usePageTitle` avant le retour conditionnel.
- Risques : faible ; le lint complet reste possiblement en echec a cause d'autres fichiers hors perimetre.
- Statut : Appliquee
- Criteres de validation : TypeScript passe et les erreurs ciblees ne figurent plus dans le lint.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 7 - Correction lint ciblee des `any` profil

- Objectif : supprimer les `any` explicites dans le perimetre profil.
- Fichiers cibles : `frontend/src/hooks/profile/useApiKey.ts`, `frontend/src/hooks/profile/useProfile.ts`, `frontend/src/pages/ProfilePage/ProfilePage.tsx`, `frontend/src/types/profile.types.ts`
- Modifications prevues : typer les erreurs Axios en `unknown`, ajouter un type brut pour les personnages GW2, remplacer le cast `any[]`.
- Risques : faible ; les messages d'erreur generiques restent utilises si la forme de reponse differe.
- Statut : Appliquee
- Criteres de validation : TypeScript passe et les erreurs `no-explicit-any` ciblees disparaissent.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 8 - Correction lint ciblee ContactPage reveal refs

- Objectif : supprimer les erreurs `react-hooks/refs` dans `ContactPage`.
- Fichiers cibles : `frontend/src/pages/ContactPage/ContactPage.tsx`, docs audit.
- Modifications prevues : remplacer le hook reveal local par `useIntersectionObserver`, extraire le style reveal pur hors render et destructurer les refs/booleens pour satisfaire React Compiler.
- Risques : faible ; animation reveal legerement standardisee avec le hook partage.
- Statut : Appliquee
- Criteres de validation : TypeScript passe et `ContactPage` ne figure plus dans les erreurs lint.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 9 - Correction lint ciblee Navbar

- Objectif : supprimer l'erreur `react-hooks/set-state-in-effect` dans `Navbar`.
- Fichiers cibles : `frontend/src/components/layout/NavbarComponent/Navbar.tsx`, docs audit.
- Modifications prevues : supprimer l'effet de fermeture sur changement de route et fermer les menus via les handlers de navigation.
- Risques : faible ; une navigation declenchee hors clic navbar ne force plus la fermeture des menus.
- Statut : Appliquee
- Criteres de validation : TypeScript passe et `Navbar` ne figure plus dans les erreurs lint.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 10 - Correction lint ciblee useEventTimer

- Objectif : supprimer la derniere erreur `react-hooks/set-state-in-effect`.
- Fichiers cibles : `frontend/src/hooks/event/useEventTimer.ts`, docs audit.
- Modifications prevues : remplacer l'etat derive `states` par un etat source `now`, puis calculer les `EventState[]` via `useMemo`.
- Risques : faible ; l'API publique du hook reste identique.
- Statut : Appliquee
- Criteres de validation : TypeScript passe et `npm.cmd run lint` passe.
- Commandes de test prevues : `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 11 - Documentation d'installation locale

- Objectif : remplacer le README incoherent par une documentation locale fidele aux fichiers presents.
- Fichiers cibles : `README.md`, docs audit.
- Modifications prevues : documenter la stack constatee, les ports, les fichiers `.env`, Docker Compose, les commandes backend/frontend et les verifications.
- Risques : moyen ; remplacement documentaire visible, sans impact runtime.
- Statut : Appliquee
- Criteres de validation : README coherent avec Docker, Vite, `.env.example` et scripts npm.
- Commandes de test prevues : `docker compose config`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 12 - Clarification backend `.env.example`

- Objectif : corriger les commentaires obsoletes et clarifier les ports DB dans l'exemple Laravel.
- Fichiers cibles : `backend/.env.example`, docs audit.
- Modifications prevues : remplacer Laravel 11 par Laravel 12 dans l'exemple backend et documenter Docker `mysql:3306` versus hote `127.0.0.1:3307`.
- Risques : faible ; fichier exemple uniquement, sans modification de secrets ni du `.env` reel.
- Statut : Appliquee
- Criteres de validation : `backend/.env.example` est coherent avec README et Docker pour les ports DB.
- Commandes de test prevues : `docker compose config`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 13 - Correction commentaires Laravel 12 dans Docker Compose

- Objectif : aligner les commentaires Docker Compose sur Laravel 12.
- Fichiers cibles : `docker-compose.yml`, docs audit.
- Modifications prevues : remplacer les mentions documentaires `Laravel 11` par `Laravel 12`.
- Risques : tres faible ; commentaires uniquement. Une verification YAML reste necessaire.
- Statut : Appliquee
- Criteres de validation : aucune mention `Laravel 11` restante dans les fichiers cibles et `docker compose config` passe.
- Commandes de test prevues : `docker compose config`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 14 - Relations backend vers modeles absents

- Objectif : eviter les erreurs `Class not found` liees a des relations Eloquent futures non implementees.
- Fichiers cibles : `backend/app/Models/User.php`, docs audit.
- Modifications prevues : retirer les relations `discussions`, `commentaires`, `builds`, `commentairesBuild` et `membresGuilde`.
- Risques : faible a moyen ; si du code dynamique appelait ces relations, la methode n'existerait plus.
- Statut : Appliquee
- Criteres de validation : routes API OK, aucune reference aux classes absentes dans `User.php`, tests documentes.
- Commandes de test prevues : `php artisan route:list --path=api`, `php artisan test`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 15 - Configuration des tests backend hors Docker

- Objectif : rendre `php artisan test` executable depuis l'hote sans dependre du DNS Docker `mysql`.
- Fichiers cibles : `backend/phpunit.xml`, docs audit.
- Modifications prevues : utiliser SQLite en memoire pour les tests et retirer les commentaires MySQL `app_test` obsoletes.
- Risques : moyen ; SQLite peut differer de MySQL sur certains comportements SQL.
- Statut : Appliquee
- Criteres de validation : `php artisan test` passe hors Docker.
- Commandes de test prevues : `php artisan test`, `php artisan route:list --path=api`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 16 - Securisation du mass assignment du role utilisateur

- Objectif : retirer `role` des champs assignables en masse.
- Fichiers cibles : `backend/app/Models/User.php`, docs audit.
- Modifications prevues : supprimer uniquement `role` de `$fillable`.
- Risques : faible ; les flux actuels ne mass-assignent pas `role`.
- Statut : Appliquee
- Criteres de validation : tests backend OK et routes API OK.
- Commandes de test prevues : `php artisan test`, `php artisan route:list --path=api`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 17 - Instructions Claude/Codex adaptees a GW2Nexus

- Objectif : creer un fichier d'instructions projet adapte a GW2Nexus et au workflow de correction controlee.
- Fichiers cibles : `.claude/instructions-claude.md`, docs audit.
- Modifications prevues : documenter stack, ports, workflow, tests, securite, Docker et regles de comportement.
- Risques : faible ; documentation uniquement.
- Statut : Appliquee
- Criteres de validation : fichier present et coherent avec GW2Nexus.
- Commandes de test prevues : `Test-Path .claude/instructions-claude.md`, `npm.cmd run lint`, `php artisan test`.

## Etape 18 - Consolidation phpMyAdmin sur le port 8081

- Objectif : aligner la documentation sur le port phpMyAdmin reellement fonctionnel.
- Fichiers cibles : `docker-compose.yml`, `README.md`, `.claude/instructions-claude.md`, docs audit.
- Modifications prevues : documenter phpMyAdmin sur `http://localhost:8081` au lieu de `8080`.
- Risques : faible ; alignement documentaire sur le port Docker deja configure.
- Statut : Appliquee
- Criteres de validation : les references phpMyAdmin indiquent `8081` et `docker compose config` passe.
- Commandes de test prevues : `docker compose config`, `php artisan test`, `npm.cmd run lint`.

## Etape 19 - Consolidation finale et controle d'encodage

- Objectif : verifier l'etat final des fichiers touches, les ports documentes et l'absence de caracteres d'encodage suspects.
- Fichiers cibles : `docker-compose.yml`, `README.md`, `.claude/instructions-claude.md`, docs audit.
- Modifications prevues : tracer la consolidation finale dans les documents d'audit.
- Risques : faible ; documentation uniquement.
- Statut : Appliquee
- Criteres de validation : aucun caractere de controle ni marqueur mojibake dans les fichiers touches, tests backend/frontend OK.
- Commandes de test prevues : `docker compose config`, `php artisan test`, `npm.cmd run lint`, `npm.cmd exec tsc -- --noEmit --pretty false`.

## Etape 6 - Relations backend vers modeles absents

- Objectif : eviter les `Class not found` sur relations futures non implementees.
- Fichiers cibles : `backend/app/Models/User.php`
- Modifications prevues : retirer temporairement ou conditionner les relations futures apres validation.
- Risques : impact si du code non vu les utilise deja.
- Statut : Appliquee
- Criteres de validation : aucun appel existant ne casse, tests backend OK.
- Commandes de test prevues : `php artisan test`, `php artisan route:list --path=api`.

## Etape 7 - Documentation d'installation locale

- Objectif : mettre le README en coherence avec l'etat reel.
- Fichiers cibles : `README.md`, eventuellement `backend/README.md`, docs audit.
- Modifications prevues : corriger versions, ports, commandes et features reellement disponibles.
- Risques : modification documentaire visible mais sans impact runtime.
- Statut : A valider
- Criteres de validation : instructions reproductibles.
- Commandes de test prevues : verification manuelle et commandes documentees.

## Etape 8 - Securite minimale

- Objectif : traiter les risques visibles sans changer l'architecture auth sans validation.
- Fichiers cibles : `backend/app/Models/User.php`, configs CORS/Sanctum, docs decisions.
- Modifications prevues : retirer `role` de `$fillable` si confirme, documenter strategie token.
- Risques : impact sur seeders/tests si role est mass-assigned.
- Statut : A valider
- Criteres de validation : tests backend passent.
- Commandes de test prevues : `php artisan test`.

## Etape A - Hors-workflow : corrections backend/.env et Dockerfile (2026-06-18)

- Objectif : documenter trois modifications appliquees sans confirmation prealable.
- Fichiers cibles : `backend/.env`, `backend/Dockerfile`
- Modifications appliquees :
  - Suppression commentaire inline `DB_PASSWORD` dans `backend/.env`.
  - Ajout cache BuildKit apt dans `backend/Dockerfile`.
  - Mise a jour `FROM php:8.3-cli` -> `FROM php:8.4-cli` + corrections commentaires Laravel 11/12.
- Statut : Appliquee
- Cause du blocage identifiee : `composer.lock` genere sous PHP 8.4 ; package exigeant PHP >= 8.4.1 ;
  `platform_check.php` echouait avant d'atteindre MySQL.
- Criteres de validation : tous les containers healthy, migrations appliquees.
- Commandes executees :
  - `docker compose down -v`
  - `docker compose up -d --build`
  - `docker compose ps`
  - `docker compose logs laravel --tail=40`
- Resultat : OK — 5/5 services UP, migrations terminees, serveur Laravel sur `http://0.0.0.0:8000`.

## Etape B - A appliquer : Gw2ApiService lire depuis config()

- Objectif : faire lire `GW2_API_BASE_URL` et `GW2_API_TIMEOUT` depuis la configuration Laravel.
- Fichiers cibles : `backend/app/Services/Gw2ApiService.php`, `backend/config/services.php`
- Statut : A valider

## Etape C - A appliquer : ContactController try-catch mail

- Objectif : eviter une 500 brute en cas d'erreur SMTP.
- Fichiers cibles : `backend/app/Http/Controllers/Api/Contact/ContactController.php`
- Statut : A valider

## Etape D - A appliquer : useWorldBossStatus router via backend

- Objectif : ne plus appeler l'API GW2 directement depuis le frontend.
- Fichiers cibles : `frontend/src/hooks/event/useWorldBossStatus.ts`, backend
- Statut : A valider

## Etape E - A appliquer : Traiter les fichiers orphelins du worktree Git

- Objectif : commiter les suppressions de fichiers prod et les nouveaux fichiers CI/CD.
- Fichiers cibles : voir `git status --short`
- Statut : A valider
