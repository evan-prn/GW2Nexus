# State Management — Zustand + TanStack Query

GW2 Nexus utilise deux couches de state complémentaires selon la nature des données.

---

## Règle de séparation

| Type de données | Outil | Raison |
|---|---|---|
| État utilisateur global (auth, session) | Zustand | Synchrone, persisté localStorage |
| Données serveur (forum, profil, admin) | TanStack Query | Cache, invalidation, refetch automatique |
| État UI local (modal open/close, input) | `useState` React | Local, pas besoin de partage |

---

## Zustand — State global

### authStore

**Fichier :** `src/store/authStore.ts`

```typescript
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    setAuth: (user: User) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// Persisté en localStorage (clé 'auth_token' stockée séparément)
```

**Lecture :**
```typescript
const { user, isAuthenticated } = useAuthStore();
const user = useAuthStore(state => state.user); // selector optimisé
```

**Particularités :**
- `user` contient : `id, nom, email, pseudo_gw2, avatar, role`
- `isLoading: true` pendant la validation du token au startup (`AuthProvider`)
- `clearAuth()` déclenche le logout (supprime token localStorage)

### profileStore

**Fichier :** `src/store/profileStore.ts`

```typescript
interface ProfileState {
    profileUser: ProfileUser | null;
    profilGw2: ProfilGw2 | null;
    gw2Data: Gw2Data | null;
    isLoading: boolean;
    isSaving: boolean;
    setProfile: (user: ProfileUser, gw2: ProfilGw2 | null) => void;
    setGw2Data: (data: Gw2Data) => void;
    // ...
}
```

**Note :** Pas de persistance localStorage (données fraîches depuis l'API à chaque mount).

---

## TanStack Query — Données serveur

### QueryClient (App.tsx)

```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,        // 1 minute avant refetch
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
```

### Clés de cache (Query Keys)

| Hook | Query Key | Stale Time |
|---|---|---|
| `useForumCategories` | `['forum', 'categories']` | 5min |
| `useForumThreads(slug)` | `['forum', 'threads', slug]` | 2min |
| `useForumThread(slug)` | `['forum', 'thread', slug]` | 2min |
| `useProfile` | `['profile']` | 5min |
| `useAdminUsers(filters)` | `['admin', 'users', filters]` | 1min |
| `useAdminForumReports` | `['admin', 'forum', 'reports']` | 1min |
| `useWorldBossStatus` | `['world-boss-status']` | 5min |

### Mutations et invalidation

```typescript
// Exemple : création d'un post forum
const createPost = useMutation({
    mutationFn: (data) => forumApi.createPost(threadSlug, data),
    onSuccess: () => {
        // Invalide le cache du thread pour recharger les posts
        queryClient.invalidateQueries({ queryKey: ['forum', 'thread', threadSlug] });
        // Invalide aussi la liste des threads (last_post_at change)
        queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] });
    },
});
```

### Gestion loading/error standardisée

```typescript
const { data, isLoading, isError, error } = useQuery(...);

if (isLoading) return <PageLoader />;
if (isError)   return <ErrorBanner message={error.message} />;
return <Component data={data} />;
```

---

## AuthProvider

**Fichier :** `src/providers/AuthProvider.tsx`

Exécuté une seule fois au mount de l'application. Valide le token persisté.

```typescript
useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        authStore.setLoading(false);
        return;
    }

    authStore.setLoading(true);
    authApi.me()
        .then(({ user }) => authStore.setAuth(user))
        .catch(() => authStore.clearAuth())
        .finally(() => authStore.setLoading(false));
}, []);

// Pendant le chargement : <PageLoader /> (evite flash de contenu non-auth)
if (isLoading) return <PageLoader />;
return <>{children}</>;
```

---

## Anti-patterns à éviter

| À éviter | Raison | Alternative |
|---|---|---|
| Stocker des données serveur dans Zustand | Duplication, désynchronisation | TanStack Query |
| Appeler l'API directement dans un composant | Pas de cache, pas de retry | Custom hook + useQuery |
| `useEffect` pour fetch de données | Race conditions | useQuery |
| Accéder à `authStore` depuis un service HTTP | Couplage | Intercepteur Axios |
