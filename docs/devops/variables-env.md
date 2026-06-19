# Variables d'environnement

Documentation complète de toutes les variables d'environnement du projet.

---

## Fichier `.env` (racine — Docker Compose)

Ces variables contrôlent l'orchestration des conteneurs Docker.

| Variable | Défaut | Requis | Description |
|---|---|---|---|
| `DB_DATABASE` | `gw2nexus` | Oui | Nom de la base de données MySQL |
| `DB_USERNAME` | `gw2nexus_user` | Oui | Utilisateur MySQL (non-root) |
| `DB_PASSWORD` | — | Oui | Mot de passe de l'utilisateur MySQL |
| `DB_ROOT_PASSWORD` | — | Oui | Mot de passe root MySQL |
| `UID` | `1000` | Non | UID Linux pour les permissions volumes |
| `GID` | `1000` | Non | GID Linux pour les permissions volumes |

---

## Fichier `backend/.env` (Laravel)

### Application

| Variable | Défaut / Exemple | Description |
|---|---|---|
| `APP_NAME` | `GW2Nexus` | Nom de l'application |
| `APP_ENV` | `local` | Environnement : `local`, `staging`, `production` |
| `APP_KEY` | `base64:...` | Clé de chiffrement AES (générer avec `artisan key:generate`) |
| `APP_DEBUG` | `true` | Affiche les erreurs détaillées (jamais `true` en prod) |
| `APP_URL` | `http://localhost:8000` | URL du backend |
| `APP_LOCALE` | `fr` | Locale des messages d'erreur |
| `APP_FALLBACK_LOCALE` | `en` | Locale de fallback |
| `BCRYPT_ROUNDS` | `12` | Force du hachage passwords |

### Base de données

| Variable | Défaut / Exemple | Description |
|---|---|---|
| `DB_CONNECTION` | `mysql` | Driver PDO |
| `DB_HOST` | `mysql` (docker) / `127.0.0.1` (local) | Hôte MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_DATABASE` | `gw2nexus` | Nom de la base (doit correspondre au `.env` racine) |
| `DB_USERNAME` | `gw2nexus_user` | Utilisateur MySQL |
| `DB_PASSWORD` | — | Mot de passe MySQL |

### Cache

| Variable | Défaut | Description |
|---|---|---|
| `CACHE_STORE` | `database` | Driver cache : `database`, `redis`, `array` |
| `CACHE_PREFIX` | `gw2nexus_` | Préfixe des clés de cache |

### Session (Sanctum SPA)

| Variable | Défaut | Description |
|---|---|---|
| `SESSION_DRIVER` | `cookie` | Driver session |
| `SESSION_LIFETIME` | `120` | Durée session en minutes |
| `SESSION_DOMAIN` | `localhost` | Domaine du cookie session |
| `SESSION_SAME_SITE` | `lax` | Policy SameSite cookie |
| `SESSION_SECURE_COOKIE` | `false` | HTTPS only (mettre `true` en prod) |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:5174,127.0.0.1:5174` | Domaines autorisés Sanctum SPA |

### Email

| Variable | Défaut | Description |
|---|---|---|
| `MAIL_MAILER` | `smtp` | Driver mail |
| `MAIL_HOST` | `mailpit` (docker) / `127.0.0.1` (local) | Hôte SMTP |
| `MAIL_PORT` | `1025` | Port SMTP (Mailpit) / `587` (prod TLS) |
| `MAIL_USERNAME` | `null` | Nom d'utilisateur SMTP |
| `MAIL_PASSWORD` | `null` | Mot de passe SMTP |
| `MAIL_ENCRYPTION` | `null` | Chiffrement : `tls`, `ssl`, `null` |
| `MAIL_FROM_ADDRESS` | `no-reply@gw2nexus.local` | Adresse expéditeur |
| `MAIL_FROM_NAME` | `GW2Nexus` | Nom expéditeur |

### Frontend & CORS

| Variable | Défaut | Description |
|---|---|---|
| `FRONTEND_URL` | `http://localhost:5174` | URL frontend (CORS allowed origin) |

### API Guild Wars 2

| Variable | Défaut | Description |
|---|---|---|
| `GW2_API_BASE_URL` | `https://api.guildwars2.com/v2` | URL de base API ArenaNet |
| `GW2_API_TIMEOUT` | `10` | Timeout HTTP en secondes |

### Queue

| Variable | Défaut | Description |
|---|---|---|
| `QUEUE_CONNECTION` | `database` | Driver queue : `database`, `redis`, `sync` |

### Logs

| Variable | Défaut | Description |
|---|---|---|
| `LOG_CHANNEL` | `stack` | Canal de log |
| `LOG_LEVEL` | `debug` | Niveau minimum : `debug`, `info`, `warning`, `error` |

---

## Fichier `frontend/.env` (Vite/React)

| Variable | Défaut | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5174` | URL de base pour Axios (le proxy Vite redirige /api/*) |
| `VITE_APP_NAME` | `GW2Nexus` | Nom affiché dans l'UI |

> **Important :** Les variables Vite préfixées `VITE_` sont exposées côté client dans le bundle. Ne jamais y mettre de secrets.

---

## Différences selon l'environnement

| Variable | Développement | Production |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | `false` ⚠️ |
| `DB_HOST` | `mysql` (Docker) | IP/hostname MySQL prod |
| `MAIL_HOST` | `mailpit` | smtp.provider.com |
| `MAIL_PORT` | `1025` | `587` |
| `SESSION_SECURE_COOKIE` | `false` | `true` ⚠️ |
| `CACHE_STORE` | `database` | `redis` (recommandé) |
| `LOG_LEVEL` | `debug` | `warning` ou `error` |
| `FRONTEND_URL` | `http://localhost:5174` | `https://gw2nexus.com` |
| `SANCTUM_STATEFUL_DOMAINS` | `localhost:5174` | `gw2nexus.com` |
