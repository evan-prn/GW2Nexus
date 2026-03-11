# GW2Nexus

> Généré par create-fullstack-app

## Démarrage rapide

```bash
cd GW2Nexus
docker compose up -d --build
```

| Service     | URL                             |
|-------------|---------------------------------|
| React App   | http://localhost:5173           |
| Laravel API | http://localhost:8000/api/hello |
| Mailpit UI<div align="center">

# ⚔️ GW2Nexus

**Hub communautaire pour Guild Wars 2**

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

*Forum · Profils joueurs · Guildes · Builds · Intégration API GW2*

</div>

---

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [API](#-api)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Équipe](#-équipe)
- [Roadmap](#-roadmap)

---

## 🗡️ À propos

GW2Nexus est une application web communautaire moderne dédiée au MMORPG **Guild Wars 2**. Elle centralise les besoins des joueurs en combinant un forum de discussion, des profils joueurs enrichis par l'API officielle du jeu, un système de builds, et la gestion de guildes.

Le projet est développé par une équipe de 2 développeurs en méthodologie **Agile Scrum**, sur une durée de **3 mois** (6 sprints de 2 semaines). L'objectif est de livrer un MVP fonctionnel et déployé en production sur VPS.

> **Statut du projet :** 🚧 En développement — Sprint 1 en cours

---

## ✨ Fonctionnalités

### 🔐 Authentification & Profils
- Inscription / connexion sécurisée (Laravel Sanctum)
- Profil utilisateur personnalisable (avatar, bio)
- Connexion à un compte Guild Wars 2 via **clé API officielle**
- Affichage des données de jeu : nom de compte, serveur, personnages

### 💬 Forum communautaire
- Catégories hiérarchiques de discussion
- Création et gestion de sujets (rich text via TipTap)
- Commentaires avec système de solution acceptée
- Épinglage de discussions, recherche full-text
- Système de tags thématiques (Fractales, Raid, WvW...)

### 🎯 Intégration API Guild Wars 2
- Recherche d'objets avec icônes, statistiques et rareté
- Discussions liables à des objets/événements du jeu
- Timer des world boss events en temps réel
- Cache intelligent pour limiter les appels à l'API externe

### ⚔️ Système de Builds
- Création de builds (profession, compétences, traits, équipement)
- Partage public ou brouillon privé
- Commentaires et likes communautaires
- Galerie filtrée par profession et mode de jeu (PvE / PvP / WvW)

### 🛡️ Guildes
- Pages de guilde avec import depuis l'API GW2
- Gestion des membres et des rôles (leader / officier / membre)
- Discussions internes de guilde

### 🛠️ Administration
- Rôles : utilisateur / modérateur / admin
- Signalement et modération de contenu
- Soft delete sur les entités critiques

---

## 🧰 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| **Backend** | Laravel | 11.x |
| **Auth** | Laravel Sanctum | — |
| **Frontend** | React + TypeScript | 18.x / 5.x |
| **Build tool** | Vite | — |
| **Styling** | TailwindCSS | 3.x |
| **Éditeur rich text** | TipTap | — |
| **État global** | Zustand | — |
| **Cache API** | React Query (TanStack) | — |
| **Base de données** | MySQL | 8.0 |
| **Cache serveur** | Redis | — |
| **Conteneurisation** | Docker + Docker Compose | — |
| **CI/CD** | GitHub Actions | — |
| **Serveur** | Nginx + PHP-FPM | — |
| **SSL** | Let's Encrypt | — |

---

## 🏛️ Architecture

GW2Nexus suit une architecture **API REST + Frontend découplé** :

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENT                            │
│              React + TypeScript (Vite)                  │
│         TailwindCSS · Zustand · React Query             │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / JSON
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND API (Laravel 11)                │
│         Routes /api/v1/ · Sanctum Auth · Policies       │
│         Services · Form Requests · Jobs & Queues        │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌───────────────────────────────┐
│   MySQL 8.0      │      │   API Guild Wars 2 (externe)  │
│   12 tables      │      │   api.guildwars2.com/v2/       │
│   Redis cache    │      │   Cache JSON · TTL             │
└──────────────────┘      └───────────────────────────────┘
```

### Principes appliqués

- **SOLID** — Controllers légers, Services métiers isolés
- **Clean Architecture** — Séparation stricte des couches
- **DRY / KISS** — Pas de duplication, solutions simples et maintenables
- **API versionnée** — Préfixe `/api/v1/` sur toutes les routes
- **Repository pattern** — Pour les entités complexes
- **Cache stratégique** — Données API GW2 mises en cache Redis

---

## 📦 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 4.x
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.x
- [Git](https://git-scm.com/) ≥ 2.x
- [Node.js](https://nodejs.org/) ≥ 20 LTS *(pour le développement frontend local)*

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-org/gw2nexus.git
cd gw2nexus
```

### 2. Copier les fichiers d'environnement

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Démarrer les conteneurs Docker

```bash
docker compose up -d
```

Les services suivants démarrent automatiquement :

| Service | URL | Description |
|---|---|---|
| **Application** | http://localhost:8000 | Backend Laravel |
| **Frontend** | http://localhost:5173 | React + Vite |
| **phpMyAdmin** | http://localhost:8080 | Interface BDD |
| **Mailpit** | http://localhost:8025 | Capture d'emails |
| **MySQL** | localhost:3306 | Base de données |

### 4. Initialiser le backend Laravel

```bash
# Entrer dans le conteneur PHP
docker compose exec app bash

# Installer les dépendances
composer install

# Générer la clé applicative
php artisan key:generate

# Exécuter les migrations
php artisan migrate

# Peupler la base (données de test)
php artisan db:seed

# Créer le lien symbolique storage
php artisan storage:link
```

### 5. Initialiser le frontend React

```bash
# Entrer dans le conteneur Node
docker compose exec node bash

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

---

## ⚙️ Configuration

### Variables d'environnement backend (`backend/.env`)

```env
APP_NAME=GW2Nexus
APP_ENV=local
APP_KEY=           # Généré automatiquement
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=gw2nexus
DB_USERNAME=gw2nexus
DB_PASSWORD=secret

# Cache & Queues
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis

# Mail (Mailpit en dev)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025

# Clé de chiffrement API GW2
GW2_API_ENCRYPTION_KEY=  # Clé AES-256 pour chiffrer les clés API utilisateurs
```

### Variables d'environnement frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=GW2Nexus
```

---

## 💻 Utilisation

### Commandes Docker courantes

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Voir les logs
docker compose logs -f

# Exécuter une commande Artisan
docker compose exec app php artisan <commande>

# Exécuter les tests
docker compose exec app php artisan test
```

### Commandes Artisan utiles

```bash
# Synchroniser le cache des items GW2
php artisan gw2:sync-items

# Vider le cache
php artisan cache:clear

# Lister les routes
php artisan route:list --path=api
```

---

## 📁 Structure du projet

```
gw2nexus/
├── backend/                        # Application Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/V1/
│   │   │   │   │   ├── Auth/       # RegisterController, LoginController...
│   │   │   │   │   ├── Forum/      # CategoryController, ThreadController...
│   │   │   │   │   ├── Gw2/        # ItemController, GuildController...
│   │   │   │   │   ├── Profile/    # UserProfileController
│   │   │   │   │   └── Build/      # BuildController
│   │   │   ├── Requests/           # Form Requests (validation)
│   │   │   └── Middleware/
│   │   ├── Models/                 # Modèles Eloquent
│   │   ├── Services/               # Logique métier
│   │   │   ├── Gw2ApiService.php   # Client API Guild Wars 2
│   │   │   └── ...
│   │   ├── Policies/               # Autorisations
│   │   └── Jobs/                   # Tâches asynchrones
│   ├── database/
│   │   ├── migrations/             # 12 tables définies
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php                 # Routes /api/v1/
│   └── tests/
│
├── frontend/                       # Application React
│   ├── src/
│   │   ├── features/               # Architecture par fonctionnalité
│   │   │   ├── auth/
│   │   │   ├── forum/
│   │   │   ├── gw2/
│   │   │   ├── builds/
│   │   │   └── guilds/
│   │   ├── components/             # Composants partagés
│   │   ├── hooks/                  # Hooks React personnalisés
│   │   ├── services/               # Appels API (Axios)
│   │   ├── store/                  # État global (Zustand)
│   │   └── types/                  # Types TypeScript
│   └── vite.config.ts
│
├── docker/                         # Configuration Docker
│   ├── php/
│   ├── nginx/
│   └── node/
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Base de données

GW2Nexus utilise un schéma MySQL normalisé **(3NF)** composé de **12 tables** :

| Table | Description |
|---|---|
| `utilisateurs` | Comptes utilisateurs, rôles, clé API chiffrée |
| `profils_gw2` | Données compte Guild Wars 2 synchronisées |
| `categories` | Catégories du forum (hiérarchiques) |
| `discussions` | Sujets du forum |
| `commentaires` | Réponses aux discussions |
| `guildes` | Pages de guildes GW2 |
| `membres_guilde` | Table pivot : membres et rôles |
| `builds` | Builds de personnages partagés |
| `commentaires_build` | Commentaires sur les builds |
| `items_gw2` | Cache des données items API GW2 |
| `tags` | Tags thématiques des discussions |
| `discussion_tag` | Table pivot : tags ↔ discussions |

> 📄 La modélisation complète (MCD, MLD, dictionnaire de données) est disponible dans `docs/GW2Nexus_BDD.docx`.

### Conventions

- **Clés primaires** : `BIGINT UNSIGNED AUTO_INCREMENT`
- **Soft deletes** : colonne `deleted_at` sur les entités sensibles
- **Clés API** : chiffrées en AES-256 via `encrypt()` Laravel
- **Données GW2** : stockées en `JSON` pour flexibilité

---

## 🔌 API

Toutes les routes sont préfixées par `/api/v1/`.

### Authentification

```
POST   /api/v1/auth/register        Inscription
POST   /api/v1/auth/login           Connexion
POST   /api/v1/auth/logout          Déconnexion
```

### Profil utilisateur

```
GET    /api/v1/profile              Récupérer son profil
PUT    /api/v1/profile              Mettre à jour son profil
POST   /api/v1/profile/api-key      Ajouter / valider sa clé API GW2
GET    /api/v1/profile/gw2-data     Récupérer ses données GW2
```

### Forum

```
GET    /api/v1/categories           Liste des catégories
GET    /api/v1/discussions          Liste des discussions
POST   /api/v1/discussions          Créer une discussion
GET    /api/v1/discussions/{id}     Détail d'une discussion
PUT    /api/v1/discussions/{id}     Modifier une discussion
DELETE /api/v1/discussions/{id}     Supprimer une discussion
POST   /api/v1/discussions/{id}/commentaires   Commenter
```

### API Guild Wars 2

```
GET    /api/v1/gw2/items/{id}       Détail d'un item
GET    /api/v1/gw2/items/search     Recherche d'items
GET    /api/v1/gw2/events           World boss events
```

### Builds

```
GET    /api/v1/builds               Liste des builds publics
POST   /api/v1/builds               Créer un build
GET    /api/v1/builds/{id}          Détail d'un build
PUT    /api/v1/builds/{id}          Modifier un build
DELETE /api/v1/builds/{id}          Supprimer un build
```

### Guildes

```
GET    /api/v1/guildes              Liste des guildes
POST   /api/v1/guildes              Créer / importer une guilde
GET    /api/v1/guildes/{id}         Page d'une guilde
```

---

## 🧪 Tests

```bash
# Lancer tous les tests
docker compose exec app php artisan test

# Tests avec couverture de code
docker compose exec app php artisan test --coverage

# Tests E2E (Playwright)
cd frontend && npx playwright test
```

### Stratégie de tests

| Type | Outil | Couverture cible |
|---|---|---|
| Unitaires | PHPUnit | ≥ 70% |
| Intégration API | PHPUnit / HTTP Tests | Endpoints critiques |
| E2E | Playwright | Parcours auth, forum, profil |
| Charge | — | Forum avec 100+ discussions |

---

## 🚢 Déploiement

### Environnement de production (VPS)

```
Ubuntu Server 22.04 LTS
Nginx (reverse proxy)
PHP 8.3 + PHP-FPM
MySQL 8.0
Redis
SSL Let's Encrypt (Certbot)
```

### Déploiement via GitHub Actions

Le pipeline CI/CD se déclenche automatiquement :

- **Push sur une branche feature** → lint + tests unitaires
- **Merge sur `develop`** → build frontend + tests d'intégration
- **Merge sur `main`** → déploiement automatique en production

### Stratégie de branches Git

```
main          → Production (protégée, déploiement auto)
develop       → Intégration (merge des features)
feature/us-XX → Développement (1 branche par User Story)
```

---

## 👥 Équipe

| Rôle | Responsabilités principales |
|---|---|
| **Dev 1** | Frontend React/TypeScript, CI/CD, infrastructure Docker, déploiement VPS |
| **Dev 2** | Backend Laravel, API GW2, base de données, tests |

---

## 🗓️ Roadmap

Le projet est divisé en **6 sprints de 2 semaines** :

| Sprint | Période | Thème | Statut |
|---|---|---|---|
| **Sprint 1** | Sem. 1–2 | Fondations & Authentification | 🚧 En cours |
| **Sprint 2** | Sem. 3–4 | Profils Utilisateurs & API GW2 | ⏳ À venir |
| **Sprint 3** | Sem. 5–6 | Forum Communautaire — Core | ⏳ À venir |
| **Sprint 4** | Sem. 7–8 | Forum Avancé & Intégration API GW2 | ⏳ À venir |
| **Sprint 5** | Sem. 9–10 | Guildes & Système de Builds | ⏳ À venir |
| **Sprint 6** | Sem. 11–12 | Tests, Optimisations & Déploiement VPS | ⏳ À venir |

> 📄 Le planning complet (Scrum + Gantt) est disponible dans `docs/`.

---

## 📄 Licence

Ce projet est développé dans un cadre académique / personnel. Tous droits réservés.

*Guild Wars 2 est une marque déposée d'ArenaNet. GW2Nexus n'est pas affilié à ArenaNet ou NCSoft.*

---

<div align="center">

**⚔️ GW2Nexus** — *Forgé par et pour la communauté Guild Wars 2*

</div>  | http://localhost:8025           |
```
