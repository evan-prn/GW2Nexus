# Backend — Vue d'ensemble

## Stack

| Composant | Version | Rôle |
|---|---|---|
| PHP | 8.4 | Langage principal |
| Laravel | 12.x | Framework MVC |
| Laravel Sanctum | 4.3 | Authentification Bearer Token |
| MySQL | 8.0 | Base de données |
| Composer | 2.x | Gestionnaire de dépendances |

## Structure des dossiers

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── Admin/          # AdminUserController, AdminForumReportController, AdminForumThreadController
│   │   │   ├── Auth/           # Login, Register, Logout, Me, ForgotPassword, ResetPassword
│   │   │   ├── Contact/        # ContactController
│   │   │   ├── Events/         # EventController
│   │   │   ├── Forum/          # Category, Thread, Post, PostReport
│   │   │   └── Profile/        # UserProfile, Avatar, ApiKey → dans UserProfileController
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php     # role === 'admin'
│   │   │   └── BanCheck.php            # Bloque utilisateurs bannis
│   │   ├── Requests/           # Form Requests (validation)
│   │   └── Resources/          # API Resources (sérialisation JSON)
│   ├── Models/
│   │   ├── User.php
│   │   ├── ProfilGw2.php
│   │   ├── UserBan.php
│   │   ├── ForumCategory.php
│   │   ├── ForumThread.php
│   │   ├── ForumPost.php
│   │   └── ForumPostReport.php
│   ├── Services/
│   │   ├── Gw2ApiService.php    # Intégration API ArenaNet
│   │   └── AdminUserService.php # Logique admin (ban/unban/stats)
│   ├── Mail/
│   │   └── ContactMail.php
│   └── Policies/
│       └── AdminPolicy.php
├── bootstrap/app.php            # Configuration application (routing, middleware, exceptions)
├── config/                      # Fichiers de configuration Laravel
├── database/
│   ├── migrations/              # 10 migrations
│   ├── factories/
│   └── seeders/
├── routes/
│   ├── api.php                  # Routes API /api/v1/*
│   ├── web.php                  # Route web (welcome)
│   └── console.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── Dockerfile
└── docker-entrypoint.sh
```

## Middlewares

| Alias | Classe | Rôle |
|---|---|---|
| `auth:sanctum` | Laravel Sanctum | Valide le Bearer Token |
| `ban.check` | `BanCheck` | Rejette les utilisateurs bannis (403) |
| `admin` | `AdminMiddleware` | Requiert `role === 'admin'` |
| `moderator` | `ModeratorMiddleware` | Requiert `role` dans `['moderateur', 'admin']` |

### Ordre d'application

```
Requête → auth:sanctum → ban.check → [admin | moderator] → Controller
```

## Modèles Eloquent

### User

Attributs clés : `nom`, `email`, `password` (hashed), `pseudo_gw2`, `avatar`, `role`, `api_key` (encrypted)

Scopes :
- `scope active()` : non supprimé et non banni

Relations :
- `hasOne(ProfilGw2)` → `profils_gw2`
- `hasMany(UserBan)` → `user_bans`
- `hasMany(ForumThread)`, `hasMany(ForumPost)`

Casts :
- `password` → `hashed` (Hash::make automatique)
- `api_key` → `encrypted` (AES-256-CBC)
- `deleted_at` → `datetime` (soft delete)

### ForumThread

Scopes :
- `scope pinned()` : `is_pinned = true`
- `scope locked()` : `is_locked = true`

Boots : génère `slug` depuis `title` à la création, génère `excerpt` depuis `content` (220 chars, strip_tags)

### ProfilGw2

Cast JSON : `personnages` est un tableau d'objets `{ nom, race, profession, niveau }`

## Form Requests (Validation)

Toutes les validations passent par des **Form Requests** dédiées, jamais directement dans les controllers.

Exemples :
- `RegisterRequest` → `nom` (3-100 chars), `email` (unique, RFC), `password` (min:8, confirmed)
- `BanUserRequest` → `type` (temporary|permanent), `reason` (required), `expires_at` (required si temporary)
- `StoreForumThreadRequest` → `title` (required), `content` (required, min:5)

## API Resources

Sérialisation JSON via `API Resources`. Permettent de filtrer les champs retournés et de formater les données.

| Resource | Utilisée par |
|---|---|
| `UserResource` | Profil, auth/me |
| `AdminUserResource` | Admin users list/detail |
| `ForumCategoryResource` | Forum categories |
| `ForumThreadResource` | Forum threads |
| `ForumPostResource` | Forum posts |
| `ForumPostReportResource` | Forum reports |
| `AdminForumPostReportResource` | Admin forum reports |

## Gestion des erreurs

Configuré dans `bootstrap/app.php` :
- `404` → JSON `{ message: "Not found" }`
- `401` → JSON `{ message: "Non authentifié" }`
- `403` → JSON `{ message: "Accès refusé" }`
- `422` → JSON `{ message: "...", errors: { field: [...] } }`
- `429` → JSON `{ message: "Trop de tentatives" }`
- `500` → JSON `{ message: "Erreur serveur" }` (sans stacktrace en prod)

## Voir aussi

- [Authentification détaillée](authentification.md)
- [Services (Gw2ApiService, AdminUserService)](services.md)
- [API REST — Endpoints](../api/overview.md)
- [Base de données — Schéma](../database/schema.md)
