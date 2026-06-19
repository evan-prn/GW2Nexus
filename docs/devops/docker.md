# Infrastructure Docker

## Architecture des conteneurs

```
docker-compose.yml
├── mysql          → MySQL 8.0 (base de données)
├── phpmyadmin     → phpMyAdmin 5.2 (admin MySQL)
├── mailpit        → Mailpit (capture SMTP)
├── laravel        → PHP 8.4 + Laravel 12 (backend API)
└── react          → Node 20 Alpine + Vite (frontend)
```

## Services

### mysql

```yaml
image: mysql:8.0
environment:
  MYSQL_DATABASE: ${DB_DATABASE}
  MYSQL_USER: ${DB_USERNAME}
  MYSQL_PASSWORD: ${DB_PASSWORD}
  MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
ports:
  - "3307:3306"
volumes:
  - mysql_data:/var/lib/mysql
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s
  retries: 5
```

Le port hôte **3307** (pas 3306) évite les conflits avec un MySQL local.

### laravel

```yaml
build:
  context: ./backend
  dockerfile: Dockerfile
ports:
  - "8000:8000"
depends_on:
  mysql:
    condition: service_healthy
  mailpit:
    condition: service_started
environment:
  DB_HOST: mysql
  MAIL_HOST: mailpit
command: ["./docker-entrypoint.sh"]
```

**docker-entrypoint.sh** :
1. Attend que MySQL soit prêt
2. `php artisan key:generate` si APP_KEY vide
3. `php artisan migrate --force`
4. `php artisan serve --host=0.0.0.0 --port=8000`

**Dockerfile backend :**
- Image : `php:8.4-cli`
- Extensions : `pdo`, `pdo_mysql`, `mbstring`, `exif`, `pcntl`, `bcmath`, `gd`
- Composer installé depuis image officielle
- Volume `./backend:/app` pour hot reload

### react

```yaml
build:
  context: ./frontend
  dockerfile: Dockerfile
ports:
  - "5174:5174"
volumes:
  - ./frontend:/app
  - /app/node_modules
command: npm run dev -- --host
```

**Dockerfile frontend :**
- Image : `node:20-alpine`
- `npm install` au build
- Dev server Vite expose le port 5174

### phpmyadmin

```yaml
image: phpmyadmin:5.2-apache
ports:
  - "8081:80"
environment:
  PMA_HOST: mysql
  PMA_PORT: 3306
depends_on:
  - mysql
```

Accessible sur http://localhost:8081  
Login : `root` / `${DB_ROOT_PASSWORD}` ou `${DB_USERNAME}` / `${DB_PASSWORD}`

### mailpit

```yaml
image: axllent/mailpit:latest
ports:
  - "8025:8025"    # UI web
  - "1025:1025"    # SMTP
```

Capture tous les emails envoyés par Laravel. Interface web sur http://localhost:8025.

---

## Réseau interne

Tous les services partagent un réseau Docker interne (`gw2nexus_network`). Communication par nom de service :

| Depuis | Vers | Hostname |
|---|---|---|
| laravel | mysql | `mysql` |
| laravel | mailpit | `mailpit` |
| react | laravel | Via proxy Vite (`/api/*` → `laravel:8000`) |
| phpmyadmin | mysql | `mysql` |
| host | tous | `localhost` + port mappé |

---

## Volumes persistants

| Volume | Service | Contenu |
|---|---|---|
| `mysql_data` | mysql | Données MySQL (persist entre restarts) |
| `./backend` → `/app` | laravel | Code source Laravel (hot reload) |
| `./frontend` → `/app` | react | Code source React (hot reload) |

---

## Variables d'environnement Docker Compose

Le fichier `.env` à la racine surcharge les valeurs `docker-compose.yml` :

| Variable | Défaut | Description |
|---|---|---|
| `DB_DATABASE` | `gw2nexus` | Nom de la base MySQL |
| `DB_USERNAME` | `gw2nexus_user` | Utilisateur MySQL |
| `DB_PASSWORD` | (requis) | Mot de passe MySQL user |
| `DB_ROOT_PASSWORD` | (requis) | Mot de passe MySQL root |
| `UID` | `1000` | UID Unix pour les volumes (Linux) |
| `GID` | `1000` | GID Unix pour les volumes (Linux) |

---

## Commandes de référence

```bash
# Démarrer (avec rebuild si nécessaire)
docker compose up -d --build

# Voir l'état des conteneurs
docker compose ps

# Suivre les logs d'un service
docker compose logs -f laravel

# Exécuter une commande dans un conteneur
docker compose exec laravel php artisan route:list
docker compose exec mysql mysql -u root -p

# Rebuild un seul service
docker compose up -d --build laravel

# Arrêt propre
docker compose down

# Arrêt + suppression volumes (RESET COMPLET ⚠️)
docker compose down -v
```

---

## Production

> La configuration Docker actuelle est orientée **développement local**. Pour la production :

- Utiliser des images multi-stage (build séparé de run)
- Pas de volume bind-mount du code source
- Nginx ou Caddy en reverse proxy devant Laravel et Vite
- Variables d'environnement via secrets (Docker Secrets, Vault, etc.)
- MySQL avec sauvegardes automatiques et réplication
- Redis pour le cache (remplacer database driver)
- Certbot / Let's Encrypt pour TLS
