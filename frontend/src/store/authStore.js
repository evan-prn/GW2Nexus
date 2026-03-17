// frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authApi from '../api/auth';

/**
 * Store Zustand — état d'authentification global
 * Persiste uniquement les données non-sensibles (pas le token — Sanctum gère via cookie)
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // ─── State ────────────────────────────────────────────────────────
      user: null,            // { id, nom, email, pseudo_gw2, avatar, role }
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── Actions ──────────────────────────────────────────────────────

      /** Définit l'utilisateur après connexion/inscription réussie */
      setUser: (user) =>
        set({ user, isAuthenticated: true, error: null }),

      /** Efface la session côté client uniquement */
      clearAuth: () =>
        set({ user: null, isAuthenticated: false, error: null }),

      /** Déconnexion complète : appel API + reset état */
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch {
          // On déconnecte côté client même si le serveur échoue
        } finally {
          set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        }
      },

      /** Gestion du loading */
      setLoading: (isLoading) => set({ isLoading }),

      /** Gestion des erreurs */
      setError: (error) => set({ error, isLoading: false }),

      /** Reset erreur */
      clearError: () => set({ error: null }),
    }),
    {
      name: 'gw2nexus-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;