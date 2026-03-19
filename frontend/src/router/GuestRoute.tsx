import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * GuestRoute — redirige vers / si déjà authentifié.
 *
 * Attend la fin du check de session (isLoading) avant de décider
 * pour éviter un flash de redirection au démarrage de l'app.
 */
const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Pendant la vérification de session, on affiche rien (AuthProvider
  // gère déjà le spinner au niveau global via ProtectedRoute)
  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;