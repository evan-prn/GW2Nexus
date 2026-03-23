import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authApi from '../api/auth.api';

export interface User {
  id:          number;
  nom:         string;
  email:       string;
  pseudo_gw2?: string | null;
  avatar?:     string | null;
  role?:       string;
  has_api_key?: boolean;  // ← ajout Sprint 2
}

interface AuthState {
  user:            User | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  error:           string | null;
  setUser:         (user: User) => void;
  clearAuth:       () => void;
  logout:          () => Promise<void>;
  setLoading:      (isLoading: boolean) => void;
  setError:        (error: string | null) => void;
  clearError:      () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      setUser: (user) =>
        set({ user, isAuthenticated: true, error: null }),

      clearAuth: () =>
        set({ user: null, isAuthenticated: false, error: null }),

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch {
          // Déconnexion côté client même si le serveur échoue
        } finally {
          set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        }
      },

      setLoading:  (isLoading) => set({ isLoading }),
      setError:    (error)     => set({ error, isLoading: false }),
      clearError:  ()          => set({ error: null }),
    }),
    {
      name: 'gw2nexus-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;