# Intégration API Guild Wars 2

## Vue d'ensemble

GW2 Nexus s'intègre avec l'**API officielle ArenaNet** (`api.guildwars2.com/v2`) pour afficher des données de compte personnalisées.

**Principe clé :** L'API GW2 n'est jamais appelée depuis le frontend. Toutes les requêtes passent par le backend Laravel via `Gw2ApiService`, qui gère le cache et la gestion d'erreurs.

```
Frontend → Backend (Laravel) → Cache → ArenaNet API
```

---

## Clés API GW2

### Obtention

Un joueur obtient sa clé API sur : https://account.arena.net/applications

Permissions recommandées pour GW2 Nexus :
- `account` — Données de compte
- `characters` — Personnages
- `progression` — World bosses, donjons, raids

Format : `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX` (72 caractères)

### Stockage et sécurité

1. L'utilisateur saisit sa clé dans le frontend
2. Le frontend envoie `POST /api/v1/profile/api-key { api_key }`
3. Le backend valide via `GET /v2/tokeninfo`
4. Si valide : clé chiffrée AES-256 et stockée dans `users.api_key`
5. La clé n'est **jamais retournée** au frontend (attribut `$hidden` dans le modèle User)

---

## Endpoints ArenaNet utilisés

### GET /v2/tokeninfo

**Usage :** Valider une clé API avant de la sauvegarder.

```http
GET https://api.guildwars2.com/v2/tokeninfo?access_token={API_KEY}
```

**Réponse attendue :**
```json
{
    "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "name": "Mon Application",
    "type": "APIKey",
    "permissions": ["account", "characters", "progression"]
}
```

**TTL cache :** 60 secondes.

---

### GET /v2/account

**Usage :** Récupérer les informations du compte GW2.

```http
GET https://api.guildwars2.com/v2/account?access_token={API_KEY}
```

**Réponse (extrait) :**
```json
{
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "NomJoueur.1234",
    "age": 15234000,
    "server": 2202,
    "world": 2202,
    "guilds": ["guild-id-1", "guild-id-2"],
    "created": "2012-08-28T20:00:00Z"
}
```

**TTL cache :** 300 secondes (5 minutes).

---

### GET /v2/characters

**Usage :** Récupérer tous les personnages du compte.

```http
GET https://api.guildwars2.com/v2/characters?ids=all&access_token={API_KEY}
```

**Réponse (extrait) :**
```json
[
    {
        "name": "Nom Personnage",
        "race": "Asura",
        "gender": "Female",
        "profession": "Elementalist",
        "level": 80,
        "created": "2015-03-01T00:00:00Z",
        "age": 5400000,
        "deaths": 42
    }
]
```

**TTL cache :** 300 secondes.

**Données stockées en base** (`profils_gw2.personnages`) :
```json
[
    { "nom": "Nom Personnage", "race": "Asura", "profession": "Elementaliste", "niveau": 80 }
]
```

---

### GET /v2/account/worldbosses

**Usage :** Vérifier quels world bosses ont été tués aujourd'hui par l'utilisateur.

```http
GET https://api.guildwars2.com/v2/account/worldbosses?access_token={API_KEY}
```

**Réponse :**
```json
["shadow_behemoth", "the_shatterer", "tequatl_the_sunless", "claw_of_jormag"]
```

Retourne un tableau des IDs de world bosses tués. La liste se remet à zéro chaque jour à 00:00 UTC.

**TTL cache :** 300 secondes.

---

## Mapping des identifiants de world bosses

| ID API | Nom en jeu | Heure UTC |
|---|---|---|
| `shadow_behemoth` | Béhémoth des ombres | 00:15 |
| `the_shatterer` | Le Briseur | 01:00 |
| `great_jungle_wurm` | Grand vers de la jungle | 01:15 |
| `megadestroyer` | Mégadestructeur | 02:30 |
| `fire_elemental` | Élémentaire de feu | 02:00 |
| `tequatl_the_sunless` | Tequatl le sans soleil | 00:00, 03:00, 07:00, 12:00, 18:00, 23:00 |
| `claw_of_jormag` | Griffe de Jormag | 02:30, 05:00, 07:30, 10:30, 12:30, 17:30, 20:00, 22:30 |
| `modniir_ulgoth` | Ulgoth le Modniir | 01:30 |
| `imbued_shaman` | Chaman imbibé | 02:00 |
| `svanir_shaman` | Chamane de Svanir | 00:30 |
| `golem_mark_ii` | Golem Mark II | 01:00 |
| `evolving_jungle_wurm` | Ver de la jungle évolutif | 02:00 |

---

## Gestion des erreurs

| Code HTTP | Signification | Comportement |
|---|---|---|
| 200 | Succès | Données retournées et mises en cache |
| 401 | Clé API invalide / manque de permissions | Retourne `null`, log erreur |
| 403 | Clé API révoquée | Retourne `null`, marque `profils_gw2.valide = false` |
| 404 | Endpoint inexistant | Retourne `null`, log erreur |
| 429 | Rate limit ArenaNet | Retourne `null`, cache étendu automatiquement |
| 503/5xx | API ArenaNet indisponible | Retourne `null`, log erreur, cache fallback |
| timeout | Timeout (>10s) | Retourne `null` |

Le frontend affiche "Données indisponibles" lorsque `null` est reçu — jamais d'erreur bloquante.

---

## Limitations connues

| Limitation | Valeur | Impact |
|---|---|---|
| Rate limit ArenaNet | ~600 req/min globales | Cache de 5min obligatoire |
| Taille réponse `/v2/characters?ids=all` | Potentiellement grande | Stockage JSON sélectif |
| Réinitialisation daily | Minuit UTC | world bosses remis à zéro chaque jour |
| Latence API | Variable (100-500ms) | Cache TTL minimise l'impact |

---

## Voir aussi

- [Flux de synchronisation](synchronisation.md)
- [Module World Boss](world-bosses.md)
- [Gw2ApiService (backend)](../backend/services.md)
- [Variables d'environnement GW2](../devops/variables-env.md)
