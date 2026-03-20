// ═══════════════════════════════════════════════════════════════════
// src/hooks/profile/useProfileEdit.ts
// Gestion du formulaire d'édition du profil (nom, avatar URL)
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import useAuthStore from '@/store/authStore';
import type { ProfileEditForm } from '@/data/profile.data';

// ─── Types ───────────────────────────────────────────────────────────
export type EditStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FieldErrors {
  [key: string]: string | null;
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useProfileEdit(onSuccess?: () => void) {
  const { user } = useAuthStore();

  // Initialisation du formulaire avec les valeurs actuelles de l'utilisateur
  const [form, setForm] = useState<ProfileEditForm>({
    nom:    user?.nom    ?? '',
    avatar: user?.avatar ?? '',
  });

  const [status, setStatus]     = useState<EditStatus>('idle');
  const [errors, setErrors]     = useState<FieldErrors>({});
  const [message, setMessage]   = useState('');

  // ─── Mise à jour d'un champ + effacement de son erreur ─────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ─── Soumission du formulaire d'édition ────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setStatus('loading');

    try {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      await axios.put(
        '/api/v1/profile',
        { nom: form.nom, avatar: form.avatar },
        { withCredentials: true }
      );

      setStatus('success');
      setMessage('Profil mis à jour avec succès.');
      onSuccess?.();
    } catch (err) {
      const axiosErr = err as AxiosError<{
        errors?: Record<string, string[]>;
        message?: string;
      }>;

      // Erreurs de validation Laravel (422)
      if (axiosErr.response?.status === 422) {
        const laravelErrors = axiosErr.response.data.errors ?? {};
        const mapped = Object.fromEntries(
          Object.entries(laravelErrors).map(([field, msgs]) => [field, msgs[0]])
        );
        setErrors(mapped);
        setStatus('idle');
        return;
      }

      setStatus('error');
      setMessage(axiosErr.response?.data?.message ?? 'Une erreur est survenue.');
    }
  };

  return { form, status, errors, message, handleChange, handleSubmit };
}