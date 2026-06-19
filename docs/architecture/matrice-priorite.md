# Matrice de Priorité — Documentation

## Légende

| Priorité | Signification | Délai |
|---|---|---|
| **P0** | Obligatoire immédiatement — bloquant pour l'onboarding | Cette semaine |
| **P1** | Important — référence quotidienne des développeurs | Dans 2 semaines |
| **P2** | Utile — complète la compréhension du projet | Dans 1 mois |
| **P3** | Optionnel — améliore la maintenabilité long terme | Quand disponible |

---

## Tableau complet

| Fichier | Priorité | Statut | Audience | Notes |
|---|---|---|---|---|
| **docs/README.md** | P0 | ✅ Créé | Tous | Index de navigation |
| **docs/devops/setup-local.md** | P0 | ✅ Créé | Devs | Onboarding critique |
| **docs/devops/variables-env.md** | P0 | ✅ Créé | Devs / DevOps | Référence config |
| **docs/api/overview.md** | P0 | ✅ Créé | Devs Frontend | Index endpoints |
| **docs/api/auth.md** | P0 | ✅ Créé | Devs | Auth = cœur du système |
| **docs/architecture/architecture-globale.md** | P0 | ✅ Créé | Tous | Vue d'ensemble |
| **docs/database/schema.md** | P0 | ✅ Créé | Devs Backend | Référence DB |
| **docs/security/overview.md** | P0 | ✅ Créé | Tech Lead / DevOps | Risques produit |
| **docs/backend/overview.md** | P1 | ✅ Créé | Devs Backend | Structure Laravel |
| **docs/backend/authentification.md** | P1 | ✅ Créé | Devs | Détail auth flow |
| **docs/backend/services.md** | P1 | ✅ Créé | Devs Backend | Gw2ApiService etc. |
| **docs/frontend/overview.md** | P1 | ✅ Créé | Devs Frontend | Structure React |
| **docs/frontend/state-management.md** | P1 | ✅ Créé | Devs Frontend | Zustand + TanStack |
| **docs/game/gw2-api.md** | P1 | ✅ Créé | Devs | Intégration ArenaNet |
| **docs/game/synchronisation.md** | P1 | ✅ Créé | Devs | Flux synchro GW2 |
| **docs/game/world-bosses.md** | P1 | ✅ Créé | Devs | Module bosses |
| **docs/testing/overview.md** | P1 | ✅ Créé | Devs | Stratégie tests |
| **docs/api/admin.md** | P1 | ✅ Créé | Devs Backend | API administration |
| **docs/architecture/diagrammes.md** | P1 | ✅ Créé | Tous | Mermaid C4/ERD |
| **docs/architecture/decisions-techniques.md** | P1 | ✅ Créé | Tech Lead | ADR |
| **docs/devops/docker.md** | P1 | ✅ Créé | DevOps / Devs | Infra Docker |
| **docs/operations/runbook.md** | P1 | ✅ Créé | DevOps | Opérations prod |
| **docs/product/vision.md** | P2 | ✅ Créé | Tous | Vision produit |
| **docs/api/profile.md** | P2 | ❌ À créer | Devs Frontend | API profil GW2 |
| **docs/api/events.md** | P2 | ❌ À créer | Devs Frontend | API events |
| **docs/api/contact.md** | P2 | ❌ À créer | Devs | API contact |
| **docs/frontend/routing.md** | P2 | ❌ À créer | Devs Frontend | Routes + protections |
| **docs/frontend/composants.md** | P2 | ❌ À créer | Devs Frontend | Catalogue composants |
| **docs/database/migrations.md** | P2 | ❌ À créer | Devs Backend | Guide migrations |
| **docs/game/limitations.md** | P2 | ❌ À créer | Devs | Limites API GW2 |
| **docs/devops/ci-cd.md** | P2 | ❌ À créer | DevOps | Pipeline (à implémenter) |
| **docs/product/user-stories.md** | P3 | ❌ À créer | PM / Devs | User stories |
| **docs/architecture/performances.md** | P3 | ❌ À créer | Tech Lead | Stratégie perf |
| **docs/security/donnees-sensibles.md** | P3 | ❌ À créer | Sécurité | Gestion secrets |
| **docs/operations/monitoring.md** | P3 | ❌ À créer | DevOps | Alertes prod |
| **docs/game/guilds.md** | P3 | ❌ À créer | Devs | Futur : guildes |
| **docs/game/achievements.md** | P3 | ❌ À créer | Devs | Futur : achievements |
| **docs/decisions/*.md** | P3 | Partiel | Tech Lead | ADR supplémentaires |

---

## Résumé par priorité

| Priorité | Total | Créés | Restants |
|---|---|---|---|
| P0 | 8 | 8 | 0 |
| P1 | 13 | 13 | 0 |
| P2 | 10 | 0 | 10 |
| P3 | 8 | 0 | 8 |
| **Total** | **39** | **21** | **18** |
