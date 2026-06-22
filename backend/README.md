# GW2 Nexus — Backend

API REST Laravel 12 alimentant la plateforme GW2 Nexus.

## Architecture

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/    # Contrôleurs par domaine (Auth, Forum, Profile, Admin, Events, Contact)
│   │   ├── Middleware/         # AdminMiddleware, BanCheck
│   │   ├── Requests/           # Form Requests (validation)
│   │   └── Resources/          # API Resources (sérialisation JSON)
│   ├── Models/                 # User, ProfilGw2, UserBan, Forum*
│   ├── Services/               # Gw2ApiService, AdminUserService
│   └── Mail/                   # ContactMail
├── database/
│   ├── migrations/             # 10 migrations
│   └── factories/
├── routes/
│   ├── api.php                 # Routes /api/v1/* et /api/health
│   └── web.php
└── tests/
    ├── Feature/                # Tests Auth, Forum
    └── Unit/
```

## Technologies

| Composant | Version |
|---|---|
| PHP | 8.4+ |
| Laravel | 12.x |
| Laravel Sanctum | 4.3 |
| MySQL | 8.0 |
| PHPUnit | 11.x |

## Installation locale

### Avec Docker (recommandé)

Le backend démarre automatiquement via Docker Compose depuis la racine du projet :

```bash
docker compose up -d --build
```

L'API est disponible sur `http://localhost:8000`.

### Sans Docker

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Prérequis : PHP 8.4+, Composer, MySQL 8 accessible sur le port configuré dans `.env`.

## Configuration

Copier et adapter `.env.example` :

```bash
cp .env.example .env
php artisan key:generate
```

Variables clés à configurer :

| Variable | Description |
|---|---|
| `APP_KEY` | Clé de chiffrement AES (générée automatiquement) |
| `DB_HOST` / `DB_PORT` | Hôte MySQL (`mysql:3306` en Docker, `127.0.0.1:3307` depuis l'hôte) |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | Identifiants MySQL |
| `FRONTEND_URL` | URL du frontend React (CORS) |
| `SANCTUM_STATEFUL_DOMAINS` | Domaines autorisés pour l'auth |
| `GW2_API_BASE_URL` | URL API ArenaNet |
| `MAIL_HOST` / `MAIL_PORT` | SMTP (`mailpit:1025` en dev) |

Documentation complète → [docs/devops/variables-env.md](../docs/devops/variables-env.md)

## Scripts disponibles

```bash
# Migrations
php artisan migrate
php artisan migrate:status
php artisan migrate:fresh --seed     # Reset complet ⚠️

# Tests
php artisan test
php artisan test --filter AuthTest
php artisan test --verbose

# Routes API
php artisan route:list --path=api

# Cache
php artisan cache:clear
php artisan config:clear

# REPL interactif
php artisan tinker
```

### Depuis Docker Compose

```bash
docker compose exec laravel php artisan migrate
docker compose exec laravel php artisan test
docker compose exec laravel php artisan route:list --path=api
docker compose exec laravel php artisan tinker
```

## API REST

Base URL : `/api/v1`

| Domaine | Endpoints | Auth requise |
|---|---|---|
| Authentification | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me` | Non (login/register) |
| Profil GW2 | `/profile`, `/profile/api-key`, `/profile/gw2-data`, `/profile/world-boss-status` | Oui |
| Forum | `/forum/categories`, `/forum/threads`, `/forum/posts` | Lecture : Non / Écriture : Oui |
| Admin | `/admin/users`, `/admin/stats`, `/admin/forum/reports` | Admin/Modérateur |
| Events | `/events/schedule` | Non |
| Contact | `/contact` | Non |

Documentation complète → [docs/api/overview.md](../docs/api/overview.md)

### Authentification

**Sanctum Bearer Token** (stateless). Chaque requête protégée doit inclure :

```http
Authorization: Bearer {token}
```

Le token est obtenu via `POST /api/v1/auth/login` ou `POST /api/v1/auth/register`.

## Base de données

10 tables principales : `users`, `profils_gw2`, `user_bans`, `personal_access_tokens`, `forum_categories`, `forum_threads`, `forum_posts`, `forum_post_reports`, `cache`, `jobs`.

Schéma complet → [docs/database/schema.md](../docs/database/schema.md)

## Tests

```bash
# Depuis la racine Docker
docker compose exec laravel php artisan test

# Hors Docker
cd backend && php artisan test
```

Configuration : SQLite in-memory (`backend/phpunit.xml`). Isolation totale entre les tests via `RefreshDatabase`.

Tests existants :
- `tests/Feature/Auth/AuthTest.php` — Inscription, connexion, déconnexion, rate limiting
- `tests/Feature/Forum/ForumModerationTest.php` — Threads, posts, signalements, modération

Guide complet → [docs/testing/overview.md](../docs/testing/overview.md)

## Qualité de code

```bash
# Formatage PHP (Laravel Pint)
docker compose exec laravel ./vendor/bin/pint

# Vérification sans modification
docker compose exec laravel ./vendor/bin/pint --test
```

## Sécurité

| Aspect | Implémentation |
|---|---|
| Passwords | bcrypt, 12 rounds (cast `hashed`) |
| Clés API GW2 | Chiffrement AES-256-CBC (cast `encrypted`) |
| Tokens | Hash SHA-256 en base (Sanctum) |
| Rate limiting | Login : 5/min, forgot-pwd : 3/min |
| Ban system | Temporaire ou permanent, révocation tokens |

Documentation sécurité → [docs/security/overview.md](../docs/security/overview.md)

## Intégration GW2 API

Le service `Gw2ApiService` encapsule tous les appels vers `api.guildwars2.com/v2` :
- Validation de clé API (`/v2/tokeninfo`)
- Données de compte (`/v2/account`)
- Personnages (`/v2/characters`)
- World bosses (`/v2/account/worldbosses`)

Cache de 5 minutes. Fallback gracieux sur erreur réseau (retourne `null`).

Documentation → [docs/game/gw2-api.md](../docs/game/gw2-api.md)

## Troubleshooting

**Migrations échouent**
```bash
# Vérifier la connexion MySQL
docker compose exec laravel php artisan migrate:status
```

**APP_KEY manquante**
```bash
docker compose exec laravel php artisan key:generate
```

**Erreur 500 en production**
- Vérifier `APP_DEBUG=false` et `APP_ENV=production`
- Consulter `storage/logs/laravel.log`

**API GW2 indisponible**
- Normal : le service retourne `null`, le frontend affiche "Données indisponibles"
- Vérifier https://status.guildwars2.com/

Runbook complet → [docs/operations/runbook.md](../docs/operations/runbook.md)
