# Instructions Claude/Codex - Projet GW2Nexus

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
- Documenter chaque correction dans `docs/audit/`.
- Executer les tests/verifications prevus apres chaque etape appliquee.
- Ne jamais faire de refactor massif non demande.
- Ne jamais supprimer de fichier sans confirmation explicite.

---

## Stack technique constatee

### Frontend

- React 19
- TypeScript
- Vite 7
- React Router
- Axios
- Zustand
- TanStack Query
- CSS modules

### Backend

- Laravel 12
- PHP 8.4+ (composer.lock genere sur PHP 8.4 — version minimum imposee par platform_check.php)
- Laravel Sanctum
- Eloquent ORM
- Form Requests
- API REST versionnee sous `/api/v1/*`, avec route health non versionnee `/api/health`

### Infrastructure locale

- Docker Compose
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

Le port frontend de reference est `5174`. Ne pas revenir a `5173` sans realigner Vite, Docker, CORS/Sanctum, `.env.example`, README et documentation d'audit.

---

## Structure du projet

```text
backend/                  # API Laravel
frontend/                 # SPA React/Vite
docker/                   # Fichiers Docker annexes
docs/audit/               # Audit, plan, changelog et decisions techniques
.claude/                  # Instructions de collaboration IA
README.md                 # Documentation locale courte et fiable
docker-compose.yml        # Stack locale dev
docker-compose.prod.yml   # Stack production
```

Fichiers d'audit obligatoires :

```text
docs/audit/AUDIT_GW2NEXUS.md
docs/audit/PLAN_CORRECTION_GW2NEXUS.md
docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md
docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md
```

---

## Workflow obligatoire de correction

Avant chaque modification, presenter une etape avec :

- titre de l'etape ;
- probleme cible ;
- fichiers concernes ;
- modifications prevues ;
- risques ;
- tests/verifications prevus ;
- documentation Markdown a mettre a jour ;
- question finale : `Confirme-tu que je peux appliquer cette etape ?`

Apres confirmation seulement :

- verifier `git status --short` ;
- appliquer uniquement l'etape validee ;
- executer les tests prevus ;
- documenter dans `docs/audit/` ;
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
- `docker compose config` peut afficher un warning d'acces a `C:\Users\oui\.docker\config.json`; le documenter s'il apparait, mais ne pas le confondre avec un echec applicatif.
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

## Documentation

Mettre a jour `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md` apres chaque changement applique.

Mettre a jour `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md` quand une decision d'architecture, de securite, de test ou d'environnement est prise.

Mettre a jour `docs/audit/PLAN_CORRECTION_GW2NEXUS.md` avec le statut des etapes.

Mettre a jour `docs/audit/AUDIT_GW2NEXUS.md` quand un probleme est corrige ou requalifie.

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
- proposer une etape avant d'appliquer ;
- attendre confirmation explicite ;
- appliquer une correction minimale ;
- tester ;
- documenter ;
- rendre compte clairement.

Ne jamais faire :

- modifier sans confirmation ;
- inventer une API ou un comportement non verifie ;
- exposer un secret ;
- faire un refactor massif opportuniste ;
- changer un port sans validation ;
- modifier `.env` reel sans demande explicite ;
- supprimer des fichiers sans confirmation.

---

## Mise a jour de ce fichier

Ce fichier doit evoluer avec GW2Nexus. Toute nouvelle convention durable, decision de workflow ou regle d'architecture adoptee pendant les corrections doit etre ajoutee ici apres validation.

