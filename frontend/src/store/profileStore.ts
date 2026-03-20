import { create } from 'zustand';
import type { ProfileUser, ProfilGw2, Gw2DataResponse } from '../types/profile';

// ─── Store Zustand — état profil utilisateur ──────────────────────
// Ne persiste pas — les données profil sont rechargées à chaque visite.
// Seul authStore persiste (sessionStorage).

interface ProfileState {
  // ─── State ────────────────────────────────────────────────────────
  profileUser:  ProfileUser | null;
  profilGw2:    ProfilGw2 | null;
  gw2Data:      Gw2DataResponse | null;
  isLoading:    boolean;
  isSaving:     boolean;
  error:        string | null;

  // ─── Actions ──────────────────────────────────────────────────────
  setProfileUser:  (user: ProfileUser) => void;
  setProfilGw2:    (profil: ProfilGw2 | null) => void;
  setGw2Data:      (data: Gw2DataResponse | null) => void;
  setLoading:      (loading: boolean) => void;
  setSaving:       (saving: boolean) => void;
  setError:        (error: string | null) => void;
  clearError:      () => void;
  reset:           () => void;
}

const useProfileStore = create<ProfileState>((set) => ({
  // ─── État initial ─────────────────────────────────────────────────
  profileUser: null,
  profilGw2:   null,
  gw2Data:     null,
  isLoading:   false,
  isSaving:    false,
  error:       null,

  // ─── Actions ──────────────────────────────────────────────────────
  setProfileUser:  (profileUser)  => set({ profileUser }),
  setProfilGw2:    (profilGw2)    => set({ profilGw2 }),
  setGw2Data:      (gw2Data)      => set({ gw2Data }),
  setLoading:      (isLoading)    => set({ isLoading }),
  setSaving:       (isSaving)     => set({ isSaving }),
  setError:        (error)        => set({ error, isLoading: false, isSaving: false }),
  clearError:      ()             => set({ error: null }),

  /** Reset complet — utilisé à la déconnexion */
  reset: () => set({
    profileUser: null,
    profilGw2:   null,
    gw2Data:     null,
    isLoading:   false,
    isSaving:    false,
    error:       null,
  }),
}));

export default useProfileStore;