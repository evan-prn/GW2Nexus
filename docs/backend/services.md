# Services Backend

## Gw2ApiService

**Fichier :** `backend/app/Services/Gw2ApiService.php`  
**Responsabilité :** Toutes les interactions avec l'API officielle ArenaNet (api.guildwars2.com/v2).

### Méthodes publiques

| Méthode | Endpoint GW2 | Cache TTL | Retourne |
|---|---|---|---|
| `validateApiKey(string $key)` | `GET /v2/tokeninfo` | 60s | `array\|null` (tokeninfo) |
| `getAccountData(string $key)` | `GET /v2/account` | 300s | `array\|null` |
| `getCharacters(string $key)` | `GET /v2/characters?ids=all` | 300s | `array\|null` |
| `getWorldBossStatus(string $key)` | `GET /v2/account/worldbosses` | 300s | `array\|null` |

### Cache

```php
// Clé de cache par userId pour éviter collisions
$cacheKey = "gw2_account_{$userId}";
$data = Cache::remember($cacheKey, 300, function () use ($apiKey) {
    return $this->fetchFromArenaNet('/v2/account', $apiKey);
});
```

**Invalidation** : Lors de la suppression ou mise à jour d'une clé API, les caches `gw2_account_{id}`, `gw2_characters_{id}` et `gw2_worldbosses_{id}` sont supprimés.

### Comportement d'erreur

- Retourne `null` si l'API est indisponible, la clé invalide, ou timeout (10s)
- Les erreurs sont loguées via `Log::error()` avec contexte (userId, endpoint, message)
- Le frontend gère `null` gracieusement (affichage "Données indisponibles")

### Configuration

```env
GW2_API_BASE_URL=https://api.guildwars2.com/v2
GW2_API_TIMEOUT=10
```

```php
// config/services.php
'gw2' => [
    'base_url' => env('GW2_API_BASE_URL', 'https://api.guildwars2.com/v2'),
    'timeout'  => env('GW2_API_TIMEOUT', 10),
],
```

---

## AdminUserService

**Fichier :** `backend/app/Services/AdminUserService.php`  
**Responsabilité :** Logique métier de l'administration des utilisateurs.

### Méthodes publiques

#### `paginate(array $filters): LengthAwarePaginator`

Retourne une liste paginée d'utilisateurs avec filtres.

Filtres disponibles :
- `search` : Recherche dans `nom`, `email`, `pseudo_gw2` (LIKE %search%)
- `role` : Filtre par rôle (`user`, `moderateur`, `admin`)
- `status` : `active` (pas banni), `banned` (banni actif), `deleted` (soft deleted)
- `per_page` : Nombre par page (max 100, défaut 20)

Eager loading automatique : `activeBan` pour éviter N+1.

#### `ban(User $target, User $admin, array $data): UserBan`

```
1. Lever tous les bans actifs précédents (lifted_at = now, lifted_by = admin)
2. Révoquer tous les tokens Sanctum du target
3. Créer UserBan avec { user_id, banned_by, type, reason, expires_at }
4. Retourner le nouveau UserBan
```

Garde-fous :
- Impossible de bannir un admin
- Impossible de se bannir soi-même

#### `unban(User $target): void`

Lève le ban actif s'il existe (`lifted_at = now`). Ne fait rien si l'utilisateur n'est pas banni.

#### `stats(): array`

```php
return [
    'total_users'   => User::count(),
    'active_users'  => User::whereDoesntHave('activeBan')->count(),
    'banned_users'  => User::whereHas('activeBan')->count(),
    'deleted_users' => User::onlyTrashed()->count(),
    'admins'        => User::where('role', 'admin')->count(),
    'moderateurs'   => User::where('role', 'moderateur')->count(),
];
```

---

## ContactMail

**Fichier :** `backend/app/Mail/ContactMail.php`  
**Vue :** `backend/resources/views/emails/contact.blade.php`

Envoyé lors d'un POST `/api/v1/contact`. Contient le nom, email et message de l'expéditeur. Destinataire configurable via `MAIL_FROM_ADDRESS`.

En développement : intercepté par Mailpit (http://localhost:8025).
