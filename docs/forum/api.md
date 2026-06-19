# Forum API - GW2Nexus

Date: 2026-06-04

Base URL:

```text
/api/v1/forum
```

## Conventions de reponse

Objet simple:

```json
{
  "data": {},
  "message": "Operation effectuee avec succes."
}
```

Liste paginee:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 0
  }
}
```

Erreur:

```json
{
  "message": "Message d'erreur lisible."
}
```

## Authentification

Lecture:

- publique.
- aucun token requis.

Ecriture:

- token Sanctum Bearer requis.
- header attendu:

```text
Authorization: Bearer <token>
```

## Endpoints publics

Statut implementation:

- Les endpoints publics de lecture sont implementes.
- Les endpoints proteges d'ecriture sont implementes.

### GET /api/v1/forum/categories

Description:

- Retourne les categories actives du forum.

Authentification:

- Non requise.

Reponse attendue:

```json
{
  "data": [
    {
      "id": 1,
      "name": "General",
      "slug": "general",
      "description": "Discussions generales.",
      "icon": "message-circle",
      "position": 1,
      "threads_count": 0,
      "posts_count": 0,
      "last_thread": null
    }
  ]
}
```

### GET /api/v1/forum/categories/{category:slug}

Description:

- Retourne le detail d'une categorie.

Authentification:

- Non requise.

Erreurs possibles:

- 404 si la categorie n'existe pas ou n'est pas active.

### GET /api/v1/forum/categories/{category:slug}/threads

Description:

- Retourne les sujets pagines d'une categorie.
- Les sujets epingles doivent remonter en premier.

Authentification:

- Non requise.

Query params possibles:

- `page`
- `per_page`

### GET /api/v1/forum/threads/{thread:slug}

Description:

- Retourne le detail d'un sujet.
- Incremente les vues cote backend.

Authentification:

- Non requise.

Erreurs possibles:

- 404 si le sujet n'existe pas.

### GET /api/v1/forum/threads/{thread:slug}/posts

Description:

- Retourne les reponses paginees d'un sujet.

Authentification:

- Non requise.

Query params possibles:

- `page`
- `per_page`

## Endpoints proteges

### POST /api/v1/forum/categories/{category:slug}/threads

Description:

- Cree un nouveau sujet dans une categorie.

Authentification:

- Requise.

Payload:

```json
{
  "title": "Titre du sujet",
  "content": "Contenu du premier message."
}
```

Validation:

- `title`: required, string, min 3, max 150.
- `content`: required, string, min 10, max 20000.

Reponses:

- 201 en cas de succes.
- 401 si non connecte.
- 422 si validation invalide.

Reponse succes implementee:

```json
{
  "message": "Sujet cree avec succes.",
  "data": {}
}
```

### POST /api/v1/forum/threads/{thread:slug}/posts

Description:

- Ajoute une reponse a un sujet.

Authentification:

- Requise.

Payload:

```json
{
  "content": "Contenu de la reponse."
}
```

Validation:

- `content`: required, string, min 2, max 20000.

Reponses:

- 201 en cas de succes.
- 401 si non connecte.
- 403 si le sujet est verrouille.
- 422 si validation invalide.

Reponse succes implementee:

```json
{
  "message": "Reponse ajoutee avec succes.",
  "data": {}
}
```

### PATCH /api/v1/forum/posts/{post}

Description:

- Modifie un post existant.

Authentification:

- Requise.

Payload:

```json
{
  "content": "Nouveau contenu."
}
```

Reponses:

- 200 en cas de succes.
- 401 si non connecte.
- 403 si l'utilisateur n'est pas l'auteur, admin ou moderateur.
- 422 si validation invalide.

Reponse succes implementee:

```json
{
  "message": "Message mis a jour.",
  "data": {}
}
```

### DELETE /api/v1/forum/posts/{post}

Description:

- Supprime un post existant.

Authentification:

- Requise.

Reponses:

- 200 en cas de succes.
- 401 si non connecte.
- 403 si l'utilisateur n'est pas l'auteur, admin ou moderateur.

Reponse succes implementee:

```json
{
  "message": "Message supprime."
}
```

### POST /api/v1/forum/posts/{post}/reports

Description:

- Signale un message a l'equipe de moderation.

Authentification:

- Requise.

Payload:

```json
{
  "reason": "inappropriate",
  "details": "Details optionnels pour aider la moderation."
}
```

Motifs acceptes:

- `spam`
- `insult`
- `harassment`
- `inappropriate`
- `other`

Reponses:

- 201 en cas de succes.
- 401 si non connecte.
- 422 si le motif est invalide.
- 422 si l'utilisateur signale son propre message.
- 422 si l'utilisateur a deja signale ce message.

Reponse succes implementee:

```json
{
  "message": "Signalement envoye a la moderation.",
  "data": {
    "id": 1,
    "forum_post_id": 2,
    "reporter_id": 3,
    "reason": "inappropriate",
    "details": "Details optionnels pour aider la moderation.",
    "status": "open",
    "reviewed_by": null,
    "reviewed_at": null,
    "created_at": "2026-06-05T09:00:00+00:00",
    "updated_at": "2026-06-05T09:00:00+00:00"
  }
}
```

## Endpoints de moderation futurs

Ces endpoints sont a preparer mais pas a exposer dans le MVP initial sans validation dediee.

## Endpoints admin forum

### GET /api/v1/admin/forum/reports

Description:

- Retourne les signalements forum pagines pour le back-office.
- Route utilisee par `/admin/forum`.

Authentification:

- Requise.
- Reservee aux administrateurs selon le middleware admin existant.

Query params:

- `status`: `open`, `reviewed`, `dismissed`.
- `reason`: `spam`, `insult`, `harassment`, `inappropriate`, `other`.
- `page`
- `per_page`

Reponse succes:

```json
{
  "data": [
    {
      "id": 1,
      "reason": "inappropriate",
      "details": "Details optionnels.",
      "status": "open",
      "created_at": "2026-06-05T09:00:00+00:00",
      "reviewed_at": null,
      "reporter": {},
      "reviewer": null,
      "post": {
        "id": 2,
        "content": "Message signale.",
        "author": {},
        "thread": {
          "id": 1,
          "title": "Sujet",
          "slug": "sujet",
          "category": {}
        }
      }
    }
  ],
  "meta": {}
}
```

### PATCH /api/v1/forum/threads/{thread}/lock

- Verrouille ou deverrouille un sujet.
- Reserve aux moderateurs/admins.

### PATCH /api/v1/forum/threads/{thread}/pin

- Epingle ou desepingle un sujet.
- Reserve aux moderateurs/admins.

### DELETE /api/v1/forum/threads/{thread}

- Supprime un sujet.
- Reserve aux moderateurs/admins.
