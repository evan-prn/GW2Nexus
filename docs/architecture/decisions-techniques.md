# Décisions Techniques — ADR

Architecture Decision Records du projet GW2 Nexus.

---

## ADR-001 — Authentification par Bearer Token (Sanctum)

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
Besoin d'une authentification pour une SPA React consommant une API Laravel. Deux approches possibles : session cookie (stateful) ou token Bearer (stateless).

### Décision
Utilisation de **Laravel Sanctum en mode Bearer Token** (pas en mode SPA cookie).

### Conséquences positives
- API consommable depuis n'importe quel client (mobile, third-party)
- Pas de problème CSRF sur les routes API
- Multi-device nativement (plusieurs tokens par user)
- Révocable individuellement ou globalement

### Conséquences négatives
- Token stocké en localStorage (XSS risk) plutôt qu'en cookie HttpOnly
- Gestion manuelle du refresh (pas de refresh token natif Sanctum)

---

## ADR-002 — Chiffrement AES-256 des clés API GW2

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
Les clés API GW2 des utilisateurs donnent accès à leurs données de compte. Elles ne doivent jamais être stockées en clair.

### Décision
Utilisation du cast **`encrypted`** d'Eloquent → Illuminate Encryption (AES-256-CBC, dérivé de `APP_KEY`).

### Conséquences positives
- Chiffrement automatique à l'écriture, déchiffrement à la lecture
- Utilise la clé applicative Laravel (rotation possible)
- Clé jamais exposée via `$hidden` sur le modèle User

### Conséquences négatives
- Impossible de vérifier en frontend si une clé est déjà enregistrée (champ masqué)
- Si `APP_KEY` est perdue, les clés sont irrécupérables

---

## ADR-003 — API versionnée `/api/v1/`

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
L'API est consommée par le frontend et potentiellement de futurs clients. Des évolutions breaking sont inévitables.

### Décision
Toutes les routes API sont préfixées `/api/v1/`. Une future version `/api/v2/` pourra coexister.

### Conséquences
- Rétrocompatibilité possible en maintenant v1 pendant une transition
- Légère verbosité dans les URLs

---

## ADR-004 — Cache API GW2 via Laravel Cache (database driver)

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
L'API ArenaNet impose des rate limits. Les données GW2 (compte, personnages, world bosses) changent rarement.

### Décision
Cache de 5 minutes (300s) via `Cache::remember()`, driver `database` par défaut. Configurable via `CACHE_STORE`.

### Évolution possible
Passer au driver **Redis** pour les environnements de production à charge élevée.

---

## ADR-005 — Rôles via colonne `enum` sur la table `users`

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
Le projet nécessite 3 niveaux d'accès : `user`, `moderateur`, `admin`.

### Décision
Colonne `role enum('user', 'moderateur', 'admin')` sur la table `users`. Pas de table `roles` séparée.

### Conséquences positives
- Simplicité : pas de jointure pour vérifier le rôle
- Performant pour les middlewares (accès direct `$user->role`)

### Conséquences négatives
- Migration nécessaire pour ajouter un nouveau rôle
- Pas de granularité fine sur les permissions (pour le futur, envisager Spatie Laravel Permission)

---

## ADR-006 — Forum : Soft delete non utilisé sur posts/threads

**Date :** 2026-06  
**Statut :** Acceptée  

### Contexte
Les posts et threads supprimés doivent disparaître immédiatement sans laisser de trace visible.

### Décision
Suppression physique (hard delete) pour `forum_posts` et `forum_threads`. Soft delete uniquement sur `users`.

### Conséquences
- Historique forum non récupérable après suppression par modérateur
- Plus simple à implémenter et à comprendre

---

## ADR-007 — Vite Proxy pour le développement local

**Date :** 2026-03  
**Statut :** Acceptée  

### Contexte
CORS et cookies de session posent des problèmes entre ports différents en développement.

### Décision
Configuration d'un **proxy Vite** : `/api/*` et `/sanctum/*` → `laravel:8000`. Le frontend utilise des chemins relatifs.

### Conséquences
- Pas de problème CORS en développement
- `VITE_API_URL` pointe sur le serveur Vite lui-même (pas directement sur Laravel)
- En production, un reverse proxy (Nginx) doit reproduire ce comportement
