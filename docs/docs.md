# GW2Nexus — Documentation Complète du Projet

> **Hub communautaire moderne dédié à Guild Wars 2**
> Stack : Laravel 11 · React 18 / TypeScript · MySQL 8 · Docker · VPS

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Stack technique](#2-stack-technique)
3. [Architecture globale](#3-architecture-globale)
4. [Structure des dossiers](#4-structure-des-dossiers)
5. [Environnement de développement](#5-environnement-de-développement)
6. [Base de données](#6-base-de-données)
7. [Backend — Laravel 11](#7-backend--laravel-11)
8. [Frontend — React 18 / TypeScript](#8-frontend--react-18--typescript)
9. [Authentification](#9-authentification)
10. [Intégration API Guild Wars 2](#10-intégration-api-guild-wars-2)
11. [Fonctionnalités implémentées](#11-fonctionnalités-implémentées)
12. [API REST — Référence des endpoints](#12-api-rest--référence-des-endpoints)
13. [Gestion de projet — Scrum](#13-gestion-de-projet--scrum)
14. [CI/CD et déploiement](#14-cicd-et-déploiement)
15. [Tests](#15-tests)
16. [Sécurité](#16-sécurité)
17. [Conventions de code](#17-conventions-de-code)
18. [Décisions techniques importantes](#18-décisions-techniques-importantes)
19. [Roadmap — Sprints restants](#19-roadmap--sprints-restants)
20. [Glossaire](#20-glossaire)

---

## 1. Vue d'ensemble du projet

### Qu'est-ce que GW2Nexus ?

GW2Nexus est une application web communautaire full-stack dédiée au MMORPG **Guild Wars 2** (ArenaNet). Elle combine :

- Un **forum de discussion** communautaire
- Des **profils joueurs** liés au compte GW2 officiel via clé API
- Un système de **builds** (créer, partager, commenter des configurations de personnages)
- Des **pages de guildes** liées à l'API GW2 officielle
- Une **base de données d'objets** du jeu avec recherche et filtres
- Un **timer d'événements world boss** en temps réel

### Contexte

| Élément | Détail |
|---|---|
| Équipe | 2 développeurs |
| Durée totale | 3 mois (6 sprints de 2 semaines) |
| Méthodologie | Agile Scrum |
| Statut actuel | Sprints 1, 2, 3 terminés — Sprint 4 en cours |
| Déploiement cible | VPS Linux (Ubuntu) avec Nginx + SSL |

### Proposition de valeur

GW2Nexus se différencie d'un forum générique en **intégrant nativement l'API officielle de Guild Wars 2** : les profils affichent les vraies données du compte, les discussions peuvent être liées à des objets du jeu, et les builds référencent directement les IDs de compétences et traits de l'API.

---

## 2. Stack technique

### Backend

| Technologie | Version | Rôle |
|---|---|---|
| PHP | 8.3 | Runtime |
| Laravel | 11 | Framework API REST |
| Laravel Sanctum | — | Authentification Bearer Token |
| Laravel HTTP Client | — | Appels API GW2 (Guzzle) |
| MySQL | 8.0 | Base de données principale |

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| React | 18 | UI Framework |
| TypeScript | — | Typage statique |
| Vite | — | Build tool + dev server |
| Axios | — | Client HTTP |
| Zustand | — | State management global |
| React Router | v6 | Routage SPA |
| CSS Modules | — | Styles scopés par composant |

### Infrastructure

| Technologie | Rôle |
|---|---|
| Docker + Docker Compose | Environnement de développement |
| Nginx | Reverse proxy (prod) + serveur React (dev) |
| Mailpit | Capture des emails en développement |
| phpMyAdmin | Interface BDD en développement |
| GitHub Actions | CI/CD (lint, tests, build, déploiement) |

### Services Docker (dev)

| Service | Image | Port exposé |
|---|---|---|
| `laravel` | `php:8.3-fpm-alpine` | `8000` |
| `react` | `node:20-alpine` + Nginx | `3000` |
| `mysql` | `mysql:8.0` | `3306` |
| `phpmyadmin` | `phpmyadmin` | `8080` |
| `mailpit` | `axllent/mailpit` | `8025` (UI), `1025` (SMTP) |

---

## 3. Architecture globale

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                React 18 + TypeScript                     │
│            Port 3000 (dev) / CDN/Nginx (prod)            │
└─────────────────────────┬───────────────────────────────┘
                          │  HTTP /api/* (Bearer Token)
                          │  Vite Proxy → laravel:8000
                          │
┌─────────────────────────▼───────────────────────────────┐
│                BACKEND — Laravel 11                      │
│              API REST versionnée /api/v1/                │
│                    Port 8000 (FPM)                       │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
    ┌──────▼──────┐           ┌───────▼────────┐
    │  MySQL 8    │           │  API GW2 v2    │
    │  Port 3306  │           │  api.guildwars2│
    │  Données    │           │  .com          │
    │  internes   │           │  (externe)     │
    └─────────────┘           └────────────────┘
```

### Principes architecturaux

- **Séparation stricte** Backend / Frontend (domaines séparés en production)
- **API REST versionnée** : toutes les routes préfixées par `/api/v1/`
- **Bearer Token** (et non cookie SPA) — choix imposé par la séparation de domaines
- **Vite Proxy** en développement : `VITE_API_URL` vide → Axios utilise des URLs relatives → proxy Vite vers `http://laravel:8000`
- **Controllers légers** : logique métier déléguée aux Services
- **CSS Modules** : aucun style global, chaque composant est autonome

---

## 4. Structure des dossiers

### Backend (Laravel)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── Auth/
│   │   │       │   ├── LoginController.php
│   │   │       │   ├── LogoutController.php
│   │   │       │   └── RegisterController.php
│   │   │       ├── Forum/
│   │   │       │   ├── CategoryController.php
│   │   │       │   ├── DiscussionController.php
│   │   │       │   └── CommentController.php
│   │   │       ├── Profile/
│   │   │       │   └── UserProfileController.php
│   │   │       ├── Admin/
│   │   │       │   └── AdminController.php
│   │   │       └── Gw2/
│   │   │           └── Gw2Controller.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   └── BanCheck.php
│   │   └── Requests/
│   │       └── (Form Requests par feature)
│   ├── Models/
│   │   ├── User.php
│   │   ├── Discussion.php
│   │   ├── Comment.php
│   │   ├── Category.php
│   │   └── ...
│   ├── Services/
│   │   └── Gw2ApiService.php
│   └── Policies/
│       ├── DiscussionPolicy.php
│       └── CommentPolicy.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── .env
├── .env.testing
└── docker/
    └── php/
        └── Dockerfile
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                        # Composants génériques réutilisables
│   │   ├── layout/
│   │   │   ├── NavbarComponent/
│   │   │   │   ├── NavbarComponent.tsx
│   │   │   │   └── NavbarComponent.module.css
│   │   │   └── FooterComponent/
│   │   ├── auth/
│   │   ├── forum/
│   │   ├── profile/
│   │   ├── admin/
│   │   └── gw2/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Profile/
│   │   ├── Forum/
│   │   ├── Admin/
│   │   └── Gw2/
│   ├── hooks/
│   │   ├── auth/
│   │   ├── forum/
│   │   ├── profile/
│   │   └── ui/
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   └── useProfileStore.ts
│   ├── api/
│   │   ├── httpClient.ts              # Instance Axios + intercepteur Bearer
│   │   └── endpoints.ts              # Objet ENDPOINTS centralisé
│   ├── data/
│   │   └── (données statiques par feature)
│   ├── router/
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── GuestRoute.tsx
│   └── types/
│       └── (interfaces TypeScript)
├── public/
├── vite.config.ts
├── tsconfig.json
└── docker/
    └── nginx/
        └── default.conf
```

---

## 5. Environnement de développement

### Prérequis

- Docker Desktop (Windows/Mac/Linux)
- Git

### Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/evan-prn/gw2nexus.git
cd gw2nexus

# 2. Copier les fichiers d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Démarrer les conteneurs
docker compose up -d

# 4. Installer les dépendances backend
docker compose exec laravel composer install
docker compose exec laravel php artisan key:generate
docker compose exec laravel php artisan migrate --seed

# 5. Installer les dépendances frontend
docker compose exec react npm install

# L'application est accessible sur :
# Frontend  → http://localhost:3000
# API       → http://localhost:8000
# phpMyAdmin → http://localhost:8080
# Mailpit   → http://localhost:8025
```

### Variables d'environnement importantes

#### Backend `.env`

```dotenv
APP_NAME=GW2Nexus
APP_ENV=local
APP_KEY=                          # Généré par php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=gw2nexus
DB_USERNAME=gw2nexus
DB_PASSWORD=secret

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

# IMPORTANT : jamais de commentaire inline sur une ligne APP_KEY
# APP_KEY=base64:xxx  # commentaire  ← CASSE php artisan key:generate
```

#### Frontend `.env`

```dotenv
# CRITIQUE : laisser vide pour que Vite proxy fonctionne
# Si défini (ex: http://localhost:8000), Axios utilise l'URL absolue
# et bypasse le proxy → les cookies/headers CORS cassent
VITE_API_URL=
```

### Commandes Docker fréquentes

```bash
# Backend
docker compose exec laravel php artisan migrate:fresh --seed
docker compose exec laravel php artisan test
docker compose exec laravel php artisan route:list
docker compose exec laravel composer require <package>

# Frontend
docker compose exec react npm run dev
docker compose exec react npm run build
docker compose exec react npm run lint

# Base de données
docker compose exec mysql mysql -u gw2nexus -psecret gw2nexus
```

---

## 6. Base de données

### Schéma — 12 tables

```
utilisateurs ──< discussions ──< commentaires
     │               │
     │           categories
     │               │
     ├──< builds ──< commentaires_build
     │
     ├──< membres_guilde >── guildes
     │
     └── profils_gw2

discussions >─< tags (via discussion_tag)
discussions >── items_gw2
```

### Description des tables

#### `utilisateurs`

Utilisateurs de la plateforme.

| Colonne | Type | Description |
|---|---|---|
| `id` | BIGINT UNSIGNED PK | Identifiant auto-increment |
| `nom` | VARCHAR(100) | Nom d'affichage public |
| `email` | VARCHAR(255) UNIQUE | Email de connexion |
| `mot_de_passe` | VARCHAR(255) | Hash bcrypt |
| `pseudo_gw2` | VARCHAR(100) NULL | Pseudo GW2 affiché |
| `avatar` | VARCHAR(500) NULL | URL avatar |
| `role` | ENUM('user','moderateur','admin') | Rôle sur la plateforme |
| `api_key` | VARCHAR(72) NULL ENCRYPTED | Clé API GW2 chiffrée AES-256 |
| `email_verifie_le` | TIMESTAMP NULL | Date vérification email |
| `deleted_at` | TIMESTAMP NULL | Soft delete |

> **Note** : `api_key` utilise le cast `encrypted` d'Eloquent. La colonne MySQL est dimensionnée pour le texte chiffré (plus long que la clé brute de 72 car.).

#### `profils_gw2`

Données GW2 synchronisées via l'API officielle.

| Colonne | Type | Description |
|---|---|---|
| `user_id` | FK → utilisateurs UNIQUE | Relation 1-1 |
| `nom_compte` | VARCHAR(100) NULL | Format `Nom.1234` |
| `monde` | VARCHAR(100) NULL | Serveur GW2 |
| `personnages` | JSON NULL | Liste des personnages |
| `derniere_synchro` | TIMESTAMP NULL | Dernière synchro API |
| `valide` | BOOLEAN DEFAULT false | Clé API valide |

#### `categories`

Catégories du forum (hiérarchiques via `parent_id`).

| Colonne | Type | Description |
|---|---|---|
| `parent_id` | FK → categories NULL | Sous-catégorie |
| `nom` | VARCHAR(100) | Nom affiché |
| `slug` | VARCHAR(100) UNIQUE | URL-friendly |
| `ordre` | INT DEFAULT 0 | Ordre d'affichage |

#### `discussions`

Sujets de forum.

| Colonne | Type | Description |
|---|---|---|
| `user_id` | FK → utilisateurs NULL | SET NULL si user supprimé |
| `categorie_id` | FK → categories NOT NULL | RESTRICT (catégorie non vide) |
| `item_gw2_id` | FK → items_gw2 NULL | Lien optionnel vers item GW2 |
| `titre` | VARCHAR(255) | Titre de la discussion |
| `slug` | VARCHAR(255) UNIQUE | URL-friendly |
| `contenu` | LONGTEXT | HTML (éditeur TipTap) |
| `vues` | INT UNSIGNED DEFAULT 0 | Compteur de vues |
| `epingle` | BOOLEAN DEFAULT false | Épinglé en haut |
| `deleted_at` | TIMESTAMP NULL | Soft delete |

#### `commentaires`

Réponses aux discussions.

| Colonne | Type | Description |
|---|---|---|
| `discussion_id` | FK → discussions | CASCADE on delete |
| `user_id` | FK → utilisateurs NULL | SET NULL si user supprimé |
| `contenu` | LONGTEXT | HTML |
| `est_solution` | BOOLEAN DEFAULT false | Marqué comme réponse acceptée |
| `signale` | BOOLEAN DEFAULT false | Signalé pour modération |
| `deleted_at` | TIMESTAMP NULL | Soft delete |

#### `guildes`

Pages de guildes GW2.

| Colonne | Type | Description |
|---|---|---|
| `leader_id` | FK → utilisateurs RESTRICT | Impossible de supprimer le leader |
| `gw2_guild_id` | VARCHAR(40) UNIQUE | UUID officiel GW2 |
| `nom` | VARCHAR(100) | Nom officiel |
| `tag` | VARCHAR(5) | Tag entre crochets (ex: MEOW) |
| `deleted_at` | TIMESTAMP NULL | Soft delete |

#### `membres_guilde`

Table pivot étendue (relation N-N Utilisateur ↔ Guilde).

| Colonne | Type | Description |
|---|---|---|
| `guilde_id` | FK → guildes | CASCADE |
| `user_id` | FK → utilisateurs | CASCADE |
| `role` | ENUM('leader','officier','member') | Rôle dans la guilde |
| `inviteur_id` | FK → utilisateurs NULL | Qui a invité |
| Index UNIQUE | (guilde_id, user_id) | Pas de doublons |

#### `builds`

Builds de personnages partagés.

| Colonne | Type | Description |
|---|---|---|
| `user_id` | FK → utilisateurs NULL | SET NULL si supprimé |
| `profession` | VARCHAR(50) | Ex: Guardian, Necromancer |
| `mode_jeu` | ENUM('pve','pvp','wvw') | Mode ciblé |
| `competences` | JSON | IDs compétences API GW2 |
| `traits` | JSON | IDs traits API GW2 |
| `equipement` | JSON NULL | Stats, runes, cachets |
| `nb_likes` | INT DEFAULT 0 | Likes communauté |
| `est_public` | BOOLEAN DEFAULT true | false = brouillon |
| `deleted_at` | TIMESTAMP NULL | Soft delete |

#### `items_gw2`

Cache local des objets GW2.

| Colonne | Type | Description |
|---|---|---|
| `gw2_item_id` | INT UNIQUE | ID officiel API GW2 |
| `nom` | VARCHAR(255) | Nom de l'objet |
| `type` | VARCHAR(50) | Armor, Weapon, Consumable… |
| `rarete` | ENUM | Junk → Legendary |
| `donnees` | JSON | Données complètes API en cache |
| `icone_url` | VARCHAR(500) NULL | CDN ArenaNet |

#### `tags`, `discussion_tag`

Système de tags sur les discussions (N-N).

### Index recommandés

```sql
-- Authentification
CREATE UNIQUE INDEX idx_users_email ON utilisateurs(email);

-- Forum
CREATE INDEX idx_disc_category ON discussions(categorie_id);
CREATE INDEX idx_disc_user ON discussions(user_id);
CREATE UNIQUE INDEX idx_disc_slug ON discussions(slug);
CREATE FULLTEXT INDEX idx_disc_fulltext ON discussions(titre, contenu);
CREATE INDEX idx_comm_disc ON commentaires(discussion_id);

-- Guildes
CREATE UNIQUE INDEX idx_mg_unique ON membres_guilde(guilde_id, user_id);

-- Items GW2
CREATE UNIQUE INDEX idx_items_gw2id ON items_gw2(gw2_item_id);

-- Tags
CREATE UNIQUE INDEX idx_dt_unique ON discussion_tag(discussion_id, tag_id);
```

### Règles d'intégrité référentielle importantes

| Relation | ON DELETE | Raison |
|---|---|---|
| `discussions.user_id` | SET NULL | Discussions conservées si user supprimé, auteur anonymisé |
| `discussions.categorie_id` | RESTRICT | Impossible de supprimer une catégorie non vide |
| `commentaires.discussion_id` | CASCADE | Suppression discussion → supprime ses commentaires |
| `guildes.leader_id` | RESTRICT | Impossible de supprimer le leader sans transférer |
| `profils_gw2.user_id` | CASCADE | Suppression user → supprime son profil GW2 |

---

## 7. Backend — Laravel 11

### Namespace des controllers

```
App\Http\Controllers\Api\{Feature}\{Name}Controller
```

Exemples :
- `App\Http\Controllers\Api\Auth\LoginController`
- `App\Http\Controllers\Api\Forum\DiscussionController`
- `App\Http\Controllers\Api\Admin\AdminController`

### Routes API (`routes/api.php`)

```php
Route::prefix('v1')->group(function () {

    // Auth (public)
    Route::post('/register', [RegisterController::class, 'store']);
    Route::post('/login', [LoginController::class, 'store']);

    // Protégées par Sanctum + BanCheck
    Route::middleware(['auth:sanctum', 'ban.check'])->group(function () {

        Route::post('/logout', [LogoutController::class, 'destroy']);

        // Profil
        Route::get('/profile', [UserProfileController::class, 'show']);
        Route::put('/profile', [UserProfileController::class, 'update']);
        Route::post('/profile/api-key', [UserProfileController::class, 'storeApiKey']);

        // GW2
        Route::get('/gw2/account', [Gw2Controller::class, 'account']);
        Route::get('/gw2/characters', [Gw2Controller::class, 'characters']);

        // Forum
        Route::apiResource('forum/categories', CategoryController::class)->only(['index','show']);
        Route::apiResource('forum/discussions', DiscussionController::class);
        Route::apiResource('forum/discussions.comments', CommentController::class);
        Route::patch('/forum/comments/{comment}/solution', [CommentController::class, 'markSolution']);

        // Admin
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users/{user}/ban', [AdminController::class, 'ban']);
            Route::post('/users/{user}/unban', [AdminController::class, 'unban']);
            Route::get('/stats', [AdminController::class, 'stats']);
        });
    });

    // Forum public (lecture seule)
    Route::get('/forum/categories', [CategoryController::class, 'index']);
    Route::get('/forum/discussions', [DiscussionController::class, 'index']);
    Route::get('/forum/discussions/{discussion}', [DiscussionController::class, 'show']);
});
```

### Middlewares personnalisés

#### `BanCheck`

Vérifie si l'utilisateur authentifié est banni. Si `banned_at` est renseigné, retourne une `403` avant d'atteindre le controller.

```php
// Appliqué sur toutes les routes protégées
Route::middleware(['auth:sanctum', 'ban.check'])
```

#### `AdminMiddleware`

Vérifie que `user->role === 'admin'`. Retourne `403` sinon.

### Modèles Eloquent — Points importants

#### `User`

```php
// Cast clé API chiffrée
protected $casts = [
    'api_key' => 'encrypted',
    'email_verified_at' => 'datetime',
];

// Soft deletes
use SoftDeletes;
```

#### `Discussion`

```php
// Soft deletes + Full-text search
use SoftDeletes;

// Relation vers commentaire solution
public function solution(): HasOne
{
    return $this->hasOne(Comment::class)->where('est_solution', true)->latestOfMany('id');
    // IMPORTANT : latestOfMany('id') et non ofMany() → compatibilité MySQL 8 only_full_group_by
}
```

### Service GW2 (`Gw2ApiService`)

Wrapper du client HTTP Laravel pour l'API GW2 officielle.

```php
class Gw2ApiService
{
    private string $baseUrl = 'https://api.guildwars2.com/v2';

    public function getAccount(string $apiKey): array
    {
        return Cache::remember("gw2_account_{$apiKey}", 300, function () use ($apiKey) {
            return Http::withHeaders(['Authorization' => "Bearer {$apiKey}"])
                ->get("{$this->baseUrl}/account")
                ->throw()
                ->json();
        });
    }

    public function validateToken(string $apiKey): bool
    {
        try {
            $response = Http::withHeaders(['Authorization' => "Bearer {$apiKey}"])
                ->get("{$this->baseUrl}/tokeninfo");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }
}
```

### Rate limiting

```php
// Contact form : 3 tentatives / 10 min
Route::middleware('throttle:3,10')->post('/contact', ...);

// Auth : 10 tentatives / min (Sanctum default)
```

### Pagination curseur (forum)

Le forum utilise la **pagination curseur** (`cursorPaginate`) plutôt que la pagination offset pour les performances sur grand volume.

```php
// DiscussionController::index()
return Discussion::with(['user', 'category', 'latestComment'])
    ->withCount('comments')
    ->cursorPaginate(20);
```

---

## 8. Frontend — React 18 / TypeScript

### Client HTTP (`src/api/httpClient.ts`)

Instance Axios partagée avec intercepteur Bearer Token automatique.

```typescript
import axios from 'axios';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// Injection automatique du token Bearer
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpClient;
```

> **CRITIQUE** : `VITE_API_URL` doit rester vide en développement. Si défini en URL absolue, Axios bypasse le proxy Vite et les requêtes CORS échouent.

### Endpoints centralisés (`src/api/endpoints.ts`)

```typescript
export const ENDPOINTS = {
    auth: {
        register: '/api/v1/register',
        login: '/api/v1/login',
        logout: '/api/v1/logout',
    },
    profile: {
        get: '/api/v1/profile',
        update: '/api/v1/profile',
        apiKey: '/api/v1/profile/api-key',
    },
    gw2: {
        account: '/api/v1/gw2/account',
        characters: '/api/v1/gw2/characters',
    },
    forum: {
        categories: '/api/v1/forum/categories',
        discussions: '/api/v1/forum/discussions',
        comments: (discussionId: number) => `/api/v1/forum/discussions/${discussionId}/comments`,
    },
    admin: {
        users: '/api/v1/admin/users',
        ban: (id: number) => `/api/v1/admin/users/${id}/ban`,
        unban: (id: number) => `/api/v1/admin/users/${id}/unban`,
        stats: '/api/v1/admin/stats',
    },
} as const;
```

**Règle** : Tout fichier API du frontend utilise **exclusivement** `ENDPOINTS.feature.xxx`. Jamais d'URL en dur dans les composants.

### Stores Zustand

#### `useAuthStore`

```typescript
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}
```

> **Important** : `logout()` appelle `useProfileStore.getState().reset()` pour effacer les données de profil stale lors d'un changement d'utilisateur.

#### `useProfileStore`

```typescript
interface ProfileState {
    profile: GW2Profile | null;
    isLoading: boolean;
    setProfile: (profile: GW2Profile) => void;
    reset: () => void;
}
```

### Architecture des composants

**Convention de nommage stricte :**

```
src/components/{feature}/{NomComponent}Component/
├── NomComponentComponent.tsx
└── NomComponentComponent.module.css
```

- **Composants** : `src/components/{feature}/{NomComponent}Component/`
- **Hooks** (partagés) : `src/hooks/{feature}/useXxx.ts`
- **Hooks** (locaux à une page) : dans le dossier de la page → migrent vers `src/hooks/ui/` dès qu'une 2e page en a besoin
- **Pages** : `src/pages/{PageName}/` — orchestrateurs purs, zéro logique métier
- **UI générique** : `src/components/ui/`
- **Guards de route** : `src/router/` (avec `GuestRoute`, `ProtectedRoute`)

### CSS Modules — Règles

```css
/* ✅ Correct : variantes redéclarent toutes les propriétés */
.button { background: var(--gold-primary); color: white; padding: 8px 16px; }
.buttonActive { background: var(--gold-dark); color: white; padding: 8px 16px; }

/* ❌ Interdit : surcharge via composes */
.buttonActive { composes: button; background: var(--gold-dark); }
```

### Identité visuelle

| Variable CSS | Valeur | Usage |
|---|---|---|
| `--bg-primary` | `#0e0e12` | Fond principal (dark fantasy) |
| `--gold-primary` | `#c9a84c` | Accent or GW2 |
| `--gold-dark` | `#a8893e` | Or hover/actif |
| `--text-primary` | `#e8e0d0` | Texte principal |
| `--text-muted` | `#8a7a6a` | Texte secondaire |

Polices : **Cinzel** (titres) + **Crimson Pro** (corps de texte)

### Proxy Vite (`vite.config.ts`)

```typescript
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { '@': '/src' },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://laravel:8000',
                changeOrigin: true,
            },
        },
    },
});
```

---

## 9. Authentification

### Flux complet

```
1. POST /api/v1/register  → 201 { user, token }
2. POST /api/v1/login     → 200 { user, token }
   ↓
   Token stocké dans localStorage sous la clé 'auth_token'
   ↓
   useAuthStore.login(user, token)
   ↓
   Toutes les requêtes suivantes : Authorization: Bearer <token>
   ↓
3. POST /api/v1/logout    → 204 (révoque le token Sanctum)
   ↓
   localStorage.removeItem('auth_token')
   useAuthStore.logout()
   useProfileStore.reset()
```

### Pourquoi Bearer Token (et pas cookie SPA) ?

En production, le frontend et le backend sont sur des domaines différents. Les cookies SPA Sanctum nécessitent un domaine partagé. Le Bearer Token fonctionne cross-domain nativement. La migration depuis le mode cookie vers Bearer a été effectuée en Sprint 2.

### Vérification de ban au login

`LoginController` vérifie `banned_at` avant d'émettre le token. Si l'utilisateur est banni, la connexion est refusée avec un message explicatif. Le middleware `BanCheck` protège également toutes les routes authentifiées.

### Guards de route (Frontend)

```typescript
// ProtectedRoute.tsx — redirige vers /login si non authentifié
// GuestRoute.tsx    — redirige vers /profile si déjà authentifié
```

---

## 10. Intégration API Guild Wars 2

### Endpoints GW2 utilisés

| Endpoint GW2 | Usage |
|---|---|
| `GET /v2/tokeninfo` | Validation d'une clé API |
| `GET /v2/account` | Nom de compte, monde, âge |
| `GET /v2/characters` | Liste des personnages |
| `GET /v2/items/{id}` | Données d'un objet |
| `GET /v2/guild/{id}` | Informations d'une guilde |
| `GET /v2/maps` | Événements world boss |

### Stratégie de cache

Les appels à l'API GW2 sont coûteux (latence externe, rate limits ArenaNet). Le `Gw2ApiService` utilise le cache Laravel :

- **Données de compte** : TTL 5 minutes
- **Données d'items** : TTL 24 heures (table `items_gw2` = cache persistant)
- **World boss events** : Recalculé côté frontend (timers basés sur les spawns fixes)

### Clé API GW2 — Stockage sécurisé

```php
// Model User
protected $casts = ['api_key' => 'encrypted'];

// Eloquent chiffre automatiquement avec AES-256 via APP_KEY
// La colonne MySQL doit être VARCHAR(500) minimum pour le texte chiffré
// (la clé brute fait 72 caractères mais le texte chiffré est ~3x plus long)
```

---

## 11. Fonctionnalités implémentées

### ✅ Sprint 1 — Authentification & Fondations

- [x] Docker Compose complet (laravel, react, mysql, phpmyadmin, mailpit)
- [x] GitHub Actions CI (lint + tests + build)
- [x] Inscription (`POST /api/v1/register`)
- [x] Connexion (`POST /api/v1/login`) avec vérification de ban
- [x] Déconnexion (`POST /api/v1/logout`)
- [x] Frontend : pages Login, Register, layout global, Navbar, Footer
- [x] Thème GW2 dark fantasy (CSS Modules, variables CSS)
- [x] Bearer Token auth (Sanctum)

### ✅ Sprint 2 — Profils & API GW2

- [x] Migration table `profils_gw2`
- [x] `Gw2ApiService` (validation token, données compte, personnages)
- [x] `POST /api/v1/profile/api-key` (validation + chiffrement)
- [x] `GET /api/v1/gw2/account` et `GET /api/v1/gw2/characters`
- [x] Cache Laravel pour les appels API GW2
- [x] `UserProfileController` (affichage et mise à jour profil)
- [x] Frontend : page profil, formulaire clé API, composant GW2AccountCard
- [x] Zustand stores (auth + profile)

### ✅ Sprint 3 — Forum Core

- [x] Migrations : categories, discussions, commentaires
- [x] `CategoryController` (CRUD, slug auto, ordre)
- [x] `DiscussionController` (CRUD, pagination curseur, soft delete)
- [x] `CommentController` (pagination, marquage solution, soft delete)
- [x] Policies (auteur uniquement peut modifier ses propres posts)
- [x] Full-text search MySQL (titre + contenu)
- [x] Rate limiting forum
- [x] PHPUnit feature tests (forum complet)
- [x] Frontend : page catégories, liste discussions, détail discussion, fil commentaires
- [x] Formulaire création discussion (éditeur rich text TipTap)

### 🔄 Sprint 4 — Forum Avancé & API GW2 Avancée (En cours)

- [ ] `GET /api/v1/gw2/items/{id}` et `GET /api/v1/gw2/items/search`
- [ ] Liaison discussion ↔ item GW2 (`item_gw2_id` sur discussions)
- [ ] Composant item picker dans la création de discussion
- [ ] Table `items_gw2` (cache persistant)
- [ ] Système de tags sur les discussions
- [ ] Timer world boss events (frontend temps réel)

### ⏳ Sprint 5 — Guildes & Builds (À venir)

- [ ] Tables `guildes` et `membres_guilde`
- [ ] `GuildController` (import depuis API GW2, page guilde, membres)
- [ ] Tables `builds` et `commentaires_build`
- [ ] `BuildController` (CRUD, likes, commentaires)
- [ ] Frontend : page guilde, galerie builds, créateur de build

### ⏳ Sprint 6 — Tests, Optimisations & Déploiement (À venir)

- [ ] Tests E2E Playwright (parcours critiques)
- [ ] Tests de charge
- [ ] Optimisation N+1 (Laravel Debugbar + Eager Loading)
- [ ] Configuration VPS (Ubuntu, Nginx, PHP 8.3, MySQL, SSL Let's Encrypt)
- [ ] CD via GitHub Actions (déploiement auto sur merge `main`)
- [ ] SEO (meta tags, sitemap, Open Graph)

---

## 12. API REST — Référence des endpoints

### Format des réponses

```json
// Succès
{ "data": { ... }, "message": "..." }

// Erreur de validation
{ "message": "...", "errors": { "champ": ["message"] } }

// Erreur serveur
{ "message": "..." }
```

### Codes HTTP utilisés

| Code | Usage |
|---|---|
| 200 | Succès (GET, PUT) |
| 201 | Ressource créée (POST) |
| 204 | Succès sans corps (DELETE, logout) |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Interdit (rôle insuffisant, banni) |
| 404 | Ressource non trouvée |
| 422 | Erreur de validation |
| 429 | Rate limit dépassé |

### Endpoints Auth

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/register` | — | Inscription |
| POST | `/api/v1/login` | — | Connexion → token |
| POST | `/api/v1/logout` | Bearer | Révocation token |

### Endpoints Profil

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/profile` | Bearer | Profil utilisateur |
| PUT | `/api/v1/profile` | Bearer | Mise à jour profil |
| POST | `/api/v1/profile/api-key` | Bearer | Ajout/validation clé API GW2 |

### Endpoints GW2

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/gw2/account` | Bearer | Données compte GW2 |
| GET | `/api/v1/gw2/characters` | Bearer | Liste des personnages |

### Endpoints Forum

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/forum/categories` | — | Liste des catégories |
| GET | `/api/v1/forum/categories/{id}` | — | Détail catégorie |
| GET | `/api/v1/forum/discussions` | — | Liste discussions (cursor paginated) |
| POST | `/api/v1/forum/discussions` | Bearer | Créer une discussion |
| GET | `/api/v1/forum/discussions/{id}` | — | Détail discussion |
| PUT | `/api/v1/forum/discussions/{id}` | Bearer | Modifier (auteur only) |
| DELETE | `/api/v1/forum/discussions/{id}` | Bearer | Supprimer (auteur/admin) |
| GET | `/api/v1/forum/discussions/{id}/comments` | — | Commentaires paginés |
| POST | `/api/v1/forum/discussions/{id}/comments` | Bearer | Ajouter commentaire |
| PUT | `/api/v1/forum/comments/{id}` | Bearer | Modifier (auteur only) |
| DELETE | `/api/v1/forum/comments/{id}` | Bearer | Supprimer |
| PATCH | `/api/v1/forum/comments/{id}/solution` | Bearer | Marquer solution |

### Endpoints Admin

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/admin/users` | Bearer + Admin | Liste utilisateurs |
| POST | `/api/v1/admin/users/{id}/ban` | Bearer + Admin | Bannir |
| POST | `/api/v1/admin/users/{id}/unban` | Bearer + Admin | Débannir |
| GET | `/api/v1/admin/stats` | Bearer + Admin | Statistiques |

---

## 13. Gestion de projet — Scrum

### Équipe

| Rôle | Responsabilité principale |
|---|---|
| Dev 1 | Frontend React, DevOps, CI/CD |
| Dev 2 | Backend Laravel, BDD, API GW2 |

### Vélocité & Planning

- **Vélocité équipe** : 21 Story Points / sprint
- **Total estimé** : 131 SP
- **6 sprints × 2 semaines** = 3 mois

### Sprints

| Sprint | Période | Thème | Statut |
|---|---|---|---|
| Sprint 1 | Sem. 1-2 | Fondations & Auth | ✅ Terminé |
| Sprint 2 | Sem. 3-4 | Profils & API GW2 | ✅ Terminé |
| Sprint 3 | Sem. 5-6 | Forum Core | ✅ Terminé |
| Sprint 4 | Sem. 7-8 | Forum Avancé & API GW2 | 🔄 En cours |
| Sprint 5 | Sem. 9-10 | Guildes & Builds | ⏳ À venir |
| Sprint 6 | Sem. 11-12 | Tests & Déploiement | ⏳ À venir |

### Cérémonies Scrum

| Cérémonie | Durée | Objectif |
|---|---|---|
| Sprint Planning | 2h | Sélection US, décomposition tâches, estimation |
| Daily Scrum | 15 min | Fait / Prévu / Blocages |
| Sprint Review | 1h | Démo + feedback |
| Rétrospective | 1h | Keep / Improve / Start |

### Definition of Done (DoD)

Une User Story est "Done" si et seulement si :

- [ ] Code revu par PR (l'autre développeur)
- [ ] Tests unitaires écrits et passants (couverture ≥ 70%)
- [ ] Fonctionnalité documentée
- [ ] Branche mergée sur `develop` sans conflits
- [ ] Pipeline CI vert (lint + tests + build)
- [ ] Interface responsive testée mobile + desktop
- [ ] Aucune donnée sensible exposée, entrées validées
- [ ] Démontrée lors de la Sprint Review

### Stratégie Git

```
main          ← Production (déploiement auto via CD)
  └── develop ← Intégration continue
        └── feature/us-XX-nom-court  ← Développement feature
```

---

## 14. CI/CD et déploiement

### GitHub Actions — Pipeline CI

Déclenché sur chaque `push` :

1. `lint` — PHP CS Fixer + ESLint
2. `tests` — PHPUnit (avec `.env.testing` + SQLite in-memory)
3. `build` — `npm run build` React

### GitHub Actions — Pipeline CD

Déclenché sur `merge` vers `main` :

1. SSH vers le VPS
2. `git pull`
3. `composer install --no-dev`
4. `php artisan migrate --force`
5. `npm run build` → copie vers `/var/www/gw2nexus/public`
6. `php artisan config:cache && php artisan route:cache`

### Configuration VPS (Production)

```
OS       : Ubuntu 24.04 LTS
Serveur  : Nginx (reverse proxy PHP-FPM + serveur React build statique)
PHP      : 8.3 (php-fpm)
MySQL    : 8.0
SSL      : Let's Encrypt (Certbot)
```

```nginx
# Backend API
server {
    listen 443 ssl;
    server_name api.gw2nexus.com;
    root /var/www/gw2nexus-api/public;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        include fastcgi_params;
    }
}

# Frontend React (build statique)
server {
    listen 443 ssl;
    server_name gw2nexus.com;
    root /var/www/gw2nexus-front/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 15. Tests

### Stack de tests

- **PHPUnit** (feature tests backend)
- **Playwright** (E2E — Sprint 6)
- **SQLite in-memory** (isolation en CI)

### Configuration `.env.testing`

```dotenv
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_STORE=array          # Isolation cache entre tests
QUEUE_CONNECTION=sync
MAIL_MAILER=array
```

### Points d'attention PHPUnit

**Rate limiting** : Utiliser `RateLimiter::resetAttempts($key)` (et non `clear()`) entre les tests pour réinitialiser le rate limiter.

```php
protected function tearDown(): void
{
    RateLimiter::resetAttempts('login|127.0.0.1');
    parent::tearDown();
}
```

**Validation email** : Utiliser `email:rfc` (et non `email:rfc,dns`) dans les tests pour éviter les échecs de résolution DNS sur les domaines fictifs.

**Commentaires inline `.env`** : Une ligne `APP_KEY=base64:xxx  # commentaire` casse la regex de `php artisan key:generate`. Toujours utiliser des lignes propres `KEY=value`.

### Couverture cible

- Objectif Sprint 6 : **≥ 70%** de couverture sur les endpoints REST

---

## 16. Sécurité

### Checklist sécurité

| Mesure | Statut | Détail |
|---|---|---|
| Authentification Bearer Token | ✅ | Laravel Sanctum |
| Clé API GW2 chiffrée | ✅ | Cast `encrypted` Eloquent (AES-256) |
| Validation entrées | ✅ | Form Requests Laravel |
| Soft deletes (pas de suppression physique) | ✅ | `SoftDeletes` Eloquent |
| Policies (auteur only) | ✅ | `DiscussionPolicy`, `CommentPolicy` |
| Rate limiting auth | ✅ | Sanctum default (10/min) |
| Rate limiting contact form | ✅ | 3 tentatives / 10 min |
| BanCheck middleware | ✅ | Toutes routes auth |
| Admin middleware | ✅ | Routes `/admin/*` |
| CORS configuré | ✅ | Domaines autorisés dans `config/cors.php` |
| HTTPS production | ⏳ | Let's Encrypt (Sprint 6) |
| CSRF | ⏳ | Headers sécurité Nginx (Sprint 6) |
| Protection XSS | ⏳ | Sanitization HTML TipTap (Sprint 6) |

---

## 17. Conventions de code

### Backend (PHP/Laravel)

```php
// Namespace controllers
App\Http\Controllers\Api\{Feature}\{Name}Controller

// Commentaires en français
// Vérifie que l'utilisateur est l'auteur de la discussion
if ($discussion->user_id !== $user->id) {
    abort(403);
}

// Services : logique métier hors controllers
// Controllers : uniquement validation + appel service + retour JSON

// Retours API
return response()->json(['data' => $resource], 200);
return response()->json(['message' => 'Créé avec succès', 'data' => $resource], 201);
return response()->noContent(); // 204
```

### Frontend (TypeScript/React)

```typescript
// Composants : PascalCase + suffixe Component
// NavbarComponent.tsx, ForumCardComponent.tsx

// Hooks : camelCase + préfixe use
// useAuthStore.ts, useDiscussions.ts

// Fichiers API : utiliser ENDPOINTS exclusivement
import { ENDPOINTS } from '@/api/endpoints';
const response = await httpClient.get(ENDPOINTS.forum.discussions);

// CSS Modules : camelCase
import styles from './MonComponent.module.css';
<div className={styles.container}>

// Types/interfaces : PascalCase, fichiers dans src/types/
interface Discussion {
    id: number;
    titre: string;
    // ...
}
```

### Git

```
# Messages de commit
feat: ajout du composant ItemPicker
fix: correction du rate limiter dans les tests PHPUnit
refactor: extraction de la logique de validation dans Gw2ApiService
test: ajout des feature tests pour le forum
docs: mise à jour DOCS.md

# Branches
feature/us-07-item-picker
fix/rate-limiter-tests
```

---

## 18. Décisions techniques importantes

### Bearer Token vs Cookie SPA Sanctum

**Contexte** : Le projet a démarré avec le mode cookie SPA de Sanctum, puis a migré vers Bearer Token.

**Raison** : En production, frontend et backend sont sur des sous-domaines différents (`gw2nexus.com` / `api.gw2nexus.com`). Les cookies SPA nécessitent un domaine racine commun et une configuration CORS fine qui s'est avérée fragile. Le Bearer Token est plus simple et standard pour cette architecture.

**Impact** : Le token est stocké dans `localStorage` sous la clé `auth_token` et injecté via intercepteur Axios.

### `latestOfMany('id')` vs `ofMany()`

**Contexte** : Relation `hasOne` pour récupérer le commentaire solution d'une discussion.

**Raison** : MySQL 8 avec `only_full_group_by` activé par défaut rejette les requêtes `GROUP BY` qui ne sont pas pleinement déterministes. `ofMany()` génère une telle requête. `latestOfMany('id')` génère une sous-requête `MAX(id)` compatible.

### Vite Proxy — `VITE_API_URL` vide

**Contexte** : En développement, le frontend React et l'API Laravel sont sur des services Docker séparés.

**Raison** : Si `VITE_API_URL=http://localhost:8000`, Axios envoie des requêtes en URL absolue qui bypassent le proxy Vite. Le proxy ne peut pas intercepter ces requêtes. En laissant `VITE_API_URL` vide, Axios utilise des URLs relatives (`/api/v1/...`) que Vite intercepte et forwardie vers `http://laravel:8000`.

### Commentaires en français

Convention du projet : tous les commentaires de code sont en français pour aligner les deux développeurs.

### CSS Modules — Pas de `composes`

Les variantes de style (ex: `button` vs `buttonActive`) redéclarent toutes les propriétés plutôt que d'utiliser `composes`. Raison : `composes` peut créer des ordres de cascade imprévisibles et complique le débogage.

### Hooks locaux vs partagés

Un hook local à une seule page reste dans le dossier de cette page. Il migre vers `src/hooks/ui/` uniquement quand une deuxième page en a besoin. Évite la sur-ingénierie prématurée.

---

## 19. Roadmap — Sprints restants

### Sprint 4 (En cours) — Priorités

1. **Item GW2 dans la création de discussion**
   - Backend : endpoint `GET /api/v1/gw2/items/search`, table `items_gw2`
   - Frontend : composant `ItemPickerComponent` (recherche + sélection)
   - Liaison `discussion.item_gw2_id`

2. **Système de tags**
   - Backend : CRUD tags, table `discussion_tag`
   - Frontend : sélecteur de tags dans la création de discussion, filtres

3. **Timer world boss**
   - Frontend : calcul des spawns fixes, mise à jour en temps réel

4. **Finalisation et tests**
   - `PUT /api/v1/profile`, `POST /api/v1/profile/api-key` (tests feature)
   - `GET /api/v1/gw2/account`, `GET /api/v1/gw2/characters` (tests feature)

### Sprint 5 — Guildes & Builds

Voir section [11. Fonctionnalités implémentées](#11-fonctionnalités-implémentées).

### Sprint 6 — Finitions & Déploiement

Voir section [11. Fonctionnalités implémentées](#11-fonctionnalités-implémentées).

---

## 20. Glossaire

| Terme | Définition |
|---|---|
| **API GW2** | L'API officielle de Guild Wars 2, accessible sur `api.guildwars2.com/v2` |
| **Bearer Token** | Token JWT/opaque envoyé dans le header `Authorization: Bearer <token>` |
| **BanCheck** | Middleware Laravel vérifiant l'absence de ban avant d'accéder aux routes protégées |
| **Build** | Configuration de personnage GW2 (profession, compétences, traits, équipement) |
| **Cast `encrypted`** | Cast Eloquent chiffrant/déchiffrant automatiquement une colonne avec AES-256 via `APP_KEY` |
| **CSS Modules** | Système de styles CSS scopés par composant — les noms de classes sont locaux |
| **Cursor Pagination** | Pagination par curseur (plus performante que l'offset pour les grands volumes) |
| **DoD** | Definition of Done — critères qu'une US doit satisfaire pour être considérée terminée |
| **Gw2ApiService** | Service Laravel wrappant les appels HTTP à l'API GW2 officielle |
| **Soft Delete** | Suppression logique : la ligne reste en BDD, `deleted_at` est renseigné |
| **Slug** | Version URL-friendly d'un titre (ex: "Mon titre" → "mon-titre") |
| **SP** | Story Points — unité d'estimation d'une User Story |
| **Sanctum** | Package Laravel d'authentification API par tokens |
| **Zustand** | Librairie de state management React légère (alternative à Redux) |
| **Vite Proxy** | Fonctionnalité Vite redirigeant les requêtes `/api/*` vers le backend Laravel en dev |
| **World Boss** | Événement de monde GW2 avec des spawns à horaires fixes |

---

*Documentation générée le 01/04/2026 — GW2Nexus v0.4 (Sprint 4 en cours)*
*Stack : Laravel 11 · React 18 · MySQL 8 · Docker · GitHub Actions*