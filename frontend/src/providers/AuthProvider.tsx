import { useEffect } from 'react';

import authApi from '../api/auth';
import useAuthStore from '../store/authStore';

/**
 * AuthProvider — vérifie la session Sanctum au démarrage de l'app.
 *
 * IMPORTANT : setLoading(false) est appelé dans le bloc finally
 * pour garantir que ProtectedRoute ne reste jamais bloqué en spinner,
 * que la session soit valide ou non.
 */
const AuthProvider = ({ children }) => {
  const { setUser, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const response = await authApi.me();
        setUser(response.data.user);
      } catch {
        // Pas de session active — comportement normal (401)
        clearAuth();
      } finally {
        // ✅ Toujours libérer le loading, succès ou échec
        setLoading(false);
      }
    };

    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export default AuthProvider;