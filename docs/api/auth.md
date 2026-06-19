# API — Authentification

Base URL : `/api/v1/auth`

---

## POST /api/v1/auth/register

Créer un nouveau compte utilisateur.

**Auth :** Non requise  
**Rate limit :** Aucun

### Requête

```http
POST /api/v1/auth/register
Content-Type: application/json

{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "password": "MonMotDePasse123",
    "password_confirmation": "MonMotDePasse123"
}
```

| Champ | Type | Règles |
|---|---|---|
| `nom` | string | required, 3-100 chars |
| `email` | string | required, email valide, unique(users) |
| `password` | string | required, min:8 |
| `password_confirmation` | string | required, identique à password |

### Réponses

**201 Created**
```json
{
    "user": {
        "id": 42,
        "nom": "Jean Dupont",
        "email": "jean@example.com",
        "pseudo_gw2": null,
        "avatar": null,
        "role": "user",
        "created_at": "2026-06-19T10:00:00.000000Z"
    },
    "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

**422 Unprocessable Entity**
```json
{
    "message": "The email has already been taken.",
    "errors": {
        "email": ["The email has already been taken."]
    }
}
```

---

## POST /api/v1/auth/login

Authentifier un utilisateur existant.

**Auth :** Non requise  
**Rate limit :** 5 requêtes / minute par email + IP

### Requête

```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "email": "jean@example.com",
    "password": "MonMotDePasse123"
}
```

### Réponses

**200 OK**
```json
{
    "user": { ... },
    "token": "2|XyZaBcDeFgHiJkLmNoPqRsTuVwXy..."
}
```

**401 Unauthorized** — Credentials invalides
```json
{ "message": "Ces identifiants ne correspondent pas à nos enregistrements." }
```

**403 Forbidden** — Utilisateur banni
```json
{
    "message": "Votre compte est suspendu.",
    "ban": {
        "type": "temporary",
        "reason": "Comportement inapproprié sur le forum",
        "expires_at": "2026-07-01T00:00:00.000000Z"
    }
}
```

**429 Too Many Requests** — Rate limit
```json
{ "message": "Too Many Attempts." }
```

---

## GET /api/v1/auth/me

Retourner l'utilisateur authentifié. Utilisé au startup SPA pour valider le token persisté.

**Auth :** Bearer Token requis

### Requête

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

### Réponses

**200 OK**
```json
{
    "user": {
        "id": 42,
        "nom": "Jean Dupont",
        "email": "jean@example.com",
        "pseudo_gw2": "MonPseudo.1234",
        "avatar": "https://localhost:8000/storage/avatars/user_42.jpg",
        "role": "user",
        "created_at": "2026-06-19T10:00:00.000000Z"
    }
}
```

**401 Unauthorized** — Token invalide ou expiré
```json
{ "message": "Unauthenticated." }
```

---

## POST /api/v1/auth/logout

Révoquer le token courant.

**Auth :** Bearer Token requis

### Requête

```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

### Réponse

**200 OK**
```json
{ "message": "Déconnecté avec succès." }
```

---

## POST /api/v1/auth/logout-all

Révoquer tous les tokens de l'utilisateur (tous les appareils).

**Auth :** Bearer Token requis

### Réponse

**200 OK**
```json
{ "message": "Tous les appareils ont été déconnectés." }
```

---

## POST /api/v1/auth/forgot-password

Envoyer un email de réinitialisation de mot de passe.

**Auth :** Non requise  
**Rate limit :** 3 requêtes / minute

### Requête

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
    "email": "jean@example.com"
}
```

### Réponse

**200 OK** — Toujours 200 pour éviter l'énumération d'emails
```json
{ "message": "Un email de réinitialisation a été envoyé si ce compte existe." }
```

---

## POST /api/v1/auth/reset-password

Réinitialiser le mot de passe avec le token reçu par email.

**Auth :** Non requise

### Requête

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
    "token": "abc123...",
    "email": "jean@example.com",
    "password": "NouveauMotDePasse456",
    "password_confirmation": "NouveauMotDePasse456"
}
```

### Réponses

**200 OK**
```json
{ "message": "Mot de passe réinitialisé avec succès." }
```

**422 Unprocessable Entity** — Token invalide ou expiré
```json
{
    "message": "Ce token de réinitialisation est invalide.",
    "errors": { "token": ["Ce token de réinitialisation est invalide."] }
}
```
