# 🚀 GW2Nexus — Guide de déploiement CI/CD

> **Stack :** Laravel 11 · React/Vite · MySQL 8 · Docker · VPS OVH
> **Pipeline :** GitHub Actions → SSH → VPS OVH
> **Dernière mise à jour :** Avril 2026

---

## Architecture cible

```
GitHub (push main)
       │
       ├──► 🧪 JOB 1 — Tests PHPUnit (MySQL éphémère)
       ├──► 🏗️  JOB 2 — Build React/Vite + Lint TypeScript
       │
       │    (JOB 3 attend JOB 1 + JOB 2 — bloqué si l'un échoue)
       │
       └──► 🖥️  JOB 3 — Déploiement SSH → VPS OVH
                   │
                   ├── git pull origin main
                   ├── docker compose build
                   ├── docker compose up -d --force-recreate
                   └── Attente healthcheck Laravel (migrations + cache)
```

```
Internet
   │
   ▼ :80
[ Nginx — Reverse Proxy ]
   │
   ├── /api/*  ──► [ Laravel :8000 ]
   │                     │
   │               [ MySQL :3306 ] (interne uniquement)
   │
   └── /*      ──► [ React/Nginx — statique ]

[ phpMyAdmin ] ──► 127.0.0.1:8080 (SSH tunnel uniquement)
```

---

## Prérequis

- VPS OVH commandé (Ubuntu 24.04 LTS) — voir section **Provisionnement VPS**
- Accès SSH au VPS avec clé SSH
- Repo GitHub avec les secrets configurés — voir section **GitHub Secrets**
- Fichier `.env.prod` créé manuellement sur le VPS — voir section **Variables d'environnement**

---

## Structure du repo

```
gw2nexus/
├── .github/
│   └── workflows/
│       ├── deploy.yml              ← Pipeline CI/CD principal
│       └── DEPLOY-INSTRUCTIONS.md ← Ce fichier
├── backend/                        ← Laravel 11
│   ├── Dockerfile                  ← Image dev ET prod (même base)
│   ├── docker-entrypoint.sh        ← Entrypoint DEV (config:clear)
│   ├── docker-entrypoint.prod.sh   ← Entrypoint PROD (config:cache)
│   ├── .env.example                ← Template dev (commité)
│   ├── .env.testing                ← Config tests sans secrets (commité)
│   └── .env.testing.ci             ← Config CI GitHub Actions (commité)
├── frontend/                       ← React 18 / TypeScript / Vite
│   ├── Dockerfile                  ← Dev server Vite + HMR
│   ├── Dockerfile.prod             ← Multi-stage : build Vite → Nginx statique
│   └── .env.example                ← Template dev (commité)
├── docker/
│   └── nginx/
│       ├── default.conf            ← Config Nginx DEV
│       └── prod.conf               ← Config Nginx PROD (reverse proxy)
├── scripts/
│   └── deploy.sh                   ← Script exécuté sur le VPS par GitHub Actions
├── docker-compose.yml              ← Stack locale (dev)
├── docker-compose.override.yml     ← Surcharges dev (extra_hosts)
├── docker-compose.prod.yml         ← Stack production (VPS OVH)
├── .env.example                    ← Template variables Docker Compose (commité)
└── .env.prod.example               ← Template variables production (commité)
```

---

## Étape 1 — Provisionnement du VPS OVH

### 1.1 Commander le VPS

1. Va sur https://www.ovhcloud.com/fr/vps/
2. Choisis **VPS-1** (4 vCores / 8 Go RAM / 75 Go SSD) — ~6€/mois
3. OS : **Ubuntu 24.04 LTS**
4. Région : Gravelines ou Roubaix (latence Europe optimale)
5. Ajoute ta clé SSH publique lors de la commande

### 1.2 Première connexion et sécurisation

```bash
# Connexion initiale en root
ssh root@TON_IP_VPS

# Mise à jour du système
apt update && apt upgrade -y

# Création d'un utilisateur dédié (ne jamais rester en root)
adduser deploy
usermod -aG sudo deploy

# Copie de la clé SSH vers le nouvel utilisateur
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# ⚠️ Tester la connexion dans un AUTRE terminal avant de continuer
# ssh deploy@TON_IP_VPS

# Désactiver la connexion root par SSH
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 1.3 Installation de Docker

```bash
# Se connecter en tant que deploy
ssh deploy@TON_IP_VPS

# Installation via le script officiel Docker
curl -fsSL https://get.docker.com | sudo sh

# Ajouter deploy au groupe docker (évite sudo à chaque commande)
sudo usermod -aG docker deploy

# Se déconnecter et reconnecter pour appliquer le groupe
exit && ssh deploy@TON_IP_VPS

# Vérification
docker --version
docker compose version
```

### 1.4 Cloner le repo sur le VPS

```bash
# Créer le répertoire de l'application
sudo mkdir -p /var/www/gw2nexus
sudo chown deploy:deploy /var/www/gw2nexus

# Cloner le repo
cd /var/www/gw2nexus
git clone https://github.com/TON_USERNAME/gw2nexus.git .

# Rendre les scripts exécutables
chmod +x backend/docker-entrypoint.prod.sh
chmod +x scripts/deploy.sh
```

---

## Étape 2 — Variables d'environnement production

Le fichier `.env.prod` contient tous les secrets de production.
**Il ne doit jamais être commité sur GitHub** (vérifié dans `.gitignore`).

### 2.1 Créer le fichier sur le VPS

```bash
cd /var/www/gw2nexus
cp .env.prod.example .env.prod
nano .env.prod
```

### 2.2 Générer l'APP_KEY Laravel

```bash
# Générer une clé proprement sans lancer tout le stack
docker run --rm php:8.3-cli php -r \
  "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"

# Copier la valeur générée dans APP_KEY du .env.prod
```

### 2.3 Variables obligatoires à remplir

```env
APP_KEY=base64:VALEUR_GENEREE_CI_DESSUS
APP_URL=http://TON_IP_VPS

DB_PASSWORD=MOT_DE_PASSE_FORT_20_CARACTERES_MIN
MYSQL_PASSWORD=IDENTIQUE_A_DB_PASSWORD
MYSQL_ROOT_PASSWORD=AUTRE_MOT_DE_PASSE_FORT

MAIL_HOST=smtp.ton-provider.com
MAIL_USERNAME=contact@gw2nexus.fr
MAIL_PASSWORD=MOT_DE_PASSE_SMTP

SESSION_DOMAIN=TON_IP_VPS
SANCTUM_STATEFUL_DOMAINS=TON_IP_VPS
FRONTEND_URL=http://TON_IP_VPS
```

---

## Étape 3 — GitHub Secrets

Dans ton repo GitHub → **Settings** → **Secrets and variables** → **Actions**

| Secret | Valeur | Comment l'obtenir |
|---|---|---|
| `VPS_HOST` | `51.178.xx.xx` | L'IP de ton VPS OVH |
| `VPS_USER` | `deploy` | L'utilisateur créé à l'étape 1.2 |
| `VPS_SSH_KEY` | `-----BEGIN OPENSSH...` | Ta clé SSH **privée** locale |

### Récupérer la clé SSH privée

```bash
# Sur ta machine locale (pas le VPS)
cat ~/.ssh/id_ed25519

# Copier TOUT le contenu (de -----BEGIN à -----END inclus)
# Coller dans le secret VPS_SSH_KEY sur GitHub
```

---

## Étape 4 — Premier déploiement manuel

Avant de laisser la CI/CD tourner seule, valide que tout fonctionne manuellement.

```bash
# Sur le VPS
cd /var/www/gw2nexus

# Lancer le déploiement
bash scripts/deploy.sh

# Vérifier que tous les services sont Up
docker compose -f docker-compose.prod.yml ps

# Tester l'API Laravel
curl http://localhost/api/health
# Réponse attendue : {"status-backend":"ok"}

# Tester le frontend React
curl -s -o /dev/null -w "%{http_code}" http://localhost/
# Réponse attendue : 200
```

---

## Étape 5 — Validation du pipeline CI/CD

Une fois le premier déploiement manuel validé, le pipeline se déclenche automatiquement.

```bash
# Sur ta machine locale — déclencher le pipeline
git commit --allow-empty -m "test: validation pipeline CI/CD"
git push origin main

# Suivre l'exécution sur GitHub
# https://github.com/TON_USERNAME/gw2nexus/actions
```

### Ce que fait le pipeline à chaque push sur main

```
JOB 1 — Tests PHPUnit
  ├── MySQL éphémère lancé (service GitHub Actions)
  ├── composer install
  ├── cp .env.testing.ci .env && php artisan key:generate
  ├── php artisan migrate --force
  └── php artisan test --parallel

JOB 2 — Build Frontend (en parallèle avec JOB 1)
  ├── npm ci
  ├── npm run lint
  └── npm run build (VITE_API_URL="")

JOB 3 — Déploiement VPS (si JOB 1 ET JOB 2 passent)
  └── SSH → bash /var/www/gw2nexus/scripts/deploy.sh
        ├── git pull origin main
        ├── docker compose -f docker-compose.prod.yml build
        ├── docker compose -f docker-compose.prod.yml up -d --force-recreate
        └── Attente healthcheck Laravel (90s max)
              ├── MySQL ready
              ├── php artisan migrate --force
              ├── php artisan config:cache
              ├── php artisan route:cache
              └── php artisan view:cache
```

> ✅ Si JOB 1 ou JOB 2 échouent → JOB 3 est bloqué, rien n'est déployé
> ✅ Un commit cassé en prod est impossible si les tests passent en CI

---

## Accès phpMyAdmin (SSH Tunnel)

phpMyAdmin n'est jamais exposé publiquement (lié à `127.0.0.1:8080`).
Pour y accéder depuis ton navigateur local :

```bash
# Ouvrir le tunnel SSH (laisser ce terminal ouvert)
ssh -L 8080:localhost:8080 deploy@TON_IP_VPS -N

# Ouvrir dans le navigateur
http://localhost:8080

# Identifiants : root / MYSQL_ROOT_PASSWORD (défini dans .env.prod)
```

---

## Accès MySQL via DBeaver (SSH Tunnel)

```bash
# Ouvrir le tunnel SSH sur le port MySQL
ssh -L 3307:localhost:3306 deploy@TON_IP_VPS -N

# Dans DBeaver :
# Host     : 127.0.0.1
# Port     : 3307
# Database : gw2nexus
# User     : gw2nexus_user
# Password : DB_PASSWORD du .env.prod
```

---

## Commandes utiles sur le VPS

```bash
# Alias pratique (à ajouter dans ~/.bashrc sur le VPS)
alias dc="docker compose -f /var/www/gw2nexus/docker-compose.prod.yml"

# Voir l'état des services
dc ps

# Logs en temps réel
dc logs -f
dc logs -f laravel
dc logs -f nginx

# Redémarrer un service sans rebuild
dc restart laravel

# Lancer une commande Artisan
dc exec laravel php artisan tinker
dc exec laravel php artisan migrate:status

# Rebuild forcé d'un seul service (si image corrompue)
dc build --no-cache laravel
dc up -d --force-recreate laravel
```

---

## Rollback d'urgence

```bash
# Sur le VPS — revenir au commit précédent
cd /var/www/gw2nexus
git log --oneline -5             # Identifier le commit cible
git checkout HASH_DU_COMMIT
bash scripts/deploy.sh           # Redéployer

# Revenir sur main après correction
git checkout main
git pull origin main
bash scripts/deploy.sh
```

---

## Coûts

| Service | Offre | Coût |
|---|---|---|
| VPS OVH VPS-1 | 4 vCores / 8 Go RAM | ~6€ HT/mois |
| Domaine .fr (optionnel) | — | ~7€/an |
| SSL Let's Encrypt (optionnel) | — | Gratuit |
| GitHub Actions | Free (dépôt public) | Gratuit |
| **Total** | | **~6€/mois** |

---

## Prochaine étape — Domaine + SSL

Quand tu auras un nom de domaine, deux modifications à faire :

**1. Mettre à jour `docker/nginx/prod.conf`** — remplacer `server_name _;` par `server_name gw2nexus.fr www.gw2nexus.fr;`

**2. Mettre à jour `.env.prod`** — remplacer toutes les occurrences de `TON_IP_VPS` par le domaine

**3. Ajouter Certbot pour Let's Encrypt** — un conteneur supplémentaire dans `docker-compose.prod.yml`

```bash
# Installation manuelle rapide (hors Docker)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d gw2nexus.fr -d www.gw2nexus.fr
```