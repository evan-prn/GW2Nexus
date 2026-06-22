import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './providers/AuthProvider';
import AppRouter from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * App.tsx — Racine de l'application GW2Nexus
 * QueryClientProvider expose React Query à toute l'app.
 * AuthProvider vérifie la session Sanctum au démarrage.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;