# Rapport d'audit GW2Nexus

Date de l'audit initial : 2026-06-02

## 1. Resume executif

GW2Nexus est un projet full-stack separe en frontend React/Vite et backend Laravel, orchestre par Docker Compose. L'architecture generale est lisible, mais plusieurs incoherences empechent ou fragilisent le lancement local : conflit de ports Vite 5173/5174, configuration DB locale incoherente avec Docker, endpoint health mal reference cote frontend, lint frontend en echec, documentation decalee par rapport au code reel et relations Laravel vers des modeles absents.

Le projet semble etre un MVP en cours de construction : les routes reellement presentes couvrent auth, contact, profil, evenements et admin, alors que le README annonce forum, guildes, builds et API GW2 avancee.

Mise a jour 2026-06-02 : le port frontend de reference a ete valide a `5174` et les fichiers non secrets ont ete alignes en consequence.

## 2. Architecture comprise

- Frontend : `frontend/`, React 19, TypeScript, Vite 7, React Router, Zustand, Axios, CSS modules.
- Backend : `backend/`, Laravel 12, Sanctum Bearer tokens, FormRequests, controllers API, services, Eloquent, migrations.
- Docker dev : `docker-compose.yml` avec MySQL, Laravel, React/Vite, phpMyAdmin et Mailpit.
- Docker prod : `docker-compose.prod.yml` avec Nginx public, Laravel, React statique et MySQL.
- API reelle : 21 routes confirmees par `php artisan route:list --path=api`.

## 3. Problemes critiques et bloquants

### Conflit de ports frontend

- Fichiers concernes : `frontend/vite.config.js`, `frontend/Dockerfile`, `docker-compose.yml`, `frontend/.env`, `frontend/.env.example`, `backend/.env`, `backend/.env.example`
- Description : avant correction, Vite forcait `5174`, Dockerfile lancait/exposait `5173`, Docker Compose publiait `5173:5173`, certains `.env` utilisaient `5173`, d'autres `5174`.
- Cause probable : changement manuel de `frontend/vite.config.js` sans aligner Docker et les exemples.
- Impact : frontend Docker potentiellement inaccessible, HMR incoherent, proxy API instable, CORS/Sanctum mal alignes.
- Priorite : critique
- Recommandation : port de reference valide : `5174`. Garder Vite, Dockerfile, Compose, `.env.example`, CORS/Sanctum et README alignes sur ce port.

### Port DB local incoherent

- Fichiers concernes : `backend/.env`, `backend/.env.example`, `.env`, `docker-compose.yml`
- Description : Docker expose MySQL sur `3307:3306`, mais les fichiers backend hors Docker pointent vers `127.0.0.1:3306`.
- Cause probable : adaptation Docker pour eviter un conflit local sans mise a jour de la doc backend.
- Impact : commandes Artisan/tests hors conteneur peuvent bloquer ou echouer.
- Priorite : eleve
- Recommandation : documenter clairement Docker vs hors Docker et aligner `DB_PORT` selon le mode choisi. Mise a jour 2026-06-02 : `.env.example` racine restaure avec `localhost:3307` cote hote documente.

### Lint frontend en echec

- Fichiers concernes : `frontend/src/components/events/EventRowComponent/EventRow.tsx`, `frontend/src/pages/Auth/ResetPasswordPage/ResetPasswordPage.tsx`, `frontend/src/pages/ContactPage/ContactPage.tsx`, `frontend/src/hooks/profile/useApiKey.ts`, `frontend/src/hooks/profile/useProfile.ts`, `frontend/src/pages/ProfilePage/ProfilePage.tsx`, `frontend/src/components/layout/NavbarComponent/Navbar.tsx`, `frontend/src/hooks/event/useEventTimer.ts`
- Description : `npm.cmd run lint` signale 15 erreurs et 1 warning.
- Cause probable : regles React Hooks recentes avec React 19/ESLint 9, dependances hook incompletes, `any` explicites, hooks appeles conditionnellement.
- Impact : qualite bloque une CI ou un build strict.
- Priorite : eleve
- Recommandation : corriger progressivement les erreurs lint sans refactor massif. Mise a jour 2026-06-02 : `npm.cmd run lint` passe apres correction progressive des erreurs ciblees.

### Relations Laravel vers modeles absents

- Fichier concerne : `backend/app/Models/User.php`
- Description : relations vers `Discussion`, `Commentaire`, `Build`, `CommentaireBuild`, `MembreGuilde` sans classes presentes.
- Cause probable : modelisation future ajoutee avant implementation des modules.
- Impact : erreur `Class not found` si ces relations sont appelees.
- Priorite : eleve
- Recommandation : retirer temporairement les relations non implementees ou ajouter les modeles manquants quand les features existent. Mise a jour 2026-06-02 : les relations non implementees ont ete retirees de `User.php`.

## 4. Problemes frontend

### Endpoint health incorrect

- Fichier concerne : `frontend/src/api/endpoint.ts`
- Description : `ENDPOINTS.health` vaut `/api/v1/health`, alors que backend expose `/api/health`.
- Cause probable : confusion entre route health non versionnee et API v1.
- Impact : healthcheck frontend casse si utilise.
- Priorite : moyen
- Recommandation : changer l'endpoint frontend ou versionner la route backend. Mise a jour 2026-06-02 : l'endpoint frontend a ete aligne sur `/api/health`.

### Appel direct a l'API GW2 account

- Fichiers concernes : `frontend/src/api/endpoint.ts`, `frontend/src/api/events.api.ts`, `frontend/src/hooks/event/useWorldBossStatus.ts`
- Description : le frontend appelle directement `https://api.guildwars2.com/v2/account/worldbosses` via `httpClient`, qui injecte le token Sanctum, pas une cle API GW2.
- Cause probable : confusion entre token applicatif et cle API GW2.
- Impact : appel probablement invalide et architecture de securite confuse.
- Priorite : eleve
- Recommandation : exposer un endpoint backend qui utilise la cle GW2 chiffree cote serveur.

### Typage faible dans le profil

- Fichiers concernes : `frontend/src/pages/ProfilePage/ProfilePage.tsx`, `frontend/src/hooks/profile/useApiKey.ts`, `frontend/src/hooks/profile/useProfile.ts`
- Description : plusieurs `any` explicites.
- Cause probable : types de reponse GW2 non formalises.
- Impact : lint bloque, robustesse reduite.
- Priorite : moyen
- Recommandation : typer les erreurs Axios et les personnages GW2. Mise a jour 2026-06-02 : les `any` du perimetre profil ont ete remplaces par des types explicites.

### Erreurs lint React Hooks corrigees progressivement

- Fichiers concernes : `frontend/src/components/events/EventRowComponent/EventRow.tsx`, `frontend/src/pages/Auth/ResetPasswordPage/ResetPasswordPage.tsx`, `frontend/src/pages/ContactPage/ContactPage.tsx`, `frontend/src/components/layout/NavbarComponent/Navbar.tsx`, `frontend/src/hooks/event/useEventTimer.ts`
- Description : `EventRow` avait une dependance `event.name` manquante dans `useMemo`, `ResetPasswordPage` appelait `usePageTitle` apres un retour conditionnel, `ContactPage` utilisait un hook reveal local puis des proprietes de refs signalees par React Compiler, `Navbar` fermait ses menus via `setState` direct dans un effet de changement de route, et `useEventTimer` stockait un etat derive recalcule dans un effet.
- Cause probable : regles React Hooks plus strictes avec la configuration ESLint actuelle.
- Impact : lint frontend bloque.
- Priorite : moyen
- Recommandation : corriger par petites etapes. Mise a jour 2026-06-02 : les erreurs ciblees dans `EventRow`, `ResetPasswordPage`, `ContactPage`, `Navbar` et `useEventTimer` ont ete corrigees.

## 5. Problemes backend/API

### Variables GW2 ignorees

- Fichier concerne : `backend/app/Services/Gw2ApiService.php`
- Description : le service utilise des constantes hardcodees pour base URL et timeout, malgre `GW2_API_BASE_URL` et `GW2_API_TIMEOUT` dans les `.env`.
- Cause probable : service ecrit avant raccordement a la configuration.
- Impact : variables documentees sans effet.
- Priorite : moyen
- Recommandation : lire `config/services.php` ou `env()` via config Laravel.

### Gestion mail contact fragile

- Fichier concerne : `backend/app/Http/Controllers/Api/Contact/ContactController.php`
- Description : envoi mail sans gestion explicite d'erreur.
- Cause probable : flux simple de MVP.
- Impact : erreur SMTP peut retourner une 500 brute.
- Priorite : moyen
- Recommandation : encapsuler l'envoi et retourner une erreur API coherente.

## 6. Problemes Docker/configuration

- `docker/nginx/default.conf` existe mais n'est pas utilise par `docker-compose.yml` dev.
- `docker-compose.yml` documente `localhost:5173`, mais le Vite config courant force `5174`.
- `docker-compose.yml` expose MySQL sur `3307`, mais README indique `3306`.
- `docker-compose.prod.yml` utilise `VITE_API_URL=""`, coherent si toutes les URLs API restent relatives.

## 7. Problemes `.env`

- `.env.example` racine etait signale supprime par Git avant correction. Il a ete restaure comme exemple Docker Compose, sans secret reel.
- `frontend/.env` et `frontend/.env.example` divergent sur `VITE_API_URL`.
- `backend/.env` utilisait `FRONTEND_URL=http://localhost:5174`, mais `SANCTUM_STATEFUL_DOMAINS` restait sur `5173`. Mise a jour 2026-06-02 : `SANCTUM_STATEFUL_DOMAINS` local aligne sur `5174`.
- Les secrets locaux ne semblent pas suivis par Git, mais ils existent dans le workspace.
- Mise a jour 2026-06-02 : `backend/.env.example` indique maintenant Laravel 12 et clarifie `mysql:3306` dans Docker versus `127.0.0.1:3307` depuis l'hote.
- Mise a jour 2026-06-02 : `php artisan test` est maintenant executable hors Docker via SQLite en memoire dans `backend/phpunit.xml`.

## 8. Problemes de ports

- Frontend : conflit majeur `5173` / `5174` identifie, puis configuration non secrete alignee sur `5174`.
- Backend : Laravel expose `8000`, coherent dans Docker.
- MySQL : host `3307`, container `3306`; `.env.example` racine et commentaire Compose clarifies.
- phpMyAdmin : `8081`, Mailpit : `8025`, SMTP : `1025`.

## 9. Qualite de code et maintenabilite

- Encodage mojibake visible dans README et de nombreux commentaires.
- README melange deux contenus et semble corrompu.
- Versions documentees fausses : README annonce Laravel 11, React 18, Tailwind 3, alors que le code utilise Laravel 12, React 19, Tailwind 4.
- Mise a jour 2026-06-02 : les commentaires `Laravel 11` restants dans `docker-compose.yml` ont ete alignes sur Laravel 12.
- Mise a jour 2026-06-02 : des caracteres de controle Unicode issus du mojibake ont ete retires des commentaires de `docker-compose.yml` apres detection par `docker compose config`.
- Fichiers volumineux : `frontend/src/styles/theme.module.css`, `frontend/src/data/events.data.ts`, `frontend/src/components/layout/NavbarComponent/Navbar.tsx`.
- Hook reveal local de `ContactPage` supprime au profit de `frontend/src/hooks/ui/useIntersectionObserver.ts`.

## 10. Securite

- Token Sanctum stocke en `localStorage`, donc expose en cas de XSS.
- Mise a jour 2026-06-02 : `role` a ete retire de `$fillable` dans le modele `User` pour limiter le risque de mass assignment.
- CORS limite l'origine via `FRONTEND_URL`, mais methodes/headers sont permissifs.
- Cle API GW2 chiffree cote backend, point positif.

## 11. Documentation

- README racine incoherent, encode incorrectement, et documente des features non implementees. Mise a jour 2026-06-02 : le README a ete remplace par une version courte alignee avec l'etat reel audite.
- Instructions `.env` parlent d'un `.env.example` racine actuellement absent.
- Ports documentes incoherents avec les configs actuelles. Mise a jour 2026-06-02 : le README documente maintenant `5174`, `8000`, `3307`, `8081`, `8025` et `1025`.
- Mise a jour 2026-06-02 : `.claude/instructions-claude.md` formalise maintenant les regles de collaboration IA adaptees a GW2Nexus.
- Backend README et docs existants ne compensent pas ces incoherences pour un nouveau developpeur.

## 12. Recommandations prioritaires

1. Aligner les ports frontend et CORS/Sanctum.
2. Clarifier DB locale `3306/3307`.
3. Restaurer et harmoniser les `.env.example`.
4. Corriger les erreurs lint frontend.
5. Corriger l'endpoint health frontend.
6. Retirer ou implementer les relations Laravel vers modeles absents.
7. Documenter l'etat reel du MVP.
8. Revoir la strategie token/localStorage et `$fillable`.

