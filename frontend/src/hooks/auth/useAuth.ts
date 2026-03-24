// src/hooks/auth/useAuth.ts

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import useAuthStore from '../../store/authStore';
import authApi, { type LoginPayload, type RegisterPayload } from '../../api/auth.api';

// ---------------------------------------------------------------------------
// useAuth — hook d'authentification
//
// Encapsule toute la logique auth et expose une interface simple aux pages.
// La persistance du token (localStorage) est gérée dans authStore via setAuth.
//
// Règle : chaque action async libère setLoading dans finally pour garantir
// qu'aucun spinner ne reste bloqué en cas d'erreur réseau.
// ---------------------------------------------------------------------------

const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    setUser,
    clearAuth,
    logout:     storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const navigate = useNavigate();

  // ─── Inscription ─────────────────────────────────────────────────────────
  //
  // Le backend retourne { user, token } — on appelle setAuth(user, token)
  // pour persister le token dans le localStorage ET hydrater le store.
  // Sans setAuth, le token n'est pas injecté dans les requêtes suivantes.
  //
  const register = useCallback(
    async (formData: RegisterPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authApi.register(formData);
        const { user, token } = response.data;

        // Persiste le token + hydrate le store en une seule opération
        setAuth(user, token);
        navigate('/profile');
        return { success: true };

      } catch (err) {
        const message = extractErrorMessage(err);
        const errors  = axios.isAxiosError(err) ? err.response?.data?.errors : undefined;
        setError(message);
        return { success: false, error: message, errors };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setAuth, setError, navigate]
  );

  // ─── Connexion ────────────────────────────────────────────────────────────
  //
  // Même logique que register — le backend retourne { user, token }.
  //
  const login = useCallback(
    async (formData: LoginPayload) => {
      setLoading(true);
      clearError();
      try {
        const response = await authApi.login(formData);
        const { user, token } = response.data;

        setAuth(user, token);
        navigate('/profile');
        return { success: true };

      } catch (err) {
        const message = extractErrorMessage(err);
        const errors  = axios.isAxiosError(err) ? err.response?.data?.errors : undefined;
        setError(message);
        return { success: false, error: message, errors };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setAuth, setError, navigate]
  );

  // ─── Déconnexion ──────────────────────────────────────────────────────────
  //
  // On délègue entièrement à authStore.logout qui :
  //   1. Appelle le backend pour révoquer le token Bearer
  //   2. Supprime le token du localStorage
  //   3. Reset le store auth + profileStore
  //
  // On ne duplique pas cette logique ici — SRP.
  //
  const logout = useCallback(async () => {
    await storeLogout();
    navigate('/login');
  }, [storeLogout, navigate]);

  // ─── Restauration de session (utilisé par AuthProvider) ───────────────────
  //
  // Vérifie la validité du token présent en localStorage.
  // Appelé une seule fois au montage de l'app — pas besoin de setAuth ici
  // car le token est déjà en localStorage, on met juste à jour les données user.
  //
  const initAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authApi.me();
      setUser(response.data.user);
    } catch {
      // Token expiré ou révoqué — nettoyage complet
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

// ─── Extraction du message d'erreur Laravel ───────────────────────────────────

const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.data?.message)  return err.response.data.message;
    if (err.response?.status === 422) return 'Veuillez corriger les erreurs du formulaire.';
    if (err.response?.status === 429) return 'Trop de tentatives. Réessayez dans quelques minutes.';
    if (err.response?.status === 403) return err.response.data?.message ?? 'Accès refusé.';
    if (!err.response)                return 'Erreur de connexion au serveur.';
  }
  return 'Une erreur inattendue est survenue.';
};

export default useAuth;