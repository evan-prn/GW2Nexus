# GW2 Nexus — Frontend

SPA React 19 alimentant la plateforme GW2 Nexus, construite avec Vite et TypeScript.

## Architecture

```
frontend/src/
├── api/            # Couche HTTP (Axios + intercepteurs, endpoints centralisés)
├── store/          # State global Zustand (authStore, profileStore)
├── types/          # Types TypeScript partagés
├── hooks/          # Custom hooks par domaine (auth, forum, profile, events, admin, ui)
├── pages/          # Pages React (lazy-loaded via React Router)
├── components/     # Composants UI réutilisables
├── providers/      # AuthProvider (validation token au startup)
├── router/         # Routes, ProtectedRoute, GuestRoute, AdminRoute
├── styles/         # CSS global, Tailwind
└── assets/         # Images, icônes statiques
```

## Stack

| Technologie | Version | Rôle |
|---|---|---|
| React | 19.2 | UI library |
| TypeScript | 5.8 | Typage statique |
| Vite | 7.x | Build + dev server + proxy |
| React Router | 7.x | Routing SPA |
| Zustand | 5.x | State management global |
| TanStack Query | 5.x | Cache + fetching données serveur |
| Axios | 1.x | Client HTTP |
| Tailwind CSS | 4.x | Styles utilitaires |

## Installation locale

### Avec Docker (recommandé)

Le frontend démarre automatiquement via Docker Compose depuis la racine du projet :

```bash
docker compose up -d --build
```

Application disponible sur `http://localhost:5174`.

### Sans Docker

```bash
cd frontend
npm install
npm run dev
```

Prérequis : Node.js 20+, npm.

## Configuration

Copier `.env.example` :

```bash
cp .env.example .env
```

Variables Vite :

| Variable | Valeur par défaut | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5174` | URL de base Axios (proxy Vite, pas Laravel directement) |
| `VITE_APP_NAME` | `GW2Nexus` | Nom affiché dans l'UI |

> **Important :** `VITE_API_URL` pointe sur Vite lui-même (`:5174`), pas sur Laravel (`:8000`). Le proxy Vite redirige `/api/*` vers `laravel:8000`.

> **Jamais de secret dans une variable `VITE_*`** — elles sont exposées dans le bundle JavaScript.

Documentation complète → [docs/devops/variables-env.md](../docs/devops/variables-env.md)

## Scripts disponibles

```bash
npm run dev       # Dev server Vite avec HMR (http://localhost:5174)
npm run build     # Build production (tsc + vite build)
npm run lint      # ESLint
npm run preview   # Prévisualiser le build production
```

Vérifications TypeScript sans build :
```bash
npx tsc --noEmit --pretty false
```

### Depuis Docker Compose

```bash
docker compose exec react npm run lint
docker compose exec react npm run build
```

## Gestion d'état

### Zustand — State global synchrone

| Store | Contenu | Persistance |
|---|---|---|
| `authStore` | user, isAuthenticated, isLoading | localStorage (token seulement) |
| `profileStore` | profileUser, profilGw2, gw2Data | Mémoire (rechargé au mount) |

### TanStack Query — Données serveur

Toutes les données récupérées depuis l'API utilisent `useQuery` et `useMutation`. Cache configurable par query key avec invalidation automatique après mutation.

```typescript
// Pattern standard
const { data, isLoading, isError } = useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: () => forumApi.getCategories(),
    staleTime: 5 * 60 * 1000,
});
```

Documentation → [docs/frontend/state-management.md](../docs/frontend/state-management.md)

## Communication API

Toutes les requêtes HTTP passent par `src/api/httpClient.ts` (Axios configuré) :

- **Token injection automatique** : header `Authorization: Bearer {token}` sur chaque requête si token présent en localStorage
- **Logout automatique** : intercepteur response → si 401, supprime le token et vide le store

Les URLs d'endpoints sont centralisées dans `src/api/endpoint.ts`.

## Routing

| Route | Protection | Composant |
|---|---|---|
| `/` | Publique | HomePage |
| `/login`, `/register` | GuestRoute (redirige si connecté) | LoginPage, RegisterPage |
| `/profile` | ProtectedRoute (redirige si non connecté) | ProfilePage |
| `/admin/*` | AdminRoute (redirige si non admin) | Admin pages |
| `/forum/*` | Publique (lecture) / ProtectedRoute (écriture) | Forum pages |
| `/world-boss` | Publique | WorldBossPage |

Toutes les pages sont **lazy-loaded** via `React.lazy()` pour optimiser le bundle initial.

Documentation → [docs/frontend/overview.md](../docs/frontend/overview.md)

## Organisation des composants

```
src/components/
├── layout/     # Navbar, Footer
├── ui/         # Button, Modal, Toast, Input, Skeleton (réutilisables)
├── auth/       # AuthLayout, FormInput
├── forum/      # ForumCategoryList, ForumThreadList, ThreadDetail, PostForm
├── profile/    # ProfileForm, ApiKeyManager, Gw2ProfileCard
├── events/     # EventTimer, WorldBossCard, EventBadge
├── admin/      # AdminLayout, UserList, BanModal, ForumReports
└── about/      # Sections de la page About
```

## Tests et qualité

```bash
# TypeScript
npx tsc --noEmit

# ESLint
npm run lint
npm run lint -- --fix   # Auto-correction
```

Aucun test Vitest/Jest n'est configuré à ce jour. Voir [docs/testing/overview.md](../docs/testing/overview.md) pour la roadmap tests.

## Build production

```bash
npm run build
# Output : frontend/dist/
```

Le build inclut : compilation TypeScript → bundle Vite → assets optimisés.

En production, configurer un reverse proxy (Nginx) pour servir `dist/` et proxy `/api/*` vers Laravel.

## Proxy Vite (développement)

Configuré dans `vite.config.js` :

```
/api/*      → http://laravel:8000/api/*
/sanctum/*  → http://laravel:8000/sanctum/*
```

Ce proxy évite les problèmes CORS en développement. En production, ce rôle est assuré par Nginx.

## Troubleshooting

**Hot reload ne fonctionne pas dans Docker**

Vérifier que le HMR Vite pointe sur `ws://localhost:5174` dans `vite.config.js`.

**Erreurs TypeScript à la compilation**

```bash
npx tsc --noEmit --pretty false
```

Corriger les erreurs avant de commiter — le build CI bloquera sinon.

**Requêtes API retournent 401 en boucle**

Le token localStorage est invalide ou expiré. `AuthProvider` appelle `GET /api/v1/auth/me` au startup et vide le store si 401. Vider le localStorage pour forcer un nouveau login.

**Le proxy ne fonctionne pas (CORS error)**

Vérifier que `VITE_API_URL=http://localhost:5174` (pas `http://localhost:8000`). Les appels `/api/*` doivent passer par Vite, pas directement vers Laravel.
