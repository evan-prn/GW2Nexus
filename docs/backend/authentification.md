# Authentification — Laravel Sanctum Bearer Token

## Mécanisme

GW2 Nexus utilise **Laravel Sanctum en mode Bearer Token** (mode stateless). Chaque requête authentifiée doit inclure un token dans le header HTTP.

```
Authorization: Bearer 1|AbCdEfGhIjKlMnOpQrStUvWxYz...
```

## Flux complet

### 1. Inscription

```
POST /api/v1/auth/register
Body: { nom, email, password, password_confirmation }

→ RegisterRequest::authorize() + rules()
→ Transaction DB : User::create({ ..., role: 'user' })
→ user->refresh() (pour defaults MySQL)
→ $user->createToken('web')->plainTextToken
← 201 { user: UserResource, token: "1|abc..." }
```

### 2. Connexion

```
POST /api/v1/auth/login
Body: { email, password }
Rate limit: 5 tentatives / 1 minute par email+IP

→ LoginRequest::authorize() + rules()
→ throttle:5,1 (RateLimiter)
→ Auth::attempt(['email', 'password'])
→ BanCheck : SELECT user_bans WHERE user_id AND active
→ $user->createToken('web')->plainTextToken
← 200 { user: UserResource, token: "1|abc..." }
   401 si credentials invalides
   403 { message, ban: { type, reason, expires_at } } si banni
   429 si rate limit dépassé
```

### 3. Validation token (startup SPA)

```
GET /api/v1/auth/me
Authorization: Bearer {token}

→ auth:sanctum middleware
→ Lookup personal_access_tokens (hash du token)
→ User trouvé et actif
← 200 { user: UserResource }
   401 si token invalide ou expiré
```

### 4. Déconnexion

```
POST /api/v1/auth/logout
Authorization: Bearer {token}
→ $request->user()->currentAccessToken()->delete()
← 200 { message: "Déconnecté" }

POST /api/v1/auth/logout-all
→ $request->user()->tokens()->delete()
← 200 { message: "Tous les appareils déconnectés" }
```

### 5. Réinitialisation mot de passe

```
POST /api/v1/auth/forgot-password
Body: { email }
Rate limit: 3/min

→ Password::sendResetLink(['email'])
→ Envoi email avec token (Mailpit en dev)
← 200 { message: "Email envoyé" }

POST /api/v1/auth/reset-password
Body: { token, email, password, password_confirmation }

→ Password::reset()
→ Révocation tous les tokens (sécurité)
← 200 { message: "Mot de passe réinitialisé" }
```

---

## Stockage des tokens (Frontend)

| Aspect | Choix | Raison |
|---|---|---|
| Stockage | `localStorage` | Simple, persist entre onglets |
| Clé | `auth_token` | Convention projet |
| Injection | Intercepteur Axios | Automatique sur toutes les requêtes |
| Révocation | Suppression localStorage + clearAuth() | Sur 401 ou logout |

> **Note sécurité** : localStorage est vulnérable aux attaques XSS. En production, un cookie HttpOnly serait plus sécurisé mais nécessiterait le mode SPA de Sanctum avec CSRF.

---

## Table `personal_access_tokens`

| Colonne | Type | Description |
|---|---|---|
| `id` | bigint PK | Identifiant |
| `tokenable_type` | varchar | `App\Models\User` |
| `tokenable_id` | bigint | ID de l'utilisateur |
| `name` | varchar | Nom de l'appareil (`'web'`) |
| `token` | text | Hash SHA-256 du token |
| `abilities` | json | Permissions (null = toutes) |
| `last_used_at` | timestamp | Dernière utilisation |

Le token brut n'est stocké nulle part côté serveur. Seul son **hash SHA-256** est en base. Si le hash ne correspond pas, le token est rejeté.

---

## Système de rôles

```php
enum role: string {
    case User       = 'user';
    case Moderateur = 'moderateur';
    case Admin      = 'admin';
}
```

| Rôle | Accès |
|---|---|
| `user` | Forum (lecture + écriture), Profil, Events, Contact |
| `moderateur` | + Modération forum (lock/pin threads, resolve reports) |
| `admin` | + Back-office utilisateurs (ban/unban, stats, gestion roles) |

---

## Système de ban

Un utilisateur banni est rejeté **à la connexion** (LoginController) ET **sur chaque requête** (BanCheck middleware).

```
UserBan {
  user_id     → qui est banni
  banned_by   → qui a appliqué le ban (admin)
  type        → 'temporary' | 'permanent'
  reason      → motif du ban
  expires_at  → null si permanent, date si temporaire
  lifted_at   → null si actif, date si levé
  lifted_by   → null si actif, admin si levé
}
```

**Scope `active()`** : `WHERE lifted_at IS NULL AND (type = 'permanent' OR expires_at > NOW())`

Quand un ban est appliqué :
1. Les bans précédents actifs sont levés
2. Tous les tokens Sanctum sont révoqués (`user->tokens()->delete()`)
3. Le nouveau ban est créé

---

## Sécurité

| Menace | Protection |
|---|---|
| Brute force login | `throttle:5,1` (5 req/min par email+IP) |
| Brute force forgot password | `throttle:3,1` |
| CSRF | Inutile (Bearer token, pas de cookie) |
| XSS vol de token | CSP headers (à configurer en prod) |
| Token volé | Révocable individuellement ou globalement |
| Password en clair | Cast `hashed` → bcrypt (12 rounds) |
