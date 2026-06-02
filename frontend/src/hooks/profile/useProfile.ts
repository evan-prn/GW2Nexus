import { useCallback } from 'react';
import axios from 'axios';
import profileApi from '../../api/profile.api';
import useProfileStore from '../../store/profileStore';
import useAuthStore from '../../store/authStore';
import type { UpdateProfilePayload } from '../../types/profile.types';

// ─── Hook profil utilisateur ──────────────────────────────────────
// Responsabilité : charger et mettre à jour le profil de base.

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

const useProfile = () => {
  const {
    profileUser, profilGw2,
    isLoading, isSaving, error,
    setProfileUser, setProfilGw2,
    setLoading, setSaving, setError, clearError,
  } = useProfileStore();

  const { setUser } = useAuthStore();

  // ─── Charger le profil complet ────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await profileApi.get();
      const { user, profil_gw2 } = response.data;

      setProfileUser(user);
      setProfilGw2(profil_gw2);

      // Synchronise authStore avec les données fraîches
      setUser({
        id:         user.id,
        nom:        user.nom,
        email:      user.email,
        pseudo_gw2: user.pseudo_gw2,
        avatar:     user.avatar,
        role:       user.role,
      });
    } catch {
      setError('Impossible de charger le profil.');
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setProfileUser, setProfilGw2, setUser, setError]);

  // ─── Mettre à jour le profil de base ─────────────────────────────
  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setSaving(true);
    clearError();
    try {
      const response = await profileApi.update(payload);
      const { user } = response.data;

      setProfileUser(user);

      // Synchronise authStore
      setUser({
        id:         user.id,
        nom:        user.nom,
        email:      user.email,
        pseudo_gw2: user.pseudo_gw2,
        avatar:     user.avatar,
        role:       user.role,
      });

      return { success: true };
    } catch (err: unknown) {
      const message = axios.isAxiosError<ApiErrorResponse>(err)
        ? err.response?.data?.message ?? 'Erreur lors de la mise � jour.'
        : 'Erreur lors de la mise � jour.';
      const errors = axios.isAxiosError<ApiErrorResponse>(err)
        ? err.response?.data?.errors
        : undefined;
      setError(message);
      return { success: false, error: message, errors };
    } finally {
      setSaving(false);
    }
  }, [setSaving, clearError, setProfileUser, setUser, setError]);

  return {
    profileUser,
    profilGw2,
    isLoading,
    isSaving,
    error,
    fetchProfile,
    updateProfile,
    clearError,
  };
};

export default useProfile;
