import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../../store/authStore';
import authApi from '../../api/auth';

/**
 * Hook d'authentification — encapsule toute la logique auth.
 * Règle : chaque action async remet setLoading(false) dans finally.
 */
const useAuth = () => {
  const {
    user, isAuthenticated, isLoading, error,
    setUser, clearAuth, setLoading, setError, clearError,
  } = useAuthStore();
  const navigate = useNavigate();

  // ─── Inscription ────────────────────────────────────────────────────
  const register = useCallback(
    async (formData) => {
      setLoading(true);
      clearError();
      try {
        const response = await authApi.register(formData);
        setUser(response.data.user);
        navigate('/dashboard');
        return { success: true };
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        return { success: false, error: message, errors: err.response?.data?.errors };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setUser, setError, navigate]
  );

  // ─── Connexion ──────────────────────────────────────────────────────
  const login = useCallback(
    async (formData) => {
      setLoading(true);
      clearError();
      try {
        const response = await authApi.login(formData);
        setUser(response.data.user);
        navigate('/dashboard');
        return { success: true };
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        return { success: false, error: message, errors: err.response?.data?.errors };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setUser, setError, navigate]
  );

  // ─── Déconnexion ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch {
      // On déconnecte côté client même si le serveur échoue
    } finally {
      clearAuth();
      setLoading(false);
      navigate('/login');
    }
  }, [setLoading, clearAuth, navigate]);

  // ─── Récupère la session existante (utilisé par AuthProvider) ───────
  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authApi.me();
      setUser(response.data.user);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    initAuth,
    clearError,
  };
};

// ─── Extraction du message d'erreur Laravel ──────────────────────────
const extractErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.status === 422) return 'Veuillez corriger les erreurs du formulaire.';
  if (err.response?.status === 429) return 'Trop de tentatives. Réessayez dans quelques minutes.';
  if (err.response?.status === 403) return 'Accès refusé.';
  if (!err.response)                return 'Erreur de connexion au serveur.';
  return 'Une erreur inattendue est survenue.';
};

export default useAuth;