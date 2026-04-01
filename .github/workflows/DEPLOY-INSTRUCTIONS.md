# 🚀 GW2Nexus — Guide de déploiement CI/CD complet

## Architecture cible

```
GitHub (push main)
       │
       ├──► 🧪 Tests PHPUnit (MySQL ephémère)
       ├──► 🏗️  Build React/Vite + Lint
       │
       ├──► 🚂 Railway  →  Laravel API + MySQL  (backend)
       └──► ▲  Vercel   →  React/Vite           (frontend)
```

---

## Étape 1 — Préparer Railway (Backend + MySQL)

### 1.1 Créer un compte Railway
1. Va sur https://railway.app
2. Connecte-toi avec **GitHub** (important pour l'intégration)
3. Crée un **New Project**

### 1.2 Créer le service MySQL
1. Dans ton projet Railway → **Add Service** → **Database** → **MySQL**
2. Railway crée automatiquement la base + les variables de connexion
3. Note les variables générées (tu en auras besoin pour Laravel) :
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### 1.3 Créer le service Laravel
1. **Add Service** → **GitHub Repo**
2. Sélectionne ton repo GW2Nexus
3. Configure le **Root Directory** → `backend`
4. Railway détecte automatiquement PHP via `nixpacks.toml`

### 1.4 Variables d'environnement Railway (backend)
Dans le service Laravel → **Variables**, ajoute :

```
APP_NAME=GW2Nexus
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ton-url.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

CACHE_DRIVER=database
SESSION_DRIVER=database
QUEUE_CONNECTION=sync

SANCTUM_STATEFUL_DOMAINS=gw2nexus.vercel.app,localhost
```

> ⚠️ `APP_KEY` sera généré par la pipeline CI/CD via `php artisan key:generate`

### 1.5 Récupérer le RAILWAY_TOKEN
1. Railway → Account Settings → **Tokens**
2. Crée un token nommé `github-actions`
3. Copie-le → tu l'ajouteras dans GitHub Secrets

---

## Étape 2 — Préparer Vercel (Frontend)

### 2.1 Créer un compte Vercel
1. Va sur https://vercel.com
2. Connecte-toi avec **GitHub**

### 2.2 Importer le projet frontend
1. **Add New Project** → importe ton repo GitHub
2. Configure :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

### 2.3 Variables d'environnement Vercel
Dans Project Settings → Environment Variables :

```
VITE_API_URL=https://ton-backend.railway.app
```

### 2.4 Récupérer les identifiants Vercel pour GitHub Actions
Dans ton terminal (avec Vercel CLI installé) :

```bash
npm install -g vercel
vercel login
vercel link   # dans le dossier frontend/
```

Cela crée un fichier `.vercel/project.json` avec :
- `orgId`   → **VERCEL_ORG_ID**
- `projectId` → **VERCEL_PROJECT_ID**

Récupère aussi ton **token** : Vercel → Account → Settings → Tokens

---

## Étape 3 — Configurer les GitHub Secrets

Dans ton repo GitHub → **Settings** → **Secrets and variables** → **Actions**

Ajoute ces secrets :

| Secret | Valeur | Description |
|--------|--------|-------------|
| `RAILWAY_TOKEN` | `xxxx` | Token Railway récupéré à l'étape 1.5 |
| `VERCEL_TOKEN` | `xxxx` | Token Vercel récupéré à l'étape 2.4 |
| `VERCEL_ORG_ID` | `team_xxxx` | orgId du fichier `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_xxxx` | projectId du fichier `.vercel/project.json` |
| `VITE_API_URL` | `https://api.railway.app` | URL de l'API Railway pour le build |

---

## Étape 4 — Structure du repo GitHub

Ton repo doit respecter cette structure :

```
gw2nexus/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← Pipeline CI/CD principal
├── backend/                    ← Projet Laravel
│   ├── app/
│   ├── .env.testing.ci         ← Env pour les tests CI
│   ├── nixpacks.toml           ← Config build Railway
│   ├── Procfile                ← Commande de démarrage
│   └── ...
├── frontend/                   ← Projet React/Vite
│   ├── src/
│   ├── vercel.json             ← Config Vercel
│   └── ...
└── scripts/
    └── health-check.sh         ← Vérification post-deploy
```

---

## Étape 5 — Ajouter le HealthCheck Laravel

Ajoute cette route dans `backend/routes/api.php` :

```php
// Route de santé — utilisée par le CI/CD
Route::get('/v1/health', function () {
    return response()->json([
        'status'  => 'ok',
        'app'     => config('app.name'),
        'env'     => config('app.env'),
        'version' => '1.0.0',
    ]);
});
```

---

## Flux complet — Ce qui se passe sur chaque push main

```
git push origin main
       │
       ▼
GitHub Actions démarre
       │
       ├──[JOB 1] 🧪 Tests PHPUnit
       │    ├── MySQL éphémère lancé
       │    ├── composer install
       │    ├── php artisan migrate
       │    └── php artisan test --parallel
       │
       ├──[JOB 2] 🎨 Build Frontend
       │    ├── npm ci
       │    ├── npm run lint
       │    └── npm run build
       │
       │   (JOB 3 et 4 attendent JOB 1 + JOB 2)
       │
       ├──[JOB 3] 🚂 Deploy Backend → Railway
       │    ├── railway up --service gw2nexus-backend
       │    └── railway run php artisan migrate --force
       │
       └──[JOB 4] ▲ Deploy Frontend → Vercel
            └── vercel deploy --prod
```

> ✅ Si JOB 1 ou JOB 2 échouent → les déploiements sont bloqués
> ✅ Les JOB 3 et 4 tournent en parallèle pour économiser du temps

---

## Coûts estimés

| Service | Plan | Coût |
|---------|------|------|
| **Railway** | Hobby (5$/mois) | ~5$/mois après essai gratuit |
| **Vercel** | Free | Gratuit |
| **GitHub Actions** | Free (public) | Gratuit |
| **Total** | | ~5$/mois |

> 💡 Railway offre **500h gratuites** le premier mois — largement suffisant pour démarrer

---

## Commandes utiles

```bash
# Vérifier le déploiement manuellement
./scripts/health-check.sh https://ton-api.railway.app

# Forcer un redéploiement Railway sans commit
railway redeploy --service gw2nexus-backend

# Voir les logs Railway en temps réel
railway logs --service gw2nexus-backend

# Rollback Vercel vers le déploiement précédent
vercel rollback
```