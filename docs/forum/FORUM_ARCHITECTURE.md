# Forum Architecture - GW2Nexus

Date: 2026-06-04

## 1. Objectif

Le module Forum doit permettre aux visiteurs de lire les categories, sujets et reponses, puis aux utilisateurs connectes de creer des sujets et de repondre.

Le module doit rester progressif:

- MVP lisible et stable en premier.
- Moderation preparee mais non sur-implemente.
- Aucune nouvelle dependance lourde.
- Respect du theme dark fantasy GW2Nexus.

## 2. Architecture actuelle prise en compte

Backend:

- Laravel 12.
- API sous `/api/v1`.
- Authentification Sanctum en Bearer token.
- Middleware existants: `auth:sanctum`, `ban.check`, `admin`.
- Roles existants: `user`, `moderateur`, `admin`.
- Validation via Form Requests.
- Reponses JSON simples avec `message`, `data` et `meta` selon le cas.

Frontend:

- React, Vite, TypeScript.
- Routing centralise dans `frontend/src/router/index.tsx`.
- Appels API via `frontend/src/api/httpClient.ts`.
- Endpoints centralises dans `frontend/src/api/endpoint.ts`.
- Auth globale via Zustand dans `frontend/src/store/authStore.ts`.
- CSS Modules et tokens globaux dans `frontend/src/styles/theme.module.css`.

## 3. Tables SQL prevues

### forum_categories

Champs prevus:

- `id`
- `name`
- `slug`
- `description` nullable
- `icon` nullable
- `position` integer default 0
- `is_active` boolean default true
- `created_at`
- `updated_at`

### forum_threads

Champs prevus:

- `id`
- `forum_category_id`
- `user_id`
- `title`
- `slug`
- `excerpt` nullable
- `is_locked` boolean default false
- `is_pinned` boolean default false
- `views_count` integer default 0
- `last_post_at` nullable
- `created_at`
- `updated_at`

### forum_posts

Champs prevus:

- `id`
- `forum_thread_id`
- `user_id`
- `content` longText
- `is_solution` boolean default false
- `created_at`
- `updated_at`

## 4. Modeles Laravel prevus

### ForumCategory

Relations:

- a plusieurs `ForumThread`.

Scopes:

- `active`.
- tri par `position`.

### ForumThread

Relations:

- appartient a `ForumCategory`.
- appartient a `User` en tant qu'auteur.
- a plusieurs `ForumPost`.

Responsabilites:

- peut etre verrouille.
- peut etre epingle.
- incremente `views_count`.
- garde `last_post_at`.

### ForumPost

Relations:

- appartient a `ForumThread`.
- appartient a `User` en tant qu'auteur.

### User

Relations a ajouter:

- a plusieurs `ForumThread`.
- a plusieurs `ForumPost`.

## 4.1 Modeles Laravel implementes

Modeles crees:

- `App\Models\ForumCategory`
- `App\Models\ForumThread`
- `App\Models\ForumPost`

Relations implementees:

- `ForumCategory::threads()`
- `ForumThread::category()`
- `ForumThread::author()`
- `ForumThread::posts()`
- `ForumPost::thread()`
- `ForumPost::author()`
- `User::forumThreads()`
- `User::forumPosts()`

Scopes implementes:

- `ForumCategory::active()`
- `ForumCategory::ordered()`
- `ForumThread::pinned()`
- `ForumThread::unlocked()`
- `ForumThread::latestActivity()`

## 5. Routes API prevues

Toutes les routes forum sont sous:

```text
/api/v1/forum
```

Routes publiques:

- `GET /api/v1/forum/categories`
- `GET /api/v1/forum/categories/{category:slug}`
- `GET /api/v1/forum/categories/{category:slug}/threads`
- `GET /api/v1/forum/threads/{thread:slug}`
- `GET /api/v1/forum/threads/{thread:slug}/posts`

Routes protegees par Sanctum:

- `POST /api/v1/forum/categories/{category:slug}/threads`
- `POST /api/v1/forum/threads/{thread:slug}/posts`
- `PATCH /api/v1/forum/posts/{post}`
- `DELETE /api/v1/forum/posts/{post}`

Routes de moderation a preparer plus tard:

- `PATCH /api/v1/forum/threads/{thread}/lock`
- `PATCH /api/v1/forum/threads/{thread}/pin`
- `DELETE /api/v1/forum/threads/{thread}`

## 6. Pages React prevues

Pages de lecture publique:

- `/forum`
- `/forum/:categorySlug`
- `/forum/thread/:threadSlug`

Page protegee:

- `/forum/new/:categorySlug`

Pages recommandees:

- `ForumHomePage`
- `ForumCategoryPage`
- `ForumThreadPage`
- `ForumNewThreadPage`

Composants recommandes:

- `ForumCategoryCard`
- `ForumThreadList`
- `ForumThreadCard`
- `ForumPostCard`
- `ForumReplyForm`
- `ForumNewThreadForm`
- `ForumBreadcrumb`

## 7. Permissions minimales

- Tous les visiteurs peuvent lire.
- Seuls les utilisateurs connectes peuvent creer un sujet.
- Seuls les utilisateurs connectes peuvent repondre.
- Un utilisateur peut modifier ou supprimer ses propres messages.
- Un utilisateur connecte peut repondre a un message avec un contexte texte pre-rempli.
- Un utilisateur connecte peut signaler un message qui n'est pas le sien.
- Un utilisateur ne peut signaler qu'une seule fois le meme message.
- Un sujet verrouille refuse les nouvelles reponses.
- Les roles `moderateur` et `admin` sont prepares cote UI pour la moderation future.
- Les actions de moderation de sujet restent inactives tant que les endpoints dedies ne sont pas implementes.
- La logique frontend est indicative uniquement; la securite et les autorisations restent imposees par Laravel.

## 8. Securite

Regles:

- Ne jamais faire confiance au frontend.
- Valider toutes les entrees cote Laravel.
- Ne pas exposer les secrets ou tokens.
- Ne pas logger de contenu sensible.
- Ne pas utiliser `dangerouslySetInnerHTML`.
- Rendre le contenu utilisateur comme texte, sans HTML execute.

## 9. Choix techniques

- Pas de nouvelle dependance backend.
- Pas de nouvelle dependance frontend.
- API REST Laravel classique.
- Form Requests pour la validation.
- Resources Laravel pour les reponses JSON.
- CSS Modules cote React.
- Endpoints centralises dans `ENDPOINTS`.
- Les vues de sujet sont dedupliquees sur une fenetre courte de 10 minutes par sujet et visiteur.
- La deduplication des vues evite les doubles comptages en developpement React et limite le gonflage artificiel.
- Les signalements de messages sont stockes dans `forum_post_reports` avec un statut initial `open`.
- Les signalements ouverts sont consultables dans le back-office sur `/admin/forum`.
- Le traitement des signalements par l'equipe de moderation reste a implementer dans une etape dediee.
