import AuthProvider from './providers/AuthProvider';
import AppRouter from './router';

/**
 * App.jsx — Racine de l'application GW2Nexus
 * AuthProvider vérifie la session Sanctum au démarrage
 */
const App = () => (
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);

export default App;