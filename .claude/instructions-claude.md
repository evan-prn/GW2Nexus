# Instructions Claude — Projet GW2Nexus

## Vision du projet

GW2Nexus est une application web communautaire pour Guild Wars 2.

L'objectif actuel est de stabiliser un MVP full-stack existant, pas de reconstruire l'application. Les corrections doivent etre progressives, documentees et faciles a relire.

| Phase | Perimetre | Infrastructure |
| --- | --- | --- |
| Phase 1 - Stabilisation locale | Corriger demarrage local, Docker, ports, env, lint, tests | Docker Compose local + Laravel + React/Vite + MySQL |
| Phase 2 - Fonctionnement applicatif | Fiabiliser routes, API, hooks, services, gestion erreurs | API Laravel + SPA React |
| Phase 3 - Qualite, securite, maintenabilite | Reduire dette technique et risques securite | Tests, documentation, durcissement progressif |

Toutes les decisions doivent ameliorer l'etat reel du projet sans sur-implementer des modules non presents.

---

## Priorites non negociables

- Ne jamais modifier un fichier sans confirmation explicite de l'utilisateur.
- Avancer une etape a la fois, avec un perimetre clair.
- Ne jamais exposer de secrets dans le depot, les logs, les exemples ou la documentation.
- Ne pas modifier les fichiers `.env` reels sauf validation explicite et uniquement pour des valeurs non sensibles.
- Garder le frontend sur le port `5174`, sauf demande explicite contraire.
- Executer les tests/verifications prevus apres chaque etape appliquee.
- Ne jamais faire de refactor massif non demande.
- Ne jamais supprimer de fichier sans confirmation explicite.

---

## Stack technique constatee

### Frontend

- React 19
- TypeScript 5.8
- Vite 7
- React Router v7
- Axios
- Zustand 5
- TanStack Query v5
- Tailwind CSS 4
- CSS modules

### Backend

- Laravel 12
- PHP 8.4+ (composer.lock genere sur PHP 8.4 — version minimum imposee par platform_check.php)
- Laravel Sanctum 4.3 (Bearer Token)
- Eloquent ORM
- Form Requests
- API Resources
- API REST versionnee sous `/api/v1/*`, avec route health non versionnee `/api/health`

### Infrastructure locale

- Docker Compose (5 services)
- MySQL 8
- phpMyAdmin
- Mailpit
- Frontend Vite sur `http://localhost:5174`
- Backend Laravel sur `http://localhost:8000`

---

## Ports de reference

| Service | Port / URL |
| --- | --- |
| Frontend Vite | `http://localhost:5174` |
| Backend Laravel | `http://localhost:8000` |
| Health API | `http://localhost:8000/api/health` |
| phpMyAdmin | `http://localhost:8081` |
| Mailpit UI | `http://localhost:8025` |
| Mailpit SMTP | `localhost:1025` |
| MySQL depuis l'hote | `localhost:3307` |
| MySQL dans Docker | `mysql:3306` |

Le port frontend de reference est `5174`. Ne pas revenir a `5173` sans realigner Vite, Docker, CORS/Sanctum, `.env.example`, README et documentation.

---

## Structure du projet

```text
backend/                  # API Laravel 12
frontend/                 # SPA React 19 / Vite 7
docker/                   # Fichiers Docker annexes
docs/                     # Documentation structuree du projet
  architecture/           # Vue globale, diagrammes, ADR, matrice priorite
  api/                    # Documentation endpoints REST
  backend/                # Documentation technique backend
  frontend/               # Documentation technique frontend
  database/               # Schema base de donnees
  security/               # Securite et bonnes pratiques
  devops/                 # Setup local, Docker, variables d'env
  game/                   # Integration API GW2 / metier Guild Wars 2
  testing/                # Strategie et guides de tests
  operations/             # Runbook, monitoring
  product/                # Vision produit
  audit/                  # Historique audit et corrections (2026-06-02)
  forum/                  # Documentation specifique module Forum
.claude/                  # Instructions de collaboration IA
README.md                 # Vitrine produit du projet
backend/README.md         # Documentation technique backend
frontend/README.md        # Documentation technique frontend
docker-compose.yml        # Stack locale dev
```

---

## Gouvernance documentaire

### Principe fondamental

**La documentation est un composant de premiere classe du projet, maintenue avec le meme niveau d'exigence que le code source.**

Toute modification du projet doit entrainer une verification de la documentation concernee.

### Declencheurs de mise a jour obligatoire

Une mise a jour documentaire est requise lors de :

- ajout, modification ou suppression de fonctionnalite
- refactorisation impactant l'architecture ou les interfaces
- evolution de l'architecture globale ou d'un module
- modification d'un endpoint API (route, payload, reponse, auth)
- ajout ou modification d'une migration ou du schema de base de donnees
- ajout, modification ou suppression d'une variable d'environnement
- modification d'une procedure d'installation ou de demarrage
- changement de configuration Docker ou des services
- ajout ou suppression d'une dependance significative
- evolution des mecanismes d'authentification ou de securite
- modification des regles metier GW2 ou de l'integration ArenaNet
- prise d'une decision d'architecture (doit generer un ADR)

### Documents par zone de code

| Zone modifiee | Documents a verifier |
| --- | --- |
| `routes/api.php`, controllers | `docs/api/` + endpoint concerne |
| `database/migrations/` | `docs/database/schema.md` |
| `backend/.env.example` | `docs/devops/variables-env.md` |
| `frontend/.env.example` | `docs/devops/variables-env.md` |
| `docker-compose.yml`, `Dockerfile` | `docs/devops/docker.md` |
| `app/Services/Gw2ApiService.php` | `docs/game/gw2-api.md`, `docs/backend/services.md` |
| `router/index.tsx`, `*Route.tsx` | `docs/frontend/overview.md` |
| `authStore.ts`, `profileStore.ts` | `docs/frontend/state-management.md` |
| `app/Http/Middleware/` | `docs/backend/overview.md`, `docs/security/overview.md` |
| Architecture globale | `docs/architecture/architecture-globale.md` |
| Nouvelle decision technique | `docs/architecture/decisions-techniques.md` (ADR) |

### Obligations a chaque intervention

1. Identifier les documents impactes avant de modifier le code.
2. Mettre a jour les documents concernes apres la modification.
3. Verifier la coherence entre le code et la documentation.
4. Ne jamais laisser une fonctionnalite sans documentation associee.
5. Ne jamais conserver une documentation decrivant un comportement obsolete.
6. Supprimer ou corriger les informations devenues fausses.

### Documentation as Code

La documentation est versionnee, maintenue, relue et coherente au meme titre que le code. Chaque modification du code s'accompagne d'une reflexion sur son impact documentaire.

Regles :

- Single Source of Truth : une information n'existe qu'a un seul endroit dans la documentation.
- Pas de duplication intentionnelle entre fichiers de documentation.
- Les README (racine, backend, frontend) sont des documents vivants mis a jour en continu.
- Les ADR (Architecture Decision Records) documentent le POURQUOI, pas seulement le QUOI.

---

## Checklist de fin de tache

Avant de considerer une tache comme terminee, verifier :

- [ ] Fonctionnalite implementee et fonctionnelle
- [ ] Refactorisation terminee
- [ ] Tests crees ou mis a jour si applicable
- [ ] Documentation mise a jour (docs/ concernes)
- [ ] README concernes verifies (racine, backend, frontend selon impact)
- [ ] Architecture documentee si evolution significative
- [ ] ADR cree si decision d'architecture prise
- [ ] Variables d'environnement documentees si nouvelles
- [ ] Schema DB mis a jour si migration ajoutee
- [ ] Coherence globale validee

Une tache n'est terminee que lorsque tous les elements applicables sont valides.

---

## Workflow obligatoire de correction

Avant chaque modification, presenter une etape avec :

- titre de l'etape ;
- probleme cible ;
- fichiers concernes ;
- modifications prevues ;
- risques ;
- tests/verifications prevus ;
- documentation a mettre a jour ;
- question finale : `Confirme-tu que je peux appliquer cette etape ?`

Apres confirmation seulement :

- verifier `git status --short` ;
- appliquer uniquement l'etape validee ;
- executer les tests prevus ;
- mettre a jour la documentation concernee ;
- documenter dans `docs/audit/changelog-corrections.md` si correction applicative ;
- fournir un compte-rendu clair ;
- proposer la prochaine etape sans l'appliquer.

Reponses equivalentes a une confirmation : `oui`, `ok`, `go`, `valide`, `validé`.

---

## Tests et verifications de reference

Frontend :

```bash
npm.cmd exec tsc -- --noEmit --pretty false
npm.cmd run lint
```

Backend :

```bash
php artisan route:list --path=api
php artisan test
```

Docker :

```bash
docker compose config
docker compose ps
```

Notes :

- `php artisan test` est configure pour utiliser SQLite en memoire via `backend/phpunit.xml`.
- `docker compose config` peut afficher un warning d'acces a `C:\Users\oui\.docker\config.json` ; le documenter s'il apparait, mais ne pas le confondre avec un echec applicatif.
- Ne pas recopier de secrets ou valeurs sensibles affichees par `docker compose config` dans les reponses ou les fichiers Markdown.

---

## Regles frontend

- Lire les composants/hooks/services avant toute modification.
- Ne pas introduire de nouvelle direction artistique sans demande.
- Conserver les patterns existants sauf correction ciblee.
- Eviter les hooks conditionnels, dependances manquantes et etats derives inutiles.
- Preferer des corrections minimales qui font passer TypeScript et ESLint.
- Les appels API doivent rester coherents avec `frontend/src/api/endpoint.ts` et le proxy Vite.
- Ne jamais placer de secret dans une variable `VITE_*`.

---

## Regles backend

- Lire routes, controllers, FormRequests, services et models avant modification.
- Garder les endpoints coherents et versionnes sous `/api/v1/*`, sauf `/api/health`.
- Valider les entrees via Form Requests quand c'est pertinent.
- Ne pas exposer `api_key`, tokens, passwords ou secrets dans les ressources/API/logs.
- Ne pas ajouter de relation Eloquent vers un modele absent.
- Ne pas ajouter de migration ou modele pour une fonctionnalite future sans validation explicite.
- Pour les attributs sensibles comme `role`, eviter le mass assignment.

---

## Regles Docker et environnement

- Ne pas changer les ports sans expliquer l'impact frontend/backend/CORS/Sanctum.
- Ne pas modifier Docker Compose sans executer `docker compose config`.
- Ne pas utiliser `docker compose down -v` sans confirmation explicite, car cela supprime les volumes.
- Distinguer clairement :
  - Docker interne : `mysql:3306` ;
  - hote local : `127.0.0.1:3307`.

---

## Documentation — Historique

Les documents `docs/audit/` (AUDIT, PLAN, CHANGELOG, DECISIONS) datant du 2026-06-02 sont des archives historiques de la phase de stabilisation initiale. Ils ne doivent pas etre supprimes.

Les nouvelles decisions techniques sont a ajouter dans `docs/architecture/decisions-techniques.md` (ADR).

Les nouvelles corrections applicatives sont a journaliser dans `docs/audit/changelog-corrections.md`.

---

## Securite

- Aucun secret dans le depot.
- Aucun secret dans les exemples.
- Aucun secret dans les logs ou comptes-rendus.
- Ne pas afficher les valeurs sensibles issues de `.env` ou `docker compose config`.
- Les tokens Sanctum et cles API GW2 doivent rester masques ou chiffres.
- Les changements de role utilisateur doivent passer par un flux admin explicite.

---

## Git

- Ne jamais revert des changements non faits par l'assistant sans demande explicite.
- Toujours verifier l'etat Git avant modification.
- Ne pas utiliser de commande destructive sans confirmation explicite.
- Ne pas melanger plusieurs corrections dans un meme lot sans validation separee.

---

## Comportement attendu de l'assistant

Toujours faire :

- lire le code existant avant modification ;
- identifier les documents impactes avant de toucher au code ;
- proposer une etape avant d'appliquer ;
- attendre confirmation explicite ;
- appliquer une correction minimale ;
- tester ;
- documenter (code et docs simultanement) ;
- rendre compte clairement.

Ne jamais faire :

- modifier sans confirmation ;
- inventer une API ou un comportement non verifie ;
- exposer un secret ;
- faire un refactor massif opportuniste ;
- changer un port sans validation ;
- modifier `.env` reel sans demande explicite ;
- supprimer des fichiers sans confirmation ;
- laisser une modification de code sans verifier son impact documentaire.

---

## Mise a jour de ce fichier

Ce fichier doit evoluer avec GW2Nexus. Toute nouvelle convention durable, decision de workflow ou regle d'architecture adoptee pendant les corrections doit etre ajoutee ici apres validation.
