// ═══════════════════════════════════════════════════════════════════
// src/hooks/profile/useProfileEdit.ts
// ═══════════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import httpClient           from '@/api/httpClient';
import type { AxiosError }  from 'axios';
import useAuthStore         from '@/store/authStore';
import type { ProfileEditForm } from '@/data/profile.data';

export type EditStatus   = 'idle' | 'loading' | 'success' | 'error';
export type AvatarMode   = 'url' | 'file';

export interface FieldErrors { [key: string]: string | null; }

export function useProfileEdit(onSuccess?: () => void) {
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState<ProfileEditForm>({
    nom:    user?.nom    ?? '',
    avatar: user?.avatar ?? '',
  });

  const [status,      setStatus]      = useState<EditStatus>('idle');
  const [errors,      setErrors]      = useState<FieldErrors>({});
  const [message,     setMessage]     = useState('');
  const [avatarMode,  setAvatarMode]  = useState<AvatarMode>('url');
  const [previewUrl,  setPreviewUrl]  = useState<string>(user?.avatar ?? '');
  const [avatarFile,  setAvatarFile]  = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Ouvrir le sélecteur de fichier ──────────────────────────────
  const openFilePicker = () => fileInputRef.current?.click();

  // ─── Sélection d'un fichier image ────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: 'Format accepté : JPG, PNG, WEBP.' }));
      return;
    }
    // Validation taille (2 MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: 'Taille maximale : 2 Mo.' }));
      return;
    }

    setAvatarFile(file);
    setAvatarMode('file');
    setErrors((prev) => ({ ...prev, avatar: null }));

    // Prévisualisation locale immédiate
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ─── Changement URL avatar ────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'avatar') {
      setPreviewUrl(value);
      setAvatarFile(null);
      setAvatarMode('url');
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ─── Soumission ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setStatus('loading');

    try {
      let avatarUrl = form.avatar;

      // Si fichier sélectionné → upload en multipart
      if (avatarMode === 'file' && avatarFile) {
        const formData = new FormData();
        formData.append('nom',    form.nom);
        formData.append('avatar', avatarFile);

        const res = await httpClient.post('/api/v1/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = res.data.avatar_url;
      }

      // Mise à jour du profil (nom + avatar URL)
      const response = await httpClient.put('/api/v1/profile', {
        nom:    form.nom,
        avatar: avatarUrl,
      });

      // Synchronise le store auth avec les nouvelles données
      const updatedUser = response.data.user;
      setUser({
        id:          updatedUser.id,
        nom:         updatedUser.nom,
        email:       updatedUser.email,
        pseudo_gw2:  updatedUser.pseudo_gw2,
        avatar:      updatedUser.avatar,
        role:        updatedUser.role,
        has_api_key: updatedUser.has_api_key,
      });

      setForm((prev) => ({ ...prev, avatar: avatarUrl ?? '' }));
      setStatus('success');
      setMessage('Profil mis à jour avec succès.');
      onSuccess?.();

    } catch (err) {
      const axiosErr = err as AxiosError<{
        errors?: Record<string, string[]>;
        message?: string;
      }>;

      if (axiosErr.response?.status === 422) {
        const laravelErrors = axiosErr.response.data?.errors ?? {};
        setErrors(
          Object.fromEntries(
            Object.entries(laravelErrors).map(([f, msgs]) => [f, msgs[0]])
          )
        );
        setStatus('idle');
        return;
      }

      setStatus('error');
      setMessage(axiosErr.response?.data?.message ?? 'Une erreur est survenue.');
    }
  };

  return {
    form, status, errors, message,
    avatarMode, previewUrl,
    fileInputRef,
    openFilePicker,
    handleChange,
    handleFileChange,
    handleSubmit,
    setAvatarMode,
  };
}