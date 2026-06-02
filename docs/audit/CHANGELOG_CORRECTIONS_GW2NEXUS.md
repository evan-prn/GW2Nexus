# Changelog des corrections GW2Nexus

Ce fichier trace uniquement les modifications reellement appliquees apres validation.

## 2026-06-02 - Etape 1 - Initialisation du suivi d'audit

- Fichiers modifies :
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : creation du dossier de suivi d'audit et initialisation des documents obligatoires.
- Raison de la modification : poser un cadre de correction controle, documente et reversible avant toute modification applicative.
- Commandes executees :
  - `git status --short`
  - `New-Item -ItemType Directory -Force docs\audit`
- Resultat des tests : aucun test applicatif requis pour cette etape documentaire.
- Problemes restants :
  - Worktree initial deja modifie : `.env.example` supprime, `frontend/package-lock.json` modifie, `frontend/vite.config.js` modifie, `.idea/` et `package-lock.json` non suivis.
  - Les corrections applicatives restent a valider et appliquer etape par etape.

## 2026-06-02 - Etape 2 - Stabilisation du port frontend Vite sur 5174

- Fichiers modifies :
  - `frontend/Dockerfile`
  - `docker-compose.yml`
  - `frontend/.env.example`
  - `backend/.env.example`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : alignement des fichiers non secrets sur le port frontend `5174`.
- Raison de la modification : supprimer l'incoherence entre Vite, Docker, Compose et les exemples d'environnement.
- Commandes executees :
  - `git status --short`
  - `rg -n "5173|5174" frontend\vite.config.js frontend\Dockerfile docker-compose.yml frontend\.env.example backend\.env.example`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - Recherche des ports : les fichiers cibles non secrets sont alignes sur `5174`.
  - TypeScript : `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - Lint : `npm.cmd run lint` echoue encore avec 15 erreurs et 1 warning deja identifies pendant l'audit, notamment hooks React, `any` explicites et `usePageTitle` conditionnel.
- Problemes restants :
  - Les `.env` reels n'ont pas ete modifies volontairement.
  - Le lint frontend etait deja en echec avant cette etape et sera documente apres verification.

## 2026-06-02 - Etape 3 - Clarification DB locale et restauration `.env.example` racine

- Fichiers modifies :
  - `.env.example`
  - `docker-compose.yml`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : restauration d'un `.env.example` racine non sensible pour Docker Compose et correction du commentaire MySQL host en `localhost:3307`.
- Raison de la modification : le fichier exemple racine etait supprime alors que Docker Compose et la documentation en dependent.
- Commandes executees :
  - `git status --short`
  - `rg -n "DB_DATABASE|DB_USERNAME|DB_PASSWORD|DB_ROOT_PASSWORD|3307|3306|UID|GID" docker-compose.yml .env.prod.example backend\.env.example`
  - `Test-Path .env.example`
  - `rg -n "DB_DATABASE|DB_USERNAME|DB_PASSWORD|DB_ROOT_PASSWORD|3307|3306|UID|GID" .env.example docker-compose.yml`
  - `docker compose config`
- Resultat des tests :
  - `.env.example` existe de nouveau.
  - Recherche DB/ports : l'exemple racine documente `mysql:3306` en interne Docker et `localhost:3307` depuis l'hote.
  - `docker compose config` reussi et confirme le mapping MySQL hote `3307` vers conteneur `3306`.
  - `docker compose config` affiche des warnings d'acces a `C:\Users\oui\.docker\config.json`, sans empecher la generation de la config.
  - `docker compose config` revele que `backend/.env` reel conserve `SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173`, volontairement non modifie dans cette etape.
- Problemes restants :
  - Les `.env` reels n'ont pas ete modifies.
  - La configuration backend hors Docker (`backend/.env`) peut toujours pointer vers `3306`; une etape separee sera necessaire si l'on veut l'aligner.

## 2026-06-02 - Etape 4 - Alignement des `.env` reels sur le port frontend 5174

- Fichiers modifies :
  - `backend/.env`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
- Resume des changements : alignement de `SANCTUM_STATEFUL_DOMAINS` dans `backend/.env` sur `localhost:5174,127.0.0.1:5174`.
- Raison de la modification : le backend local utilisait deja `FRONTEND_URL=http://localhost:5174`, mais Sanctum conservait les domaines stateful en `5173`.
- Commandes executees :
  - `git status --short`
  - `rg -n "FRONTEND_URL|SANCTUM_STATEFUL_DOMAINS|5173|5174" backend\.env backend\.env.example frontend\.env frontend\.env.example`
  - `docker compose config`
  - `php artisan route:list --path=api`
- Resultat des tests :
  - Recherche ports/env : `backend/.env`, `backend/.env.example`, `frontend/.env` et `frontend/.env.example` sont alignes sur `5174` pour les variables ciblees.
  - `docker compose config` reussi et confirme `SANCTUM_STATEFUL_DOMAINS=localhost:5174,127.0.0.1:5174`.
  - `docker compose config` affiche toujours des warnings d'acces a `C:\Users\oui\.docker\config.json`, sans bloquer la generation de la config.
  - `php artisan route:list --path=api` reussi et confirme 21 routes API.
- Problemes restants :
  - `backend/.env` reste un fichier local avec secrets ; seuls les ports non sensibles ont ete modifies.

## 2026-06-02 - Etape 5 - Correction de l'endpoint health frontend

- Fichiers modifies :
  - `frontend/src/api/endpoint.ts`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement de `ENDPOINTS.health` de `/api/v1/health` vers `/api/health`.
- Raison de la modification : Laravel expose la route health en `/api/health`, et Docker utilise deja cette URL dans ses healthchecks.
- Commandes executees :
  - `git status --short`
  - `rg -n "health|API_VERSION" frontend\src\api\endpoint.ts backend\routes\api.php docker-compose.yml docker-compose.prod.yml`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `php artisan route:list --path=api`
- Resultat des tests :
  - Recherche health/API : `frontend/src/api/endpoint.ts` pointe maintenant vers `/api/health`.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `php artisan route:list --path=api` reussi et confirme `GET|HEAD api/health`.
- Problemes restants :
  - Le lint frontend reste a traiter dans une etape dediee.

## 2026-06-02 - Etape 6 - Correction lint ciblee EventRow et ResetPasswordPage

- Fichiers modifies :
  - `frontend/src/components/events/EventRowComponent/EventRow.tsx`
  - `frontend/src/pages/Auth/ResetPasswordPage/ResetPasswordPage.tsx`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
- Resume des changements : ajout de `event.name` dans les dependances du `useMemo` et deplacement de `usePageTitle` avant le retour conditionnel.
- Raison de la modification : supprimer deux erreurs lint React Hooks simples et localisees.
- Commandes executees :
  - `git status --short`
  - `rg -n "usePageTitle|useMemo|event.name|event.slots, event.id" frontend\src\components\events\EventRowComponent\EventRow.tsx frontend\src\pages\Auth\ResetPasswordPage\ResetPasswordPage.tsx`
  - `npm.cmd run lint`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
- Resultat des tests :
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` echoue encore, mais passe de 15 erreurs / 1 warning a 12 erreurs / 0 warning.
  - Les erreurs ciblees dans `EventRow.tsx` et `ResetPasswordPage.tsx` ne sont plus signalees.
- Problemes restants :
  - Des erreurs lint restent attendues dans `Navbar`, `useEventTimer`, `ContactPage` et les hooks/pages avec `any`.

## 2026-06-02 - Etape 7 - Correction lint ciblee des `any` profil

- Fichiers modifies :
  - `frontend/src/hooks/profile/useApiKey.ts`
  - `frontend/src/hooks/profile/useProfile.ts`
  - `frontend/src/pages/ProfilePage/ProfilePage.tsx`
  - `frontend/src/types/profile.types.ts`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
- Resume des changements : remplacement des `any` explicites du perimetre profil par `unknown`, types Axios et `Gw2CharacterRaw`.
- Raison de la modification : supprimer les erreurs lint `@typescript-eslint/no-explicit-any` sans modifier le comportement metier.
- Commandes executees :
  - `git status --short`
  - `rg -n "any|catch \(err" frontend\src\hooks\profile\useApiKey.ts frontend\src\hooks\profile\useProfile.ts frontend\src\pages\ProfilePage\ProfilePage.tsx frontend\src\types\profile.types.ts`
  - `npm.cmd run lint`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
- Resultat des tests :
  - Recherche ciblee : plus aucun `any` explicite dans `useApiKey.ts`, `useProfile.ts`, `ProfilePage.tsx` et `profile.types.ts`.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` echoue encore, mais passe de 12 erreurs a 8 erreurs.
  - Les erreurs `@typescript-eslint/no-explicit-any` ciblees ne sont plus signalees.
- Problemes restants :
  - Des erreurs lint restent attendues dans `Navbar`, `useEventTimer` et `ContactPage`.

## 2026-06-02 - Etape 8 - Correction lint ciblee ContactPage reveal refs

- Fichiers modifies :
  - `frontend/src/pages/ContactPage/ContactPage.tsx`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement du hook reveal local de `ContactPage` par `useIntersectionObserver`, extraction d'un helper `getRevealStyle` et destructuration des refs/booleens pour eviter les acces a proprietes de refs pendant le render.
- Raison de la modification : supprimer les erreurs lint `react-hooks/refs` sans modifier l'API du hook partage.
- Commandes executees :
  - `git status --short`
  - `rg -n "useIntersectionObserver|\\.ref}|\\.visible" frontend/src`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
  - `rg -n "heroReveal|formReveal|chansReveal|heroRef|formRef|chansRef|getRevealStyle" frontend/src/pages/ContactPage/ContactPage.tsx`
- Resultat des tests :
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` echoue encore, mais passe de 8 erreurs a 2 erreurs.
  - `ContactPage` ne figure plus dans les erreurs lint.
- Problemes restants :
  - Deux erreurs `react-hooks/set-state-in-effect` restent dans `Navbar.tsx` et `useEventTimer.ts`.

## 2026-06-02 - Etape 9 - Correction lint ciblee Navbar

- Fichiers modifies :
  - `frontend/src/components/layout/NavbarComponent/Navbar.tsx`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : suppression de l'effet qui fermait les menus au changement de route, ajout d'un helper `closeMenus` et fermeture explicite des menus depuis les liens/dropdown/logout de la navbar.
- Raison de la modification : supprimer l'erreur lint `react-hooks/set-state-in-effect` dans `Navbar` sans refactor massif.
- Commandes executees :
  - `git status --short`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
  - `rg -n "closeMenus|location.pathname|setMenuOpen\\(false\\)|setUserOpen\\(false\\)|onClick=\\{closeMenus\\}" frontend/src/components/layout/NavbarComponent/Navbar.tsx`
- Resultat des tests :
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` echoue encore, mais passe de 2 erreurs a 1 erreur.
  - `Navbar` ne figure plus dans les erreurs lint.
- Problemes restants :
  - Une erreur `react-hooks/set-state-in-effect` reste dans `frontend/src/hooks/event/useEventTimer.ts`.

## 2026-06-02 - Etape 10 - Correction lint ciblee useEventTimer

- Fichiers modifies :
  - `frontend/src/hooks/event/useEventTimer.ts`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement de l'etat derive `states` par un etat source `now`, mise a jour de `now` chaque seconde et calcul des `EventState[]` via `useMemo`.
- Raison de la modification : supprimer la derniere erreur lint `react-hooks/set-state-in-effect` tout en conservant l'API du hook.
- Commandes executees :
  - `git status --short`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - Aucun probleme lint frontend connu apres cette etape.

## 2026-06-02 - Etape 11 - Documentation d'installation locale

- Fichiers modifies :
  - `README.md`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement du README obsolete par une documentation courte sur la stack constatee, les ports, les fichiers `.env`, Docker Compose, backend, frontend et verifications.
- Raison de la modification : l'ancien README melangeait deux contenus, documentait `5173`, Laravel 11, React 18 et des services Docker inexistants.
- Commandes executees :
  - `git status --short`
  - `docker compose config`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - `docker compose config` reussi et confirme les services/ports documentes.
  - `docker compose config` affiche toujours un warning d'acces a `C:\Users\oui\.docker\config.json`, sans bloquer la generation de la config.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - Encodage mojibake encore visible dans plusieurs fichiers de code/configuration hors README.

## 2026-06-02 - Etape 12 - Clarification backend `.env.example`

- Fichiers modifies :
  - `backend/.env.example`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : correction du commentaire Laravel 12 dans l'exemple backend et ajout d'une note explicite sur `mysql:3306` dans Docker versus `127.0.0.1:3307` depuis l'hote.
- Raison de la modification : reduire la confusion entre execution Laravel dans Docker et execution hors Docker contre MySQL Docker.
- Commandes executees :
  - `git status --short`
  - `rg -n "Laravel 11|Laravel 12|DB_HOST|DB_PORT|3306|3307" backend/.env.example README.md docker-compose.yml`
  - `docker compose config`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - Recherche ciblee : `backend/.env.example` indique Laravel 12 et documente le cas hote `DB_PORT=3307`.
  - `docker compose config` reussi et confirme que Docker utilise toujours `DB_HOST=mysql` et `DB_PORT=3306` pour Laravel.
  - `docker compose config` affiche toujours un warning d'acces a `C:\Users\oui\.docker\config.json`, sans bloquer la generation de la config.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - `docker-compose.yml` contient encore deux commentaires `Laravel 11`, hors perimetre de cette etape.

## 2026-06-02 - Etape 13 - Correction commentaires Laravel 12 dans Docker Compose

- Fichiers modifies :
  - `docker-compose.yml`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement des deux mentions documentaires `Laravel 11` par `Laravel 12` dans `docker-compose.yml` et suppression de caracteres de controle Unicode presents dans les commentaires du fichier Compose.
- Raison de la modification : aligner Docker Compose avec la version Laravel reelle et restaurer un YAML parseable apres detection d'un probleme de caracteres de controle.
- Commandes executees :
  - `git status --short`
  - `rg -n "Laravel 11|Laravel 12" docker-compose.yml README.md backend/.env.example`
  - `docker compose config`
  - verification du nombre de caracteres de controle Unicode dans `docker-compose.yml`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - Aucune mention `Laravel 11` restante dans les fichiers cibles.
  - `docker-compose.yml` ne contient plus de caracteres de controle Unicode interdits par YAML.
  - `docker compose config` reussi, avec le warning Docker non bloquant connu sur `C:\Users\oui\.docker\config.json`.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - Des commentaires mojibake restent visibles dans plusieurs fichiers, mais sans bloquer Docker Compose dans cette verification.

## 2026-06-02 - Etape 14 - Relations backend vers modeles absents

- Fichiers modifies :
  - `backend/app/Models/User.php`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : retrait des relations Eloquent `discussions`, `commentaires`, `builds`, `commentairesBuild` et `membresGuilde`, qui pointaient vers des modeles absents.
- Raison de la modification : eviter des erreurs `Class not found` si ces relations futures etaient appelees avant implementation des modules forum/builds/guildes.
- Commandes executees :
  - `git status --short`
  - `rg -n "discussions\\(|commentaires\\(|builds\\(|commentairesBuild\\(|membresGuilde\\(|Discussion|Commentaire|Build|CommentaireBuild|MembreGuilde" backend`
  - `php artisan route:list --path=api`
  - `php artisan test`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - `php artisan route:list --path=api` reussi et confirme 21 routes API.
  - La recherche ne trouve plus les relations supprimees dans `User.php`; une mention `discussions` reste dans un commentaire de routes admin non active.
  - `php artisan test` echoue hors Docker : 16 tests feature tentent de joindre `mysql:3306`, nom resolvable uniquement dans le reseau Docker ; 2 tests passent.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - La configuration des tests backend hors Docker doit etre clarifiee ou alignee sur `127.0.0.1:3307`, ou les tests doivent etre lances dans le conteneur Laravel.

## 2026-06-02 - Etape 15 - Configuration des tests backend hors Docker

- Fichiers modifies :
  - `backend/phpunit.xml`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : remplacement de la base MySQL de test `mysql:3306/app_test` par SQLite en memoire dans `phpunit.xml` et suppression du commentaire MySQL obsolete.
- Raison de la modification : permettre l'execution de `php artisan test` hors Docker sans dependance au DNS interne Docker `mysql`.
- Commandes executees :
  - `git status --short`
  - `php artisan test`
  - `php artisan route:list --path=api`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
- Resultat des tests :
  - `php artisan test` reussi : 18 tests passes, 59 assertions.
  - `php artisan route:list --path=api` reussi et confirme 21 routes API.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - SQLite peut masquer certaines differences avec MySQL ; les tests d'integration DB MySQL pourront etre ajoutes separement si necessaire.

## 2026-06-02 - Etape 16 - Securisation du mass assignment du role utilisateur

- Fichiers modifies :
  - `backend/app/Models/User.php`
  - `docs/audit/AUDIT_GW2NEXUS.md`
  - `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
  - `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
  - `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`
- Resume des changements : retrait de `role` du tableau `$fillable` du modele `User`.
- Raison de la modification : reduire le risque d'elevation de privileges par mass assignment si un futur endpoint valide ou transmet `role` par erreur.
- Commandes executees :
  - `git status --short`
  - `php artisan test`
  - `php artisan route:list --path=api`
  - `npm.cmd exec tsc -- --noEmit --pretty false`
  - `npm.cmd run lint`
  - `rg -n "protected \\$fillable|role|forceFill|User::create|->update\\(" backend/app/Models/User.php backend/app backend/database backend/tests`
- Resultat des tests :
  - `php artisan test` reussi : 18 tests passes, 59 assertions.
  - `php artisan route:list --path=api` reussi et confirme 21 routes API.
  - `npm.cmd exec tsc -- --noEmit --pretty false` reussi.
  - `npm.cmd run lint` reussi.
- Problemes restants :
  - Si une fonctionnalite future de changement de role est ajoutee, elle devra passer par une methode ou un flux admin explicite.
