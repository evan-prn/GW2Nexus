# API — Administration

Base URL : `/api/v1/admin`  
**Middleware requis :** `auth:sanctum` + `admin` (role = 'admin')  
Sauf routes modération : `auth:sanctum` + `moderator` (role = 'moderateur' ou 'admin')

---

## GET /api/v1/admin/stats

Statistiques globales du système.

### Réponse

**200 OK**
```json
{
    "stats": {
        "total_users": 1250,
        "active_users": 1180,
        "banned_users": 12,
        "deleted_users": 58,
        "admins": 2,
        "moderateurs": 5
    }
}
```

---

## GET /api/v1/admin/users

Liste paginée des utilisateurs avec filtres.

### Paramètres de requête

| Paramètre | Type | Description |
|---|---|---|
| `search` | string | Recherche dans nom, email, pseudo_gw2 |
| `role` | string | Filtre : `user`, `moderateur`, `admin` |
| `status` | string | Filtre : `active`, `banned`, `deleted` |
| `per_page` | int | Résultats par page (défaut: 20, max: 100) |
| `page` | int | Numéro de page |

### Réponse

**200 OK**
```json
{
    "data": [
        {
            "id": 1,
            "nom": "Jean Dupont",
            "email": "jean@example.com",
            "pseudo_gw2": "MonPseudo.1234",
            "role": "user",
            "created_at": "2026-03-15T10:00:00.000000Z",
            "deleted_at": null,
            "active_ban": null
        },
        {
            "id": 2,
            "nom": "Bob Martin",
            "email": "bob@example.com",
            "pseudo_gw2": null,
            "role": "user",
            "created_at": "2026-04-01T08:30:00.000000Z",
            "deleted_at": null,
            "active_ban": {
                "id": 5,
                "type": "temporary",
                "reason": "Spam",
                "expires_at": "2026-07-01T00:00:00.000000Z",
                "created_at": "2026-06-19T09:00:00.000000Z"
            }
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 13,
        "per_page": 20,
        "total": 250,
        "from": 1,
        "to": 20
    }
}
```

---

## GET /api/v1/admin/users/{id}

Détail d'un utilisateur avec historique des bans.

### Réponse

**200 OK**
```json
{
    "user": {
        "id": 2,
        "nom": "Bob Martin",
        "email": "bob@example.com",
        "pseudo_gw2": null,
        "role": "user",
        "created_at": "2026-04-01T08:30:00.000000Z",
        "active_ban": { ... },
        "ban_history": [
            {
                "id": 3,
                "type": "temporary",
                "reason": "Langage inapproprié",
                "expires_at": "2026-05-15T00:00:00.000000Z",
                "lifted_at": "2026-05-15T00:00:00.000000Z",
                "banned_by": { "id": 1, "nom": "Admin Principal" },
                "lifted_by": null,
                "created_at": "2026-05-01T10:00:00.000000Z"
            }
        ]
    }
}
```

---

## POST /api/v1/admin/users/{id}/ban

Appliquer un ban à un utilisateur.

### Requête

```http
POST /api/v1/admin/users/42/ban
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "type": "temporary",
    "reason": "Comportement toxique répété",
    "expires_at": "2026-07-19T00:00:00.000000Z"
}
```

| Champ | Type | Règles |
|---|---|---|
| `type` | string | required, `temporary` ou `permanent` |
| `reason` | string | required, max 500 chars |
| `expires_at` | datetime ISO | required si type = `temporary` |

### Réponses

**201 Created**
```json
{
    "message": "Utilisateur banni avec succès.",
    "ban": {
        "id": 10,
        "type": "temporary",
        "reason": "Comportement toxique répété",
        "expires_at": "2026-07-19T00:00:00.000000Z",
        "created_at": "2026-06-19T12:00:00.000000Z"
    }
}
```

**403 Forbidden** — Tentative de bannir un admin ou soi-même
```json
{ "message": "Impossible de bannir cet utilisateur." }
```

**404 Not Found**
```json
{ "message": "Utilisateur introuvable." }
```

---

## DELETE /api/v1/admin/users/{id}/ban

Lever le ban actif d'un utilisateur.

### Réponse

**200 OK**
```json
{ "message": "Ban levé avec succès." }
```

**422 Unprocessable Entity** — Pas de ban actif
```json
{ "message": "Cet utilisateur n'est pas actuellement banni." }
```

---

## GET /api/v1/admin/forum/reports

Liste des signalements de posts forum.

**Middleware :** `moderator` (moderateur ou admin)

### Paramètres

| Paramètre | Valeurs | Description |
|---|---|---|
| `status` | `open`, `resolved`, `dismissed` | Filtre par statut (défaut: `open`) |

### Réponse

**200 OK**
```json
[
    {
        "id": 15,
        "post": {
            "id": 234,
            "content": "Contenu signalé...",
            "author": { "id": 7, "nom": "Joueur XY" }
        },
        "reporter": { "id": 12, "nom": "Jean Dupont" },
        "reason": "spam",
        "details": "Ce message est une publicité.",
        "status": "open",
        "reviewed_by": null,
        "reviewed_at": null,
        "created_at": "2026-06-18T14:30:00.000000Z"
    }
]
```

---

## PATCH /api/v1/admin/forum/reports/{id}

Traiter un signalement (résoudre ou rejeter).

**Middleware :** `moderator`

### Requête

```json
{ "status": "resolved" }
```

| Valeur | Description |
|---|---|
| `resolved` | Signalement traité, action prise |
| `dismissed` | Signalement rejeté, pas d'action |

### Réponse

**200 OK**
```json
{
    "message": "Signalement mis à jour.",
    "report": { "id": 15, "status": "resolved", "reviewed_by": 1, "reviewed_at": "..." }
}
```

---

## PATCH /api/v1/admin/forum/threads/{id}/lock

Verrouiller ou déverrouiller un thread (toggle).

**Middleware :** `moderator`

### Réponse

**200 OK**
```json
{ "message": "Thread verrouillé." }
// ou
{ "message": "Thread déverrouillé." }
```

---

## PATCH /api/v1/admin/forum/threads/{id}/pin

Épingler ou désépingler un thread (toggle).

**Middleware :** `moderator`

### Réponse

**200 OK**
```json
{ "message": "Thread épinglé." }
// ou
{ "message": "Thread désépinglé." }
```
