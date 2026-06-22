# Synchronisation des données GW2

## Stratégie de synchronisation

GW2 Nexus utilise une synchronisation **à la demande** (pull) plutôt qu'une synchronisation périodique en arrière-plan.

| Type | Déclencheur | Fréquence |
|---|---|---|
| Validation clé API | Saisie de la clé par l'utilisateur | 1 fois (puis mise à jour si rechargée) |
| Données compte + personnages | Visite du profil / `/api/v1/profile/gw2-data` | Cache 5min |
| World bosses | Visite de la page World Boss | Cache 5min |

---

## Flux : Enregistrement d'une clé API

```
1. [Frontend] UserProfilePage : l'utilisateur saisit sa clé API
2. [Frontend] useApiKey.ts : POST /api/v1/profile/api-key { api_key }
3. [Backend] UserProfileController@saveApiKey
   │
   ├── Validation : longueur 72 caractères
   ├── Gw2ApiService::validateApiKey(key)
   │     └── GET /v2/tokeninfo?access_token={key}
   │           ├── 200 → tokeninfo valide
   │           └── 4xx → Exception → 422 au frontend
   │
   ├── Chiffrement : $key = Crypt::encryptString($apiKey) via cast 'encrypted'
   ├── DB : User::update(['api_key' => $key])
   │
   ├── Gw2ApiService::getAccountData(key)
   │     └── GET /v2/account → { name, world, ... }
   │
   ├── Gw2ApiService::getCharacters(key)
   │     └── GET /v2/characters?ids=all → [ ... ]
   │
   ├── DB : ProfilGw2::updateOrCreate(['user_id' => $userId], {
   │         nom_compte, monde, personnages (JSON), valide=true, derniere_synchro
   │       })
   │
   └── Cache::forget(['gw2_account_X', 'gw2_chars_X', 'gw2_worldbosses_X'])
       └── Force un rechargement depuis l'API au prochain accès

4. [Backend] → 200 { profil_gw2: { ... } }
5. [Frontend] profileStore mis à jour, Gw2ProfileCard affichée
```

---

## Flux : Lecture des données GW2

```
[Frontend] useGw2Data : GET /api/v1/profile/gw2-data
     │
[Backend] UserProfileController@getGw2Data
     │
     ├── auth:sanctum → Récupère $user
     ├── if !$user->api_key → 422 "Aucune clé API enregistrée"
     │
     ├── Cache::remember("gw2_account_{userId}", 300, function() {
     │       return Gw2ApiService::getAccountData($decryptedKey)
     │   })
     │
     ├── Cache::remember("gw2_chars_{userId}", 300, function() {
     │       return Gw2ApiService::getCharacters($decryptedKey)
     │   })
     │
     └── 200 { compte: {...}, personnages: [...] }

[Frontend] → profileStore.setGw2Data() → Affichage Gw2ProfileCard
```

---

## Données stockées en base vs données en cache

| Donnée | Stockage | Durée |
|---|---|---|
| Nom de compte GW2 | `profils_gw2.nom_compte` | Persistant |
| Serveur | `profils_gw2.monde` | Persistant |
| Personnages (liste simplifiée) | `profils_gw2.personnages` (JSON) | Persistant |
| Dernière synchro | `profils_gw2.derniere_synchro` | Persistant |
| Clé API valide | `profils_gw2.valide` | Persistant |
| Données compte complètes | Laravel Cache | 5 minutes |
| World bosses tués | Laravel Cache | 5 minutes |

---

## Invalidation du cache

Le cache GW2 est invalidé dans ces situations :

| Événement | Clés invalidées |
|---|---|
| Nouvelle clé API enregistrée | `gw2_account_X`, `gw2_chars_X`, `gw2_worldbosses_X` |
| Clé API supprimée | `gw2_account_X`, `gw2_chars_X`, `gw2_worldbosses_X` |
| Expiration naturelle (5min) | Automatique |

---

## Évolutions possibles

| Amélioration | Priorité | Complexité |
|---|---|---|
| Synchronisation périodique en arrière-plan (Job/Schedule) | Moyenne | Haute |
| Webhook ArenaNet si disponible | Basse | N/A (non disponible actuellement) |
| Synchronisation guild memberships | Basse | Moyenne |
| Affichage équipement / builds personnages | Basse | Haute |
| Cache Redis pour performance multi-utilisateurs | Haute (prod) | Faible |

---

## Voir aussi

- [API GW2 — Endpoints](gw2-api.md)
- [Module World Boss — timers](world-bosses.md)
- [Gw2ApiService](../backend/services.md)
