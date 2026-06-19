# Architecture Globale — GW2 Nexus

## Vue d'ensemble

GW2 Nexus est une application web SPA (Single Page Application) avec backend API découplé.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet / Utilisateur                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Frontend — React 19 SPA                          │
│              http://localhost:5174 (Vite dev server)                │
│                                                                     │
│  React Router v7 · Zustand · TanStack Query · Tailwind CSS 4       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP/JSON (Bearer Token)
                               │ Proxy Vite → /api/* → laravel:8000
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Backend — Laravel 12 API                         │
│              http://localhost:8000 (php artisan serve)              │
│                                                                     │
│  Controllers · Services · Middlewares · Form Requests · Resources  │
│  Sanctum Bearer Auth · Rate Limiting · Queue (database driver)     │
└────────────┬───────────────────────────────────┬────────────────────┘
             │ PDO / MySQL                        │ HTTP
             ▼                                   ▼
┌────────────────────────┐           ┌───────────────────────────────┐
│   MySQL 8.0            │           │  API externe — ArenaNet       │
│   localhost:3307       │           │  api.guildwars2.com/v2        │
│                        │           │                               │
│  10 tables             │           │  /tokeninfo · /account        │
│  Soft deletes          │           │  /characters · /worldbosses   │
│  Indexes optimisés     │           │  Cache 5min (Laravel Cache)   │
└────────────────────────┘           └───────────────────────────────┘
```

---

## Composants du système

### Frontend (React SPA)

| Responsabilité | Technologies |
|---|---|
| Rendu UI | React 19, TypeScript, Tailwind CSS 4 |
| Routing | React Router v7 (lazy loading) |
| State global | Zustand 5 (persisté localStorage) |
| Requêtes HTTP | TanStack Query v5 + Axios |
| Authentification | Bearer Token (localStorage) |
| Composants | Bibliothèque interne (ui/, auth/, forum/, etc.) |

### Backend (Laravel API)

| Responsabilité | Technologies |
|---|---|
| API REST | Laravel 12, routes `/api/v1/*` |
| Authentification | Laravel Sanctum 4.3 (Bearer Token) |
| Validation | Form Requests (rules, messages) |
| Sérialisation | API Resources (JSON) |
| Cache | Laravel Cache (database driver, configurable) |
| Emails | Mailable + SMTP (Mailpit en dev) |
| Queue | Database driver (jobs asynchrones) |

### Base de données

| Tables | Rôle |
|---|---|
| `users` | Comptes utilisateurs, rôles, clé GW2 chiffrée |
| `profils_gw2` | Données synchronisées depuis l'API GW2 |
| `user_bans` | Historique des sanctions |
| `forum_categories` | Catégories du forum |
| `forum_threads` | Sujets (threads) |
| `forum_posts` | Messages (posts) |
| `forum_post_reports` | Signalements de messages |
| `personal_access_tokens` | Tokens Sanctum |
| `cache` | Cache Laravel (database driver) |
| `jobs` | File d'attente (queue) |

### API externe — ArenaNet

Utilisée uniquement côté **backend** via `Gw2ApiService`. Le frontend ne contacte jamais ArenaNet directement. Les clés API des utilisateurs sont chiffrées en base de données (AES-256).

---

## Flux de requête typique

```
[Navigateur]
  │
  ├─→ Charge React SPA (assets Vite)
  │
  ├─→ POST /api/v1/auth/login
  │     │
  │     └─→ [Laravel] LoginController
  │               → Auth::attempt()
  │               → BanCheck
  │               → createToken('web')
  │               ← { user, token }
  │
  ├─→ GET /api/v1/profile/gw2-data
  │     Authorization: Bearer {token}
  │     │
  │     └─→ [Laravel] auth:sanctum middleware
  │               → UserProfileController@getGw2Data
  │               → Gw2ApiService::getAccountData()
  │                   → Cache::remember(5min)
  │                   → GET api.guildwars2.com/v2/account
  │               ← { compte, personnages }
  │
  └─→ POST /api/v1/forum/threads/{slug}/posts
        Authorization: Bearer {token}
        │
        └─→ auth:sanctum → ban.check
              → ForumPostController@store
              → Thread::where(slug)->firstOrFail()
              → if is_locked → 403
              → ForumPost::create()
              ← { message, data: post }
```

---

## Principes architecturaux

1. **Découplage strict** : Frontend et Backend communiquent exclusivement via API REST JSON.
2. **Stateless API** : Authentification Bearer Token (pas de session serveur).
3. **API versionnée** : Toutes les routes préfixées `/api/v1/` pour éviter les breaking changes.
4. **Sécurité par défaut** : Données sensibles chiffrées (clé GW2 AES-256, passwords bcrypt).
5. **Cache résilient** : L'API GW2 externe est toujours encapsulée avec fallback gracieux.
6. **Rôles progressifs** : `user` → `moderateur` → `admin` avec middlewares dédiés.

---

## Voir aussi

- [Diagrammes C4 et Mermaid](diagrammes.md)
- [Décisions techniques (ADR)](decisions-techniques.md)
- [Setup local Docker](../devops/setup-local.md)
- [Schéma base de données](../database/schema.md)
