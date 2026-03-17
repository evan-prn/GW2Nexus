import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute — redirige vers /login si non authentifié.
 *
 * @param {string[]} [roles] — si fourni, vérifie aussi le rôle de l'utilisateur.
 *   Exemple : <ProtectedRoute roles={['admin', 'moderateur']} />
 *
 * Flux :
 *   1. isLoading → spinner (AuthProvider vérifie la session)
 *   2. !isAuthenticated → /login
 *   3. roles fournis && rôle non autorisé → /dashboard (403 silencieux)
 *   4. OK → <Outlet />
 */
const ProtectedRoute = ({ roles } = {}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="gw2-loading-screen">
        <div className="gw2-loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;