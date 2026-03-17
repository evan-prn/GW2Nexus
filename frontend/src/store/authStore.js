import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Store Zustand — état d'authentification global
 * Persiste uniquement les données non-sensibles (pas le token — Sanctum gère via cookie)
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // ─── State ────────────────────────────────────────────────────────
      user: null,         // { id, nom, email, pseudo_gw2, avatar, role }
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── Actions ──────────────────────────────────────────────────────

      /** Définit l'utilisateur après connexion/inscription réussie */
      setUser: (user) =>
        set({ user, isAuthenticated: true, error: null }),

      /** Efface la session après déconnexion */
      clearAuth: () =>
        set({ user: null, isAuthenticated: false, error: null }),

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
      // Ne persiste que les données utilisateur non-sensibles
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;