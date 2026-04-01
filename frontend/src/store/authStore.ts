// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authApi from '../api/auth.api';
import useProfileStore from './profileStore';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  id:           number;
  nom:          string;
  email:        string;
  pseudo_gw2?:  string | null;
  avatar?:      string | null;
  role?:        string;
  has_api_key?: boolean;
}

export interface AuthState {
  // ─── État ──────────────────────────────────────────────────────────────────
  user:            User | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  error:           string | null;

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Persiste le token Bearer dans le localStorage et hydrate le store.
   * Appelé après un login ou un register réussi.
   */
  setAuth:    (user: User, token: string) => void;

  /**
   * Met à jour uniquement les données user (après mise à jour de profil).
   * Ne touche pas au token.
   */
  setUser:    (user: User) => void;

  /**
   * Appelle le backend pour révoquer le token courant, puis
   * nettoie le store et le localStorage.
   */
  logout:     () => Promise<void>;

  /**
   * Nettoie le store et le localStorage sans appeler le backend.
   * Utilisé sur 401 (token expiré/révoqué) ou erreur réseau.
   */
  clearAuth:  () => void;

  setLoading: (isLoading: boolean) => void;
  setError:   (error: string | null) => void;
  clearError: () => void;
}

// ─── Helpers internes ────────────────────────────────────────────────────────

/**
 * Supprime le token du localStorage.
 * Centralisé ici pour ne pas dupliquer la clé 'auth_token' partout.
 */
const removeToken = () => localStorage.removeItem('auth_token');

/**
 * Persiste le token dans le localStorage.
 * Centralisé ici — httpClient le lit depuis cette même clé.
 */
const saveToken = (token: string) => localStorage.setItem('auth_token', token);

// ─── Store ───────────────────────────────────────────────────────────────────

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      // ───────────────────────────────────────────────────────────────────────
      // setAuth — login / register
      //
      // Persiste le token dans le localStorage ET hydrate le store.
      // L'ordre est important : le token doit être en localStorage avant
      // tout appel API ultérieur (ex: fetch du profil GW2 enchaîné).
      // ───────────────────────────────────────────────────────────────────────
      setAuth: (user, token) => {
        saveToken(token);
        set({ user, isAuthenticated: true, error: null });
      },

      // ───────────────────────────────────────────────────────────────────────
      // setUser — mise à jour du profil sans toucher au token
      // ───────────────────────────────────────────────────────────────────────
      setUser: (user) =>
        set({ user, isAuthenticated: true, error: null }),

      // ───────────────────────────────────────────────────────────────────────
      // logout — révocation backend + nettoyage local
      //
      // On nettoie dans le finally pour garantir la déconnexion côté client
      // même si le serveur est momentanément indisponible.
      // ───────────────────────────────────────────────────────────────────────
      logout: async () => {
        set({ isLoading: true });
        try {
          // Révoque le token en base (Bearer — pas de session à invalider)
          await authApi.logout();
        } catch {
          // Déconnexion locale garantie même si le backend est inaccessible
        } finally {
          removeToken();
          set({ user: null, isAuthenticated: false, error: null, isLoading: false });
          useProfileStore.getState().reset();
        }
      },

      // ───────────────────────────────────────────────────────────────────────
      // clearAuth — nettoyage sans appel backend
      //
      // Utilisé par AuthProvider sur 401 (token expiré/révoqué détecté
      // au démarrage), ou par l'intercepteur httpClient sur 401 réseau.
      // ───────────────────────────────────────────────────────────────────────
      clearAuth: () => {
        removeToken();
        set({ user: null, isAuthenticated: false, error: null });
        useProfileStore.getState().reset();
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)     => set({ error, isLoading: false }),
      clearError: ()          => set({ error: null }),
    }),
    {
      name: 'gw2nexus-auth',
      // localStorage — le token doit survivre à la fermeture d'onglet
      // sessionStorage viderait le store à chaque nouvel onglet (incompatible Bearer)
      storage: createJSONStorage(() => localStorage),
      // On ne persiste que les données affichées — le token vit dans localStorage
      // directement (clé 'auth_token'), pas dans le store sérialisé
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;