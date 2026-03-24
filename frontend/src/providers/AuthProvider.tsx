// src/providers/AuthProvider.tsx

import { useEffect } from 'react';
import authApi from '../api/auth.api';
import useAuthStore from '../store/authStore';

// ---------------------------------------------------------------------------
// AuthProvider — restaure la session Bearer au démarrage de l'app
//
// Séquence au montage :
//   1. Vérifie la présence du token dans le localStorage
//   2. Si absent → visiteur non connecté, libère le loading immédiatement
//   3. Si présent → appelle /api/v1/auth/me pour valider le token et
//      récupérer les données user fraîches depuis le backend
//   4. Sur 401 (token expiré/révoqué) → clearAuth() nettoie tout
//
// Ce composant doit envelopper le RouterProvider dans main.tsx pour que
// ProtectedRoute et GuestRoute aient accès à l'état auth hydraté.
// ---------------------------------------------------------------------------

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {

      // Pas de token dans le localStorage — visiteur non connecté
      // On libère le loading sans appel réseau
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Token présent — on valide auprès du backend et on rafraîchit les données user
      // (le token peut être valide mais les données user avoir changé depuis la dernière visite)
      setLoading(true);
      try {
        const response = await authApi.me();
        setUser(response.data.user);
      } catch {
        // Token expiré ou révoqué — nettoyage du store et du localStorage
        // clearAuth() appelle removeToken() en interne
        clearAuth();
      } finally {
        // Toujours libérer le loading — ProtectedRoute ne doit jamais rester bloqué
        setLoading(false);
      }
    };

    checkSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
};

export default AuthProvider;