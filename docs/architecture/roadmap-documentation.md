# Roadmap de Documentation

## Semaine 1 — Fondations (P0) ✅ COMPLÉTÉ

Objectif : Tout nouveau développeur peut cloner et lancer le projet.

| Jour | Document | Méthode | Responsable |
|---|---|---|---|
| Lun | docs/README.md | ✅ Généré | Auto |
| Lun | docs/devops/setup-local.md | ✅ Généré | Auto |
| Lun | docs/devops/variables-env.md | ✅ Généré | Auto |
| Mar | docs/architecture/architecture-globale.md | ✅ Généré | Auto |
| Mar | docs/database/schema.md | ✅ Généré | Auto |
| Mer | docs/api/overview.md | ✅ Généré | Auto |
| Mer | docs/api/auth.md | ✅ Généré | Auto |
| Jeu | docs/security/overview.md | ✅ Généré | Auto |

---

## Semaine 2 — Architecture et modules (P1) ✅ COMPLÉTÉ

Objectif : Un développeur peut contribuer à n'importe quel module.

| Jour | Document | Méthode | Responsable |
|---|---|---|---|
| Lun | docs/backend/overview.md | ✅ Généré | Auto |
| Lun | docs/backend/authentification.md | ✅ Généré | Auto |
| Mar | docs/backend/services.md | ✅ Généré | Auto |
| Mar | docs/frontend/overview.md | ✅ Généré | Auto |
| Mer | docs/frontend/state-management.md | ✅ Généré | Auto |
| Mer | docs/game/gw2-api.md | ✅ Généré | Auto |
| Jeu | docs/game/synchronisation.md | ✅ Généré | Auto |
| Jeu | docs/game/world-bosses.md | ✅ Généré | Auto |
| Ven | docs/testing/overview.md | ✅ Généré | Auto |
| Ven | docs/api/admin.md | ✅ Généré | Auto |
| Ven | docs/architecture/diagrammes.md | ✅ Généré | Auto |
| Ven | docs/architecture/decisions-techniques.md | ✅ Généré | Auto |
| Ven | docs/devops/docker.md | ✅ Généré | Auto |
| Ven | docs/operations/runbook.md | ✅ Généré | Auto |

---

## Semaine 3 — Complétion (P2)

Objectif : Documentation exhaustive de tous les endpoints et composants.

| Document | Méthode | Priorité |
|---|---|---|
| docs/api/profile.md | À générer (même pattern que auth.md) | Haute |
| docs/api/events.md | À générer | Moyenne |
| docs/api/contact.md | À générer (court) | Basse |
| docs/frontend/routing.md | À rédiger (navigation protégée) | Haute |
| docs/frontend/composants.md | À rédiger (catalogue) | Moyenne |
| docs/database/migrations.md | Auto-généré depuis migrations | Haute |
| docs/game/limitations.md | À rédiger (API GW2 constraints) | Moyenne |
| docs/devops/ci-cd.md | À rédiger (pipeline à implémenter) | Haute |

**Documents pouvant être générés automatiquement :**
- `docs/api/profile.md` → Même pattern que auth.md, données depuis UserProfileController
- `docs/api/events.md` → Données depuis EventController
- `docs/database/migrations.md` → Extraire infos des fichiers de migration

**Documents nécessitant rédaction manuelle :**
- `docs/frontend/composants.md` → Requiert connaissance des comportements UI
- `docs/frontend/routing.md` → Requiert explication des cas limites de routing
- `docs/devops/ci-cd.md` → Dépend des choix d'infrastructure production

---

## Semaine 4 — Long terme (P3)

Objectif : Documentation de maintenance et évolution.

| Document | Méthode | Note |
|---|---|---|
| docs/product/user-stories.md | Rédaction manuelle | Impliquer Product Owner |
| docs/architecture/performances.md | Rédaction technique | Après métriques prod |
| docs/security/donnees-sensibles.md | Rédaction + audit | Avec expert sécurité |
| docs/operations/monitoring.md | Après mise en prod | Dépend de l'infra choisie |
| docs/game/guilds.md | À faire avant implémentation | Feature future |
| docs/game/achievements.md | À faire avant implémentation | Feature future |

---

## Maintenance continue

| Quand | Quoi |
|---|---|
| Chaque nouveau endpoint | Mettre à jour docs/api/ |
| Chaque nouvelle migration | Mettre à jour docs/database/schema.md |
| Chaque nouvelle variable d'env | Mettre à jour docs/devops/variables-env.md |
| Chaque décision d'architecture | Créer un ADR dans docs/decisions/ ou docs/architecture/decisions-techniques.md |
| Chaque incident | Documenter dans docs/operations/runbook.md |

---

## Critères de qualité

Une documentation est considérée **complète** quand :

- [ ] Un développeur peut lancer le projet sans aide en < 30 minutes
- [ ] Un nouveau venu peut trouver n'importe quel endpoint en < 2 minutes
- [ ] Les règles métier GW2 sont expliquées sans connaissance préalable du jeu
- [ ] Les décisions architecturales importantes ont un ADR
- [ ] Le schema de base de données est toujours à jour avec les migrations
