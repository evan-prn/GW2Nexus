# Module World Boss

## Description

La page World Boss (`/world-boss`) affiche :
1. Le timer en temps réel des prochains world bosses (toutes les minutess selon le schedule UTC officiel GW2)
2. Pour les utilisateurs connectés avec une clé GW2 : les boss déjà tués aujourd'hui

---

## Architecture

```
WorldBossPage
├── useEventTimer()       ← Timer UTC mis à jour chaque seconde
├── useGw2BossImages()    ← Images boss depuis CDN ArenaNet
└── useWorldBossStatus()  ← GET /api/v1/profile/world-boss-status
      └── [Backend] UserProfileController@getWorldBossStatus
            └── Gw2ApiService::getWorldBossStatus()
                  └── GET /v2/account/worldbosses (cache 5min)
```

---

## Hooks frontend

### useEventTimer

**Fichier :** `src/hooks/event/useEventTimer.ts`

Met à jour l'heure UTC courante chaque seconde via `setInterval`. Permet d'afficher le prochain boss et le compte à rebours.

```typescript
function useEventTimer() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    return now; // Heure UTC courante
}
```

### useWorldBossStatus

**Fichier :** `src/hooks/event/useWorldBossStatus.ts`

```typescript
function useWorldBossStatus() {
    return useQuery({
        queryKey: ['world-boss-status'],
        queryFn: () => eventsApi.getWorldBossStatus(),
        staleTime: 5 * 60 * 1000,
        enabled: isAuthenticated && hasApiKey,
    });
}
```

Retourne un tableau d'IDs de boss tués : `["shadow_behemoth", "tequatl_the_sunless"]`

### useGw2BossImages

**Fichier :** `src/hooks/event/useGw2BossImages.ts`

Charge les images des world bosses depuis le CDN ArenaNet ou depuis des assets locaux. Gère les erreurs de chargement avec une image placeholder.

---

## Schedule des world bosses (UTC)

Le schedule est calculé côté frontend selon les heures fixes officielles GW2.

| Boss | Heures UTC | Reset |
|---|---|---|
| Béhémoth des ombres | 00:15, 03:15, 06:15, 09:15, 12:15, 15:15, 18:15, 21:15 | Minuit UTC |
| Le Briseur | 01:00, 04:00, 07:00, 10:00, 13:00, 16:00, 19:00, 22:00 | Minuit UTC |
| Grand vers de la jungle | 01:15, 04:15, 07:15, 10:15, 13:15, 16:15, 19:15, 22:15 | Minuit UTC |
| Mégadestructeur | 00:30, 03:30, 06:30, 09:30, 12:30, 15:30, 18:30, 21:30 | Minuit UTC |
| Élémentaire de feu | 00:00, 02:00, 04:00, 06:00, 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00 | Minuit UTC |
| Tequatl le sans soleil | 00:00, 03:00, 07:00, 12:00, 18:00, 23:00 | Minuit UTC |
| Griffe de Jormag | 02:30, 05:00, 07:30, 10:30, 12:30, 17:30, 20:00, 22:30 | Minuit UTC |

> La liste complète est définie dans `src/hooks/event/useEventTimer.ts` ou dans un fichier de données `src/data/worldBosses.ts`.

---

## API Endpoint

### GET /api/v1/profile/world-boss-status

**Auth :** Bearer Token requis  
**Condition :** L'utilisateur doit avoir une clé API GW2 enregistrée

**Réponse :**
```json
["shadow_behemoth", "great_jungle_wurm", "tequatl_the_sunless"]
```

En cas d'erreur (API GW2 indisponible, clé invalide) :
```json
[]
```

---

## Affichage

### WorldBossCard

Affiche pour chaque boss :
- Icône / image
- Nom
- Prochaine occurrence (avec compte à rebours)
- Indicateur visuel : ✅ Tué / ⬜ Disponible / ⏳ En cours

Comportement selon l'état de connexion :
- **Non connecté** : Timer uniquement, pas de statut "tué"
- **Connecté sans clé API** : Timer + invitation à configurer sa clé
- **Connecté avec clé API** : Timer + statut personnalisé depuis `/v2/account/worldbosses`

---

## Règles métier

1. Le statut "tué" se réinitialise chaque jour à **00:00 UTC**.
2. Un boss peut apparaître plusieurs fois par jour ; le statut "tué" s'applique à toutes ses occurrences du jour.
3. La vérification est côté serveur : le frontend ne fait jamais de requête directe vers ArenaNet.
4. Si l'API GW2 est indisponible, le statut "tué" est absent (pas d'erreur bloquante).
