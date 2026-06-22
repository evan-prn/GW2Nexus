# Frontend — Vue d'ensemble

## Stack

| Technologie | Version | Rôle |
|---|---|---|
| React | 19.2.0 | UI library |
| TypeScript | 5.8.3 | Typage statique |
| Vite | 7.3.1 | Build tool + Dev server |
| React Router | 7.13.1 | Routing SPA |
| Zustand | 5.0.12 | State management global |
| TanStack Query | 5.95.2 | Cache + fetching serveur |
| Axios | 1.13.6 | Client HTTP |
| Tailwind CSS | 4.2.1 | Styling utilitaire |

## Structure des dossiers

```
frontend/src/
├── api/                    # Couche d'accès API
│   ├── httpClient.ts       # Axios configuré + intercepteurs
│   ├── endpoint.ts         # Constantes URL
│   ├── auth.api.ts         # Appels auth
│   ├── profile.api.ts      # Appels profil
│   ├── forum.api.ts        # Appels forum
│   ├── admin.api.ts        # Appels admin
│   ├── events.api.ts       # Appels events
│   ├── contact.api.ts      # Appels contact
│   └── gw2Images.ts        # Utilitaires images GW2 (CDN ArenaNet)
├── store/                  # State global Zustand
│   ├── authStore.ts        # Auth (user, isAuthenticated, token)
│   └── profileStore.ts     # Profil utilisateur courant
├── types/                  # Types TypeScript partagés
│   ├── auth.types.ts
│   ├── profile.types.ts
│   ├── admin.types.ts
│   ├── events.types.ts
│   └── forum.types.ts
├── hooks/                  # Custom hooks React
│   ├── auth/
│   ├── admin/
│   ├── profile/
│   ├── forum/
│   ├── event/
│   ├── contact/
│   └── ui/
├── pages/                  # Pages React (lazy-loaded)
│   ├── HomePage/
│   ├── Auth/               # Login, Register, ForgotPassword, ResetPassword
│   ├── Profile/
│   ├── Admin/              # Overview, Users, Forum
│   ├── Forum/              # Home, Category, Thread, NewThread
│   └── Events/             # Events, WorldBoss
├── components/             # Composants UI réutilisables
│   ├── about/
│   ├── admin/
│   ├── auth/
│   ├── contact/
│   ├── events/
│   ├── forum/
│   ├── layout/             # Navbar, Footer
│   ├── profile/
│   └── ui/                 # Button, Modal, Toast, Input...
├── providers/
│   └── AuthProvider.tsx    # Valide le token au startup
├── router/
│   ├── index.tsx           # Routes + lazy imports
│   ├── ProtectedRoute.tsx  # Requiert auth
│   ├── GuestRoute.tsx      # Requiert non-auth
│   └── AdminRoute.tsx      # Requiert role admin
├── styles/                 # CSS global + Tailwind
├── assets/                 # Images, icônes statiques
├── App.tsx                 # Root : QueryClient + AuthProvider + Router
└── main.tsx                # Point d'entrée ReactDOM
```

## Arbre de rendu principal

```
<App>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>           ← Valide token au mount, hydrate authStore
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              ...
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              ...
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminOverviewPage />} />
              ...
            </Route>
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
</App>
```

## Client HTTP (Axios)

**Fichier :** `src/api/httpClient.ts`

```typescript
const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Injection automatique Bearer token
httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Gestion 401 → Logout automatique
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            useAuthStore.getState().clearAuth();
        }
        return Promise.reject(error);
    }
);
```

## Pattern de développement

### Custom Hook → API Call → UI

```typescript
// 1. Hook (src/hooks/forum/useForumCategories.ts)
export function useForumCategories() {
    return useQuery({
        queryKey: ['forum', 'categories'],
        queryFn: () => forumApi.getCategories(),
        staleTime: 5 * 60 * 1000,
    });
}

// 2. API (src/api/forum.api.ts)
export const forumApi = {
    getCategories: () => httpClient.get(ENDPOINTS.FORUM.CATEGORIES).then(r => r.data),
};

// 3. Composant (src/components/forum/ForumCategoryList.tsx)
function ForumCategoryList() {
    const { data: categories, isLoading, isError } = useForumCategories();
    if (isLoading) return <Skeleton />;
    if (isError)   return <ErrorMessage />;
    return <ul>{categories.map(c => <CategoryItem key={c.id} {...c} />)}</ul>;
}
```

## Voir aussi

- [Routing et protections](routing.md)
- [State management (Zustand + React Query)](state-management.md)
- [Catalogue des composants](composants.md)
