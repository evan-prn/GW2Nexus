# Sécurité — Vue d'ensemble

## Périmètre de sécurité

```
[Internet]
    │
    ▼ HTTPS (TLS) ← À configurer en production (reverse proxy)
[Frontend SPA] ← XSS risk (localStorage)
    │
    ▼ Bearer Token (HTTPS)
[Laravel API] ← Principal périmètre de sécurité
    │
    ├── [MySQL] ← Chiffrement données sensibles
    └── [ArenaNet API] ← Clés API users chiffrées
```

---

## Authentification

| Mécanisme | Implémentation | Niveau |
|---|---|---|
| Passwords | bcrypt, 12 rounds (cast `hashed`) | ★★★★★ |
| Sessions API | Sanctum Bearer Token, révocables | ★★★★☆ |
| Token storage | localStorage (côté client) | ★★★☆☆ |
| Rate limiting login | 5 req/min par email+IP | ★★★★☆ |
| Rate limiting forgot-pwd | 3 req/min | ★★★★☆ |

### Risque XSS / localStorage

Le token Bearer est stocké en `localStorage`. Une faille XSS permettrait à un attaquant de le voler.

**Mitigations en place :**
- Tailwind CSS (pas de `dangerouslySetInnerHTML` non contrôlé)
- React échappe nativement le HTML
- Contenu forum : à valider (sanitiser côté backend avant affichage)

**Amélioration recommandée :** Configurer des Content Security Policy (CSP) headers en production.

---

## Données sensibles

| Donnée | Stockage | Chiffrement |
|---|---|---|
| Mots de passe | `users.password` | bcrypt (one-way) |
| Clés API GW2 | `users.api_key` | AES-256-CBC via APP_KEY |
| Bearer Tokens | `personal_access_tokens.token` | SHA-256 (one-way) |
| Emails | `users.email` | En clair (nécessaire pour auth) |
| Avatars | Storage local | Pas chiffré |

### Clé API GW2 — Détail

- **Stockage** : Colonne `users.api_key` avec cast Eloquent `encrypted`
- **Algorithme** : AES-256-CBC via `Illuminate\Encryption\Encrypter`
- **Clé de chiffrement** : Dérivée de `APP_KEY` (base64, 32 bytes)
- **Risque** : Si `APP_KEY` est compromise ou perdue, toutes les clés GW2 sont irrécupérables
- **Jamais exposée** : Attribut dans `$hidden` du modèle User → jamais retourné en JSON

---

## Autorisation

| Middleware | Vérifie | Appliqué sur |
|---|---|---|
| `auth:sanctum` | Bearer token valide | Toutes routes protégées |
| `ban.check` | Pas de ban actif | Toutes routes post-auth |
| `admin` | `user->role === 'admin'` | Routes `/api/v1/admin/users/*` |
| `moderator` | `role in ['moderateur','admin']` | Routes `/api/v1/admin/forum/*` |

### Vérifications dans les controllers

- `ForumPostController@update/delete` : vérifie `$post->user_id === $auth->id` ou role moderateur
- `AdminUserController@ban` : vérifie `$target->role !== 'admin'` et `$target->id !== $admin->id`
- `ForumPostController@store` : vérifie `$thread->is_locked === false`

---

## CORS

**Fichier :** `backend/config/cors.php`

```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5174')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

Les routes `/api/*` et `/sanctum/*` sont dans les paths autorisés. En production, `FRONTEND_URL` doit pointer exactement sur l'URL de production (pas de wildcard).

---

## Rate Limiting

| Endpoint | Limite | Fenêtre |
|---|---|---|
| `POST /api/v1/auth/login` | 5 requêtes | 1 minute par email+IP |
| `POST /api/v1/auth/forgot-password` | 3 requêtes | 1 minute |
| `GET /api/v1/events/schedule` | 60 requêtes | 1 minute |
| `POST /api/v1/contact` | 3 requêtes | 10 minutes |

Implémenté via `throttle:{max},{minutes}` middleware Laravel.

---

## Validation des inputs

Toutes les données entrantes passent par des **Form Requests** avec des règles strictes. Aucun input utilisateur n'est jamais passé directement à une requête SQL (Eloquent protège de l'injection SQL via PDO paramétré).

**Points à surveiller :**
- Contenu des posts forum : si affiché en HTML, s'assurer que le contenu est sanitisé (actuellement stocké brut)
- Avatars uploadés : vérifier les types MIME côté serveur (pas seulement l'extension)
- Paramètres de pagination (`per_page`) : limité à 100 via validation Form Request

---

## Checklist sécurité production

- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] `APP_KEY` unique, non partagé, sauvegardé
- [ ] HTTPS forcé (TLS sur reverse proxy)
- [ ] Headers de sécurité (CSP, HSTS, X-Frame-Options) via Nginx/Apache
- [ ] `SESSION_SECURE_COOKIE=true`
- [ ] `SANCTUM_STATEFUL_DOMAINS` limité à l'URL de production
- [ ] `FRONTEND_URL` limité au domaine de production (CORS)
- [ ] Sauvegardes MySQL chiffrées
- [ ] Rotation `APP_KEY` documentée (invalide tous les tokens + clés GW2)
- [ ] Logs d'accès activés et monitorés
- [ ] Mailpit remplacé par SMTP sécurisé (TLS/587)
