# API REST — Vue d'ensemble

## Base URL

```
http://localhost:8000/api/v1
```

En production, le frontend utilise un proxy Vite : `/api/v1/*` → `laravel:8000/api/v1/*`.

## Authentification

Toutes les routes protégées requièrent un Bearer Token dans le header :

```http
Authorization: Bearer 1|AbCdEfGhIjKlMnOpQrStUvWxYz...
```

Le token est obtenu via `POST /api/v1/auth/login` ou `POST /api/v1/auth/register`.

## Format des réponses

### Succès

```json
{
    "message": "Action réussie",
    "user": { "id": 1, "nom": "Jean Dupont", ... },
    "data": { ... },
    "meta": { "current_page": 1, "last_page": 5, "total": 47, "per_page": 10 }
}
```

### Erreur de validation (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["Cet email est déjà utilisé."],
        "password": ["Le mot de passe doit contenir au moins 8 caractères."]
    }
}
```

### Erreur d'authentification (401)

```json
{ "message": "Unauthenticated." }
```

### Erreur d'autorisation (403)

```json
{ "message": "Accès refusé." }
```

### Rate limit dépassé (429)

```json
{ "message": "Too Many Attempts." }
```

## Index des endpoints

### Publics (sans authentification)

| Méthode | Route | Limite | Description |
|---|---|---|---|
| GET | `/api/health` | - | Healthcheck backend |
| POST | `/api/v1/auth/register` | - | Créer un compte |
| POST | `/api/v1/auth/login` | 5/min | Se connecter |
| POST | `/api/v1/auth/forgot-password` | 3/min | Demander reset password |
| POST | `/api/v1/auth/reset-password` | - | Réinitialiser password |
| POST | `/api/v1/contact` | 3/10min | Formulaire de contact |
| GET | `/api/v1/events/schedule` | 60/min | Calendrier événements GW2 |
| GET | `/api/v1/forum/categories` | - | Liste catégories forum |
| GET | `/api/v1/forum/categories/{slug}` | - | Détail catégorie |
| GET | `/api/v1/forum/categories/{slug}/threads` | - | Threads d'une catégorie |
| GET | `/api/v1/forum/threads/{slug}` | - | Détail thread |
| GET | `/api/v1/forum/threads/{slug}/posts` | - | Posts paginés |

### Protégés (Bearer Token requis)

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/auth/me` | Utilisateur courant |
| POST | `/api/v1/auth/logout` | Déconnexion (token courant) |
| POST | `/api/v1/auth/logout-all` | Déconnexion (tous les appareils) |
| GET | `/api/v1/profile` | Profil complet |
| PUT | `/api/v1/profile` | Modifier profil |
| POST | `/api/v1/profile/avatar` | Upload avatar |
| POST | `/api/v1/profile/api-key` | Sauvegarder clé GW2 |
| DELETE | `/api/v1/profile/api-key` | Supprimer clé GW2 |
| GET | `/api/v1/profile/gw2-data` | Données compte GW2 |
| GET | `/api/v1/profile/world-boss-status` | Statut world bosses |
| POST | `/api/v1/forum/categories/{slug}/threads` | Créer un sujet |
| POST | `/api/v1/forum/threads/{slug}/posts` | Répondre à un sujet |
| PATCH | `/api/v1/forum/posts/{id}` | Éditer un message |
| DELETE | `/api/v1/forum/posts/{id}` | Supprimer un message |
| POST | `/api/v1/forum/posts/{id}/reports` | Signaler un message |

### Admin uniquement (`role = admin`)

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/admin/stats` | Statistiques globales |
| GET | `/api/v1/admin/users` | Liste utilisateurs (filtrée) |
| GET | `/api/v1/admin/users/{id}` | Détail utilisateur + bans |
| POST | `/api/v1/admin/users/{id}/ban` | Appliquer un ban |
| DELETE | `/api/v1/admin/users/{id}/ban` | Lever le ban |

### Modérateur+ (`role = moderateur` ou `admin`)

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/v1/admin/forum/reports` | Liste signalements |
| PATCH | `/api/v1/admin/forum/reports/{id}` | Résoudre/rejeter signalement |
| PATCH | `/api/v1/admin/forum/threads/{id}/lock` | Toggle verrouillage |
| PATCH | `/api/v1/admin/forum/threads/{id}/pin` | Toggle épinglage |

## Documentation détaillée par domaine

- [Auth](auth.md)
- [Profil & GW2](profile.md)
- [Forum](../forum/FORUM_API.md)
- [Admin](admin.md)
- [Events](events.md)
- [Contact](contact.md)
