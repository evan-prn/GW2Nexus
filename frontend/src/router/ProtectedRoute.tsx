import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute — redirige vers /login si non authentifié.
 *
 * @param {string[]} [role] — si fourni, vérifie aussi le rôle de l'utilisateur.
 *   Exemple : <ProtectedRoute roles={['admin', 'moderateur']} />
 *
 * Flux :
 *   1. isLoading → spinner (AuthProvider vérifie la session)
 *   2. !isAuthenticated → /login
 *   3. roles fournis && rôle non autorisé → / (403 silencieux)
 *   4. OK → <Outlet />
 */
const ProtectedRoute = ({ role } = {}) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
        <div className="gw2-loading-screen">
          <div className="gw2-loading-spinner" />
        </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && (!user.role || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;