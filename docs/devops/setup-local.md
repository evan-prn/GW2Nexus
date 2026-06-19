# Guide de Setup Local

Ce guide permet à un développeur de lancer GW2 Nexus en développement local en moins de 10 minutes.

## Prérequis

| Outil | Version minimale | Vérification |
|---|---|---|
| Docker Desktop | 24.0+ | `docker --version` |
| Docker Compose | 2.20+ | `docker compose version` |
| Git | 2.40+ | `git --version` |

> Docker Compose V2 est requis (syntaxe `docker compose`, pas `docker-compose`).

---

## 1. Cloner le repository

```bash
git clone <URL_DU_REPO>
cd GW2Nexus
```

---

## 2. Configurer les variables d'environnement

### Fichier racine (Docker Compose)

```bash
cp .env.example .env
```

Contenu par défaut :
```env
DB_DATABASE=gw2nexus
DB_USERNAME=gw2nexus_user
DB_PASSWORD=change_me_dev_password
DB_ROOT_PASSWORD=change_me_root_password
UID=1000
GID=1000
```

### Fichier Backend (Laravel)

```bash
cp backend/.env.example backend/.env
```

Modifier si nécessaire :
```env
APP_KEY=   # Sera généré automatiquement au démarrage
DB_HOST=mysql
DB_DATABASE=gw2nexus
DB_USERNAME=gw2nexus_user
DB_PASSWORD=change_me_dev_password
FRONTEND_URL=http://localhost:5174
```

### Fichier Frontend (Vite)

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5174
VITE_APP_NAME=GW2Nexus
```

> `VITE_API_URL` pointe sur Vite (pas sur Laravel) car le proxy Vite redirige `/api/*` vers Laravel.

---

## 3. Démarrer les conteneurs

### Premier démarrage (build des images)

```bash
docker compose up -d --build
```

Cette commande :
1. Build l'image PHP/Laravel
2. Build l'image Node/React
3. Démarre MySQL, phpMyAdmin, Mailpit
4. Lance `php artisan key:generate` (si APP_KEY vide)
5. Lance `php artisan migrate`
6. Démarre `php artisan serve` (Laravel)
7. Démarre `vite --host` (React)

### Démarrages suivants

```bash
docker compose up -d
```

---

## 4. Vérifier que tout fonctionne

| Service | URL | Description |
|---|---|---|
| **Frontend** | http://localhost:5174 | Application React |
| **Backend** | http://localhost:8000 | API Laravel |
| **Healthcheck** | http://localhost:8000/api/health | `{ "status-backend": "ok" }` |
| **phpMyAdmin** | http://localhost:8081 | Gestion MySQL |
| **Mailpit** | http://localhost:8025 | Capture SMTP |

---

## 5. Commandes utiles

### Logs

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f laravel
docker compose logs -f react
docker compose logs -f mysql
```

### Exécuter des commandes dans les conteneurs

```bash
# Artisan (Laravel)
docker compose exec laravel php artisan migrate
docker compose exec laravel php artisan migrate:fresh --seed
docker compose exec laravel php artisan tinker
docker compose exec laravel php artisan route:list --path=api

# NPM (React)
docker compose exec react npm run lint
docker compose exec react npm run build

# MySQL
docker compose exec mysql mysql -u gw2nexus_user -pgw2nexus gw2nexus
```

### Arrêt et nettoyage

```bash
# Arrêt (données conservées)
docker compose down

# Arrêt + suppression volumes (⚠️ supprime la base de données)
docker compose down -v

# Reset complet (images + volumes)
docker compose down -v --rmi local
```

---

## 6. Créer un compte admin (développement)

```bash
docker compose exec laravel php artisan tinker

# Dans Tinker :
$user = App\Models\User::where('email', 'admin@example.com')->first();
$user->update(['role' => 'admin']);
```

Ou créer directement :
```php
App\Models\User::create([
    'nom' => 'Admin Dev',
    'email' => 'admin@local.dev',
    'password' => 'password123',
    'role' => 'admin',
]);
```

---

## 7. Résolution de problèmes fréquents

### Conteneur MySQL ne démarre pas

```bash
# Vérifier les logs
docker compose logs mysql

# Cause probable : volume MySQL corrompu
docker compose down -v
docker compose up -d --build
```

### Erreur "APP_KEY not set"

```bash
docker compose exec laravel php artisan key:generate
```

### Hot reload React ne fonctionne pas

Vérifier dans `frontend/vite.config.js` que le HMR pointe sur `ws://localhost:5174`.

### Migrations échouent (connexion MySQL refusée)

MySQL met ~15s à démarrer. Le `docker-entrypoint.sh` attend la disponibilité MySQL avant de lancer les migrations.

```bash
# Relancer les migrations manuellement si nécessaire
docker compose exec laravel php artisan migrate
```

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 5174
netstat -ano | findstr :5174   # Windows
lsof -i :5174                   # macOS/Linux
```

Ou modifier les ports dans `docker-compose.yml`.

---

## 8. Structure des ports

| Port Hôte | Port Conteneur | Service |
|---|---|---|
| 5174 | 5174 | Vite / Frontend |
| 8000 | 8000 | Laravel / Backend |
| 3307 | 3306 | MySQL |
| 8081 | 80 | phpMyAdmin |
| 8025 | 8025 | Mailpit UI |
| 1025 | 1025 | Mailpit SMTP |
