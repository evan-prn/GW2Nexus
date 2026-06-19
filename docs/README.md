# GW2 Nexus — Documentation

Centre de documentation du projet GW2 Nexus. Application web communautaire dédiée à Guild Wars 2.

## Navigation rapide

| Domaine | Description | Lien |
|---|---|---|
| **Produit** | Vision, objectifs, fonctionnalités | [product/](product/) |
| **Architecture** | Vue d'ensemble, décisions, diagrammes, roadmap | [architecture/](architecture/) |
| **Backend** | Laravel, services, authentification, middlewares | [backend/](backend/) |
| **Frontend** | React, routing, state, composants, API client | [frontend/](frontend/) |
| **API REST** | Endpoints, payloads, réponses, codes d'erreur | [api/](api/) |
| **Base de données** | Schéma complet, migrations, indexation | [database/](database/) |
| **Sécurité** | Auth, chiffrement, rate limiting, checklist prod | [security/](security/) |
| **DevOps** | Setup local, Docker, variables d'environnement | [devops/](devops/) |
| **Tests** | Stratégie, backend PHPUnit, roadmap Vitest | [testing/](testing/) |
| **GW2 / Métier** | API ArenaNet, synchronisation, world bosses | [game/](game/) |
| **Opérations** | Runbook, incidents courants | [operations/](operations/) |
| **Forum** | Architecture et API détaillée du module forum | [forum/](forum/) |

---

## Archives historiques

Les dossiers suivants contiennent des documents de la phase de stabilisation initiale (2026-06-02). Ils sont conservés comme audit trail et ne doivent pas être supprimés.

| Dossier | Contenu |
|---|---|
| [audit/](audit/) | Rapport d'audit initial, plan de corrections, changelog, décisions techniques de stabilisation |

Ces documents décrivent l'état du projet **avant** les corrections de stabilisation. Pour les décisions d'architecture actuelles, voir [architecture/decisions-techniques.md](architecture/decisions-techniques.md).

---

## Stack technique

```
Frontend  : React 19 · TypeScript 5.8 · Vite 7 · Tailwind CSS 4 · Zustand · React Query
Backend   : Laravel 12 · PHP 8.4 · Laravel Sanctum 4.3
Base de données : MySQL 8.0
Infrastructure : Docker Compose · phpMyAdmin · Mailpit
```

## Démarrage rapide

```bash
# Copier les fichiers d'environnement
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Démarrer les services
docker compose up -d --build

# Accès
Frontend  : http://localhost:5174
Backend   : http://localhost:8000
phpMyAdmin: http://localhost:8081
Mailpit   : http://localhost:8025
```

Guide complet → [devops/setup-local.md](devops/setup-local.md)

---

## Index des documents

### Architecture

| Document | Description |
|---|---|
| [architecture/architecture-globale.md](architecture/architecture-globale.md) | Vue d'ensemble du système et flux de requêtes |
| [architecture/diagrammes.md](architecture/diagrammes.md) | Diagrammes C4, ERD, séquences (Mermaid) |
| [architecture/decisions-techniques.md](architecture/decisions-techniques.md) | ADR — Architecture Decision Records |
| [architecture/matrice-priorite.md](architecture/matrice-priorite.md) | Classification P0→P3 de tous les documents |
| [architecture/roadmap-documentation.md](architecture/roadmap-documentation.md) | Plan de complétion documentaire |

### Backend

| Document | Description |
|---|---|
| [backend/overview.md](backend/overview.md) | Structure Laravel, middlewares, models, resources |
| [backend/authentification.md](backend/authentification.md) | Flux Sanctum Bearer Token complet |
| [backend/services.md](backend/services.md) | Gw2ApiService, AdminUserService |

### Frontend

| Document | Description |
|---|---|
| [frontend/overview.md](frontend/overview.md) | Structure React, stack, pattern hook→api→ui |
| [frontend/state-management.md](frontend/state-management.md) | Zustand vs TanStack Query — quand utiliser quoi |

### API REST

| Document | Description |
|---|---|
| [api/overview.md](api/overview.md) | Index de tous les endpoints (40+) |
| [api/auth.md](api/auth.md) | Endpoints authentification (7 routes) |
| [api/admin.md](api/admin.md) | Endpoints administration (8 routes) |
| [forum/api.md](forum/api.md) | Endpoints forum détaillés |

### Données et infrastructure

| Document | Description |
|---|---|
| [database/schema.md](database/schema.md) | Schéma complet MySQL (8 tables) |
| [security/overview.md](security/overview.md) | Sécurité, chiffrement, checklist production |
| [devops/setup-local.md](devops/setup-local.md) | Guide onboarding développeur |
| [devops/docker.md](devops/docker.md) | Infrastructure Docker Compose |
| [devops/variables-env.md](devops/variables-env.md) | Référence complète des 35 variables |

### GW2 / Métier

| Document | Description |
|---|---|
| [game/gw2-api.md](game/gw2-api.md) | Intégration API ArenaNet, endpoints utilisés |
| [game/synchronisation.md](game/synchronisation.md) | Flux d'enregistrement et lecture de clé API |
| [game/world-bosses.md](game/world-bosses.md) | Module timers et statut world bosses |

### Tests et opérations

| Document | Description |
|---|---|
| [testing/overview.md](testing/overview.md) | Stratégie tests, PHPUnit, roadmap Vitest |
| [operations/runbook.md](operations/runbook.md) | Opérations courantes, incidents, Tinker |

---

## Statut de la documentation

| Section | Statut |
|---|---|
| Architecture globale | ✅ Complète |
| API REST (auth, admin, forum) | ✅ Complète |
| Base de données | ✅ Complète |
| Backend (overview, auth, services) | ✅ Complète |
| Frontend (overview, state) | ✅ Complète |
| DevOps / Setup | ✅ Complète |
| Sécurité | ✅ Complète |
| GW2 / Métier | ✅ Complète |
| Tests (backend) | ✅ Documenté |
| API (profile, events, contact) | ⚠️ À compléter (P2) |
| Frontend (routing, composants) | ⚠️ À compléter (P2) |
| CI/CD | ❌ À implémenter |
| Monitoring | ❌ À implémenter |

---

*Documentation mise à jour le 2026-06-19*
