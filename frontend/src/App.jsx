import AuthProvider from './providers/AuthProvider';    // Fournit le contexte d'authentification à toute l'application
import AppRouter from './router';                       // Gère la navigation entre les différentes pages de l'application

import './styles/theme.css';  // Thème global

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