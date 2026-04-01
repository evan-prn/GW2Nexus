// =============================================================
// router/ProtectedRoute.tsx
// Guard de route — redirige si non authentifié ou rôle insuffisant
//
// Flux :
//   1. isLoading  → spinner (AuthProvider vérifie la session)
//   2. !isAuthenticated → /login
//   3. roles fournis && rôle non autorisé → / (403 silencieux)
//   4. OK → <Outlet />
//
// Usage :
//   <ProtectedRoute />                          — authentifié uniquement
//   <ProtectedRoute roles={['admin']} />        — admin uniquement
//   <ProtectedRoute roles={['admin', 'moderateur']} /> — admin ou modérateur
// =============================================================

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  roles?: string[];
}

const ProtectedRoute = ({ roles }: ProtectedRouteProps = {}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // AuthProvider vérifie la session au démarrage — on attend sa réponse
  if (isLoading) {
    return (
        <div className="gw2-loading-screen">
          <div className="gw2-loading-spinner" />
        </div>
    );
  }

  // Non authentifié → redirection vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Rôle insuffisant → redirection silencieuse vers l'accueil (403)
  if (roles && roles.length > 0 && !roles.includes(user?.role ?? '')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;