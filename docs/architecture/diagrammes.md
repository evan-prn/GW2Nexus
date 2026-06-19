# Diagrammes d'Architecture — GW2 Nexus

Tous les diagrammes sont en syntaxe **Mermaid** (rendu natif dans GitHub, GitLab, Notion, Obsidian).

---

## C4 Niveau 1 — Contexte système

```mermaid
C4Context
    title Contexte système — GW2 Nexus

    Person(user, "Joueur GW2", "Utilisateur de l'application")
    Person(admin, "Administrateur", "Gère les utilisateurs et la modération")

    System(gw2nexus, "GW2 Nexus", "Application web communautaire GW2")

    System_Ext(gw2api, "API ArenaNet", "api.guildwars2.com/v2\nDonnées officielles GW2")
    System_Ext(smtp, "Serveur SMTP", "Envoi d'emails (contact, reset password)")

    Rel(user, gw2nexus, "Utilise", "HTTPS")
    Rel(admin, gw2nexus, "Administre", "HTTPS")
    Rel(gw2nexus, gw2api, "Requête données GW2", "HTTPS / JSON")
    Rel(gw2nexus, smtp, "Envoie emails", "SMTP")
```

---

## C4 Niveau 2 — Conteneurs

```mermaid
C4Container
    title Conteneurs — GW2 Nexus

    Person(user, "Joueur GW2")
    Person(admin, "Administrateur")

    Container(spa, "React SPA", "React 19, TypeScript, Vite", "Interface utilisateur single-page")
    Container(api, "Laravel API", "PHP 8.4, Laravel 12", "API REST versionnée /api/v1/*")
    ContainerDb(db, "MySQL 8.0", "Base de données relationnelle", "Comptes, forum, bans, profils GW2")

    System_Ext(gw2api, "API ArenaNet", "Données GW2 officielles")
    System_Ext(smtp, "SMTP", "Emails")

    Rel(user, spa, "Utilise", "HTTPS :5174")
    Rel(admin, spa, "Administre", "HTTPS :5174")
    Rel(spa, api, "API calls", "HTTP/JSON Bearer Token :8000")
    Rel(api, db, "Lit / Écrit", "PDO MySQL :3306")
    Rel(api, gw2api, "Requête (avec cache)", "HTTPS")
    Rel(api, smtp, "Envoie mails", "SMTP :1025")
```

---

## C4 Niveau 3 — Composants Backend

```mermaid
C4Component
    title Composants Backend — Laravel 12

    Container_Boundary(api, "Laravel API") {
        Component(router, "Router", "routes/api.php", "Définit les routes /api/v1/*")
        Component(middleware, "Middlewares", "auth:sanctum, admin, ban.check", "Authentification et autorisation")

        Component(authCtrl, "Auth Controllers", "Login, Register, Logout, Me", "Gestion authentification")
        Component(profileCtrl, "Profile Controllers", "UserProfile, Avatar, ApiKey", "Profil et clé GW2")
        Component(forumCtrl, "Forum Controllers", "Category, Thread, Post, Report", "Module forum complet")
        Component(adminCtrl, "Admin Controllers", "AdminUser, AdminForum", "Back-office")
        Component(eventsCtrl, "Events Controller", "EventController", "Calendrier des événements")
        Component(contactCtrl, "Contact Controller", "ContactController", "Formulaire de contact")

        Component(gw2Svc, "Gw2ApiService", "Service", "Intégration API ArenaNet avec cache")
        Component(adminSvc, "AdminUserService", "Service", "Logique métier admin (ban/unban)")

        Component(models, "Eloquent Models", "User, ForumThread, ForumPost...", "Couche données ORM")
        Component(cache, "Laravel Cache", "Database driver", "Cache HTTP GW2 API")
    }

    Rel(router, middleware, "applique")
    Rel(middleware, authCtrl, "route vers")
    Rel(middleware, profileCtrl, "route vers")
    Rel(middleware, forumCtrl, "route vers")
    Rel(middleware, adminCtrl, "route vers")
    Rel(profileCtrl, gw2Svc, "appelle")
    Rel(adminCtrl, adminSvc, "appelle")
    Rel(gw2Svc, cache, "utilise")
    Rel(authCtrl, models, "utilise")
    Rel(forumCtrl, models, "utilise")
```

---

## Schéma de la base de données

```mermaid
erDiagram
    users {
        bigint id PK
        varchar nom
        varchar email UK
        varchar password
        varchar pseudo_gw2
        varchar avatar
        enum role
        varchar api_key
        timestamp email_verified_at
        timestamp deleted_at
    }

    profils_gw2 {
        bigint id PK
        bigint user_id FK
        varchar nom_compte
        varchar monde
        json personnages
        timestamp derniere_synchro
        boolean valide
    }

    user_bans {
        bigint id PK
        bigint user_id FK
        bigint banned_by FK
        enum type
        varchar reason
        timestamp expires_at
        timestamp lifted_at
        bigint lifted_by FK
    }

    personal_access_tokens {
        bigint id PK
        varchar tokenable_type
        bigint tokenable_id
        varchar name
        text token
        json abilities
        timestamp last_used_at
    }

    forum_categories {
        bigint id PK
        varchar name
        varchar slug UK
        varchar description
        varchar icon
        int position
        boolean is_active
    }

    forum_threads {
        bigint id PK
        bigint forum_category_id FK
        bigint user_id FK
        varchar title
        varchar slug UK
        varchar excerpt
        boolean is_locked
        boolean is_pinned
        int views_count
        timestamp last_post_at
    }

    forum_posts {
        bigint id PK
        bigint forum_thread_id FK
        bigint user_id FK
        longtext content
        boolean is_solution
    }

    forum_post_reports {
        bigint id PK
        bigint forum_post_id FK
        bigint reporter_id FK
        varchar reason
        text details
        varchar status
        bigint reviewed_by FK
        timestamp reviewed_at
    }

    users ||--o| profils_gw2 : "a un"
    users ||--o{ user_bans : "subit"
    users ||--o{ personal_access_tokens : "possède"
    users ||--o{ forum_threads : "crée"
    users ||--o{ forum_posts : "rédige"
    users ||--o{ forum_post_reports : "signale"
    forum_categories ||--o{ forum_threads : "contient"
    forum_threads ||--o{ forum_posts : "contient"
    forum_posts ||--o{ forum_post_reports : "reçoit"
```

---

## Flux d'authentification

```mermaid
sequenceDiagram
    participant Browser as Navigateur
    participant SPA as React SPA
    participant API as Laravel API
    participant DB as MySQL

    Browser->>SPA: Charge l'application
    SPA->>SPA: AuthProvider monte<br/>Lit localStorage (auth_token)

    alt Token présent
        SPA->>API: GET /api/v1/auth/me<br/>Authorization: Bearer {token}
        API->>DB: SELECT personal_access_tokens WHERE token = hash(token)
        DB-->>API: Token valide → User
        API-->>SPA: { user }
        SPA->>SPA: authStore.setAuth(user)
    else Token absent ou invalide
        SPA->>SPA: authStore.clearAuth()
    end

    Browser->>SPA: Formulaire login
    SPA->>API: POST /api/v1/auth/login { email, password }
    API->>API: throttle:5,1 (rate limiting)
    API->>DB: Auth::attempt(credentials)
    DB-->>API: User trouvé

    alt Utilisateur banni
        API-->>SPA: 403 { message, ban }
    else Authentification OK
        API->>DB: INSERT personal_access_tokens
        API-->>SPA: 200 { user, token }
        SPA->>SPA: localStorage.setItem('auth_token', token)
        SPA->>SPA: authStore.setAuth(user)
    end
```

---

## Flux de synchronisation GW2

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant SPA as React SPA
    participant API as Laravel API
    participant Cache as Laravel Cache
    participant GW2 as api.guildwars2.com

    User->>SPA: Saisit sa clé API GW2
    SPA->>API: POST /api/v1/profile/api-key { api_key }
    API->>GW2: GET /v2/tokeninfo?access_token={key}

    alt Clé invalide
        GW2-->>API: 401 Unauthorized
        API-->>SPA: 422 { errors: { api_key: "Clé invalide" } }
    else Clé valide
        GW2-->>API: { id, name, permissions: [...] }
        API->>API: Chiffrement AES-256 de la clé
        API->>DB: UPDATE users SET api_key = encrypted_key
        API->>GW2: GET /v2/account
        API->>GW2: GET /v2/characters?ids=all
        API->>DB: UPSERT profils_gw2
        API-->>SPA: 200 { profil_gw2 }
    end

    User->>SPA: Consulte son profil GW2
    SPA->>API: GET /api/v1/profile/gw2-data
    API->>Cache: Cache::remember('gw2_data_{userId}', 300s)

    alt Cache hit
        Cache-->>API: Données en cache
    else Cache miss
        API->>GW2: GET /v2/account + /v2/characters
        GW2-->>API: Données fraîches
        API->>Cache: Stocke 5 minutes
    end

    API-->>SPA: { compte, personnages }
```

---

## Flux de modération forum

```mermaid
stateDiagram-v2
    [*] --> Open : Utilisateur signale un post
    Open --> Resolved : Admin/Modérateur résout
    Open --> Dismissed : Admin/Modérateur rejette
    Resolved --> [*]
    Dismissed --> [*]

    note right of Open
        status = 'open'
        Visible dans la liste admin
        Notifications futures possibles
    end note

    note right of Resolved
        status = 'resolved'
        reviewed_by = admin_id
        reviewed_at = timestamp
    end note
```

---

## Outils recommandés

| Diagramme | Outil | Format |
|---|---|---|
| Architecture C4 | Structurizr, C4-PlantUML | DSL/PlantUML |
| ERD | dbdiagram.io, DBeaver | SQL/visuel |
| Séquences | Mermaid (natif GitHub) | Markdown |
| Infrastructure | draw.io / Excalidraw | Visuel |
| Flux React | React DevTools | Runtime |
