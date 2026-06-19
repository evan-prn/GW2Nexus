<div align="center">

# ⚔️ GW2 Nexus

**La plateforme communautaire ultime pour les joueurs de Guild Wars 2**

*Suivez vos events · Gérez votre compte · Rejoignez la communauté*

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=flat-square&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 📋 Table des matières

- [✨ Présentation](#-présentation)
- [🎯 Fonctionnalités](#-fonctionnalités)
- [📸 Aperçu](#-aperçu)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Stack technique](#️-stack-technique)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribution](#-contribution)
- [🔗 Liens utiles](#-liens-utiles)

---

## ✨ Présentation

GW2 Nexus est une plateforme web communautaire dédiée aux joueurs de **Guild Wars 2**. Elle regroupe en un seul endroit ce que les joueurs cherchent au quotidien : les timers d'events en direct, la gestion de compte via l'API officielle ArenaNet, et un espace d'échange communautaire.

> **Fini de jongler entre le wiki, les tableurs et Discord.** GW2 Nexus centralise tout.

---

## 🎯 Fonctionnalités

### 🗓️ Timers d'événements en direct

Consultez en temps réel le calendrier des **World Bosses GW2** avec des comptes à rebours synchronisés sur l'heure UTC officielle. Si votre compte est lié, visualisez instantanément quels boss vous avez déjà vaincus aujourd'hui.

### ⚔️ Profil et compte GW2

Connectez votre **clé API Guild Wars 2** pour synchroniser automatiquement :
- Nom de compte et serveur
- Liste complète de vos personnages (race, profession, niveau)
- Statut journalier des World Bosses

Votre clé API est **chiffrée en AES-256** et ne quitte jamais le serveur.

### 💬 Forum communautaire

Échangez avec d'autres joueurs dans un forum organisé par catégories :
- Création de sujets et réponses
- Signalement de contenus inappropriés
- Modération avec verrouillage et épinglage de sujets

### 🛡️ Administration complète

Interface back-office pour les administrateurs :
- Gestion des utilisateurs et des rôles
- Système de sanctions temporaires ou permanentes
- Traitement des signalements du forum
- Statistiques globales de la plateforme

---

## 📸 Aperçu

| Page | Description |
|---|---|
| 🏠 Accueil | Présentation de la plateforme |
| ⏱️ World Boss | Timers en direct + statut personnalisé |
| 👤 Profil | Données GW2 synchronisées |
| 💬 Forum | Discussions communautaires |
| 🛡️ Admin | Back-office modération |

---

## 🚀 Démarrage rapide

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 24.0+
- [Git](https://git-scm.com/) 2.40+

### Installation

```bash
# 1. Cloner le repository
git clone <URL_DU_REPO>
cd GW2Nexus

# 2. Configurer les environnements
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Démarrer tous les services
docker compose up -d --build
```

### Accès aux services

| Service | URL | Description |
|---|---|---|
| 🌐 Application | http://localhost:5174 | Interface React |
| 🔌 API Backend | http://localhost:8000 | Laravel REST API |
| 🗄️ phpMyAdmin | http://localhost:8081 | Gestion base de données |
| 📧 Mailpit | http://localhost:8025 | Emails de développement |

> Guide complet → [docs/devops/setup-local.md](docs/devops/setup-local.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 🌐 Navigateur                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│           ⚡ Frontend — React 19 SPA                 │
│         Vite · TypeScript · Tailwind CSS             │
│      Zustand (state) · TanStack Query (cache)        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/JSON — Bearer Token
                       ▼
┌─────────────────────────────────────────────────────┐
│           🔧 Backend — Laravel 12 API                │
│        Sanctum · Eloquent · Form Requests            │
│          Rate Limiting · Cache · Queue               │
└────────────┬────────────────────────┬───────────────┘
             │ PDO                    │ HTTP
             ▼                        ▼
    ┌─────────────────┐    ┌─────────────────────────┐
    │ 🗄️ MySQL 8.0    │    │ 🎮 API ArenaNet GW2     │
    │  10 tables      │    │  Cache 5 min · Fallback  │
    └─────────────────┘    └─────────────────────────┘
```

L'API ArenaNet n'est **jamais appelée depuis le navigateur**. Toutes les requêtes transitent par le backend avec un cache de 5 minutes.

---

## 🛠️ Stack technique

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 19.2 | UI library |
| TypeScript | 5.8 | Typage statique |
| Vite | 7.x | Build tool + Dev server |
| Tailwind CSS | 4.x | Styles utilitaires |
| React Router | 7.x | Routing SPA |
| Zustand | 5.x | State management |
| TanStack Query | 5.x | Cache & fetching |
| Axios | 1.x | Client HTTP |

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| Laravel | 12.x | Framework PHP |
| PHP | 8.4+ | Langage |
| Laravel Sanctum | 4.3 | Auth Bearer Token |
| MySQL | 8.0 | Base de données |
| PHPUnit | 11.x | Tests |

### Infrastructure
| Service | Image | Port |
|---|---|---|
| Laravel API | php:8.4-cli | :8000 |
| React SPA | node:20-alpine | :5174 |
| MySQL | mysql:8.0 | :3307 |
| phpMyAdmin | phpmyadmin:5.2 | :8081 |
| Mailpit | axllent/mailpit | :8025 |

---

## 🗺️ Roadmap

### ✅ Disponible

- 🔐 Authentification complète (inscription, connexion, reset password)
- 👤 Profil utilisateur avec synchronisation API GW2
- ⏱️ Timers World Boss en temps réel
- 💬 Forum communautaire (catégories, threads, posts, signalements)
- 🛡️ Interface d'administration (gestion users, bans, modération)
- 🔒 Système de rôles (user / modérateur / admin)

### 🔜 Prochainement

- ✉️ Pipeline CI/CD (GitHub Actions)
- 🧪 Tests frontend (Vitest + Testing Library)
- 📊 Dashboard analytique amélioré

### 🔭 Vision future

- 🏰 Gestion de guilde (roster, rangs, recrutement)
- 🏆 Suivi des achievements
- ⚗️ Calculateur de crafting
- 📱 Application mobile (PWA)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Avant de commencer :

1. 📖 Lire la [documentation technique complète](docs/README.md)
2. 🏗️ Consulter les [décisions d'architecture](docs/architecture/decisions-techniques.md)
3. 🔒 Respecter les [règles de sécurité](docs/security/overview.md)
4. 📝 Toute modification de code doit s'accompagner d'une mise à jour documentaire

---

## 🔗 Liens utiles

| Ressource | Lien |
|---|---|
| 📚 Documentation complète | [docs/README.md](docs/README.md) |
| 🏗️ Architecture globale | [docs/architecture/architecture-globale.md](docs/architecture/architecture-globale.md) |
| 🔌 API REST | [docs/api/overview.md](docs/api/overview.md) |
| 🛠️ Setup local | [docs/devops/setup-local.md](docs/devops/setup-local.md) |
| 🎮 Intégration GW2 | [docs/game/gw2-api.md](docs/game/gw2-api.md) |
| 🔐 Sécurité | [docs/security/overview.md](docs/security/overview.md) |
| 📊 Base de données | [docs/database/schema.md](docs/database/schema.md) |
| 🎮 API ArenaNet | https://wiki.guildwars2.com/wiki/API:Main |

---

<div align="center">

*Fait avec ❤️ par la communauté GW2 Nexus*

**⚔️ Que Tyrie soit avec vous ⚔️**

</div>
