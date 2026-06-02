# GW2Nexus

GW2Nexus est une application full-stack pour une communaute Guild Wars 2.

Le projet est actuellement organise en deux applications principales :

- `frontend/` : application React + TypeScript servie par Vite.
- `backend/` : API Laravel exposee en HTTP sur le port `8000`.

Cette documentation decrit l'etat reel observe pendant l'audit technique du 2026-06-02.

## Stack constatee

| Couche | Technologie |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7, React Router, Axios, Zustand, TanStack Query |
| Backend | Laravel 12, PHP 8.2+, Sanctum |
| Base de donnees | MySQL 8 |
| Dev tools | Docker Compose, phpMyAdmin, Mailpit |

## Ports locaux

| Service | URL / port hote | Remarque |
| --- | --- | --- |
| Frontend Vite | http://localhost:5174 | Port frontend de reference du projet |
| Backend Laravel | http://localhost:8000 | API Laravel directe |
| Health API | http://localhost:8000/api/health | Route health non versionnee |
| phpMyAdmin | http://localhost:8080 | Interface MySQL |
| Mailpit UI | http://localhost:8025 | Emails de dev |
| Mailpit SMTP | localhost:1025 | SMTP local |
| MySQL depuis l'hote | localhost:3307 | Mapping Docker hote |
| MySQL dans Docker | mysql:3306 | Nom de service Docker |

Important : le frontend utilise `5174`. Ne pas revenir a `5173` sans realigner Vite, Docker, CORS/Sanctum et les fichiers `.env`.

## Fichiers d'environnement

Le projet utilise trois fichiers d'environnement distincts :

| Fichier exemple | Fichier local attendu | Utilisation |
| --- | --- | --- |
| `.env.example` | `.env` | Variables Docker Compose racine |
| `backend/.env.example` | `backend/.env` | Variables Laravel |
| `frontend/.env.example` | `frontend/.env` | Variables Vite exposees au frontend |

Commandes de copie :

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Ne jamais placer de secrets dans `frontend/.env`, car les variables `VITE_*` sont exposees au navigateur.

## Demarrage avec Docker

Premier demarrage ou rebuild :

```bash
docker compose up -d --build
```

Demarrage standard :

```bash
docker compose up -d
```

Voir l'etat des services :

```bash
docker compose ps
```

Voir les logs :

```bash
docker compose logs -f
```

Arreter les services :

```bash
docker compose down
```

Reset complet des volumes Docker, y compris la base MySQL :

```bash
docker compose down -v
```

Attention : `docker compose down -v` supprime les donnees stockees dans les volumes Docker.

## Services Docker

Le fichier `docker-compose.yml` definit les services suivants :

| Service Compose | Role |
| --- | --- |
| `mysql` | Base de donnees MySQL 8 |
| `phpmyadmin` | Interface de gestion MySQL |
| `mailpit` | Capture des emails en developpement |
| `laravel` | Backend Laravel sur `8000` |
| `react` | Frontend Vite sur `5174` |

Exemples de commandes utiles :

```bash
docker compose exec laravel php artisan route:list --path=api
docker compose exec laravel php artisan config:clear
docker compose exec react npm run lint
```

## Backend Laravel

Depuis le dossier `backend/`, les commandes principales sont :

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan route:list --path=api
php artisan test
```

Dans Docker, prefixer avec le service `laravel` :

```bash
docker compose exec laravel composer install
docker compose exec laravel php artisan key:generate
docker compose exec laravel php artisan migrate
docker compose exec laravel php artisan route:list --path=api
```

La route de verification API confirmee est :

```text
GET /api/health
```

## Frontend React/Vite

Depuis le dossier `frontend/` :

```bash
npm install
npm run dev
npm run lint
npm run build
```

Verifications utilisees pendant l'audit :

```bash
npm.cmd exec tsc -- --noEmit --pretty false
npm.cmd run lint
```

Le serveur Vite doit etre disponible sur :

```text
http://localhost:5174
```

## Communication frontend/backend

Le frontend utilise `VITE_API_URL=http://localhost:5174` afin de passer par le proxy Vite.

Les appels relatifs `/api/*` et `/sanctum/*` doivent etre proxies vers Laravel. Cela limite les problemes CORS et garde le frontend sur le meme domaine local `localhost:5174`.

Cote Laravel, les variables importantes sont :

```env
FRONTEND_URL=http://localhost:5174
SANCTUM_STATEFUL_DOMAINS=localhost:5174,127.0.0.1:5174
```

## Base de donnees

Dans Docker :

```env
DB_HOST=mysql
DB_PORT=3306
```

Depuis la machine hote, utiliser le port publie :

```env
DB_HOST=127.0.0.1
DB_PORT=3307
```

Le mapping Docker actuel est :

```text
3307:3306
```

## Verifications rapides

```bash
docker compose config
npm.cmd exec tsc -- --noEmit --pretty false
npm.cmd run lint
```

Pendant l'audit, TypeScript et ESLint frontend passent apres corrections progressives.

## Documentation d'audit

Les documents de suivi sont dans :

```text
docs/audit/
```

Fichiers principaux :

- `docs/audit/AUDIT_GW2NEXUS.md`
- `docs/audit/PLAN_CORRECTION_GW2NEXUS.md`
- `docs/audit/CHANGELOG_CORRECTIONS_GW2NEXUS.md`
- `docs/audit/DECISIONS_TECHNIQUES_GW2NEXUS.md`

