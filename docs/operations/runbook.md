# Runbook Opérations

Guide de référence pour les opérations courantes en production.

> Ce runbook est en partie prospectif car GW2 Nexus est actuellement en développement. Adapter selon l'infrastructure de production choisie.

---

## Démarrage et arrêt

### Démarrage complet (Docker)

```bash
docker compose up -d
# Vérification
docker compose ps
curl http://localhost:8000/api/health
```

### Arrêt propre

```bash
docker compose down
```

### Redémarrage d'un service

```bash
docker compose restart laravel
docker compose restart react
docker compose restart mysql
```

---

## Base de données

### Lancer les migrations

```bash
docker compose exec laravel php artisan migrate
```

### Vérifier l'état des migrations

```bash
docker compose exec laravel php artisan migrate:status
```

### Sauvegarde manuelle MySQL

```bash
docker compose exec mysql mysqldump \
  -u gw2nexus_user -p"$DB_PASSWORD" \
  gw2nexus > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauration

```bash
docker compose exec -T mysql mysql \
  -u gw2nexus_user -p"$DB_PASSWORD" \
  gw2nexus < backup_YYYYMMDD_HHMMSS.sql
```

---

## Gestion des utilisateurs (via Tinker)

```bash
docker compose exec laravel php artisan tinker
```

```php
// Promouvoir un utilisateur en admin
User::where('email', 'user@example.com')->update(['role' => 'admin']);

// Vérifier l'état d'un ban
User::with('activeBan')->find(42)->activeBan;

// Compter les tokens actifs d'un utilisateur
User::find(42)->tokens()->count();

// Révoquer tous les tokens d'un utilisateur
User::find(42)->tokens()->delete();
```

---

## Cache

### Vider tout le cache

```bash
docker compose exec laravel php artisan cache:clear
```

### Vider le cache GW2 d'un utilisateur spécifique

```bash
docker compose exec laravel php artisan tinker
# Dans Tinker :
Cache::forget("gw2_account_42");
Cache::forget("gw2_chars_42");
Cache::forget("gw2_worldbosses_42");
```

### Vider le cache de configuration

```bash
docker compose exec laravel php artisan config:clear
docker compose exec laravel php artisan route:clear
```

---

## Logs

### Voir les logs Laravel en temps réel

```bash
docker compose logs -f laravel
# ou
docker compose exec laravel tail -f storage/logs/laravel.log
```

### Rechercher des erreurs

```bash
docker compose exec laravel grep "ERROR" storage/logs/laravel.log | tail -50
```

---

## Rotation de la clé APP_KEY

> ⚠️ ATTENTION : Changer `APP_KEY` invalide :
> - Tous les tokens Sanctum (tous les utilisateurs déconnectés)
> - Toutes les clés API GW2 chiffrées (irrécupérables → utilisateurs doivent re-saisir leur clé)
> - Les cookies de session chiffrés

Ne faire cela qu'en cas de compromission confirmée.

```bash
# 1. Générer nouvelle clé
docker compose exec laravel php artisan key:generate --show

# 2. Sauvegarder l'ancienne clé (si besoin de migration progressive)

# 3. Mettre à jour APP_KEY dans .env

# 4. Vider le cache
docker compose exec laravel php artisan cache:clear

# 5. Réinitialiser les tokens
docker compose exec laravel php artisan tinker
# DB::table('personal_access_tokens')->delete();
```

---

## Vérifications santé

| Check | Commande / URL | Résultat attendu |
|---|---|---|
| Backend API | `GET /api/health` | `{ "status-backend": "ok" }` |
| MySQL disponible | `docker compose exec mysql mysqladmin ping` | `mysqld is alive` |
| Migrations à jour | `php artisan migrate:status` | Toutes en `Ran` |
| Espace disque | `df -h` | > 20% libre |
| Logs d'erreur | `grep ERROR storage/logs/laravel.log` | Aucune erreur récente |

---

## Incidents courants

### L'application retourne 500

1. Vérifier `APP_DEBUG=false` en prod (ne pas exposer le stacktrace)
2. Consulter `storage/logs/laravel.log`
3. Vérifier que les migrations sont à jour
4. Vérifier la connexion MySQL

### L'API GW2 ne répond plus

Le système est prévu pour ça : `Gw2ApiService` retourne `null` et le frontend affiche "Données indisponibles". Aucune action requise sauf si prolongé.

Vérifier le statut officiel : https://status.guildwars2.com/

### Utilisateur banni ne peut plus se connecter

Comportement attendu. Pour lever le ban :
```bash
docker compose exec laravel php artisan tinker
# UserBan::where('user_id', 42)->whereNull('lifted_at')->update(['lifted_at' => now()]);
```

Ou via l'interface admin : `/admin/users/{id}`.

### Emails non envoyés en production

1. Vérifier configuration SMTP dans `backend/.env`
2. Tester via Tinker : `Mail::raw('test', fn($m) => $m->to('test@example.com'));`
3. Consulter les logs Mailpit (dev) ou les logs SMTP (prod)
