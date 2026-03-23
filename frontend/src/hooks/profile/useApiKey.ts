import { useCallback, useState } from 'react';
import profileApi       from '../../api/profile.api';
import useProfileStore  from '../../store/profileStore';
import type { Gw2DataResponse } from '../../types/profile.types';

// ─── Types locaux ────────────────────────────────────────────────
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── Hook clé API GW2 ────────────────────────────────────────────
// Expose deux interfaces :
//   1. Formulaire  → apiKey, setApiKey, status, message, handleSubmit
//   2. Données GW2 → profilGw2, gw2Data, fetchGw2Data, deleteApiKey

const useApiKey = () => {
  const {
    profilGw2, gw2Data,
    setProfilGw2, setGw2Data,
    setSaving, setError, clearError,
  } = useProfileStore();

  // ─── État local formulaire ─────────────────────────────────────
  const [apiKey,        setApiKey]       = useState('');
  const [status,        setStatus]       = useState<SubmitStatus>('idle');
  const [message,       setMessage]      = useState('');
  const [isLoadingGw2,  setIsLoadingGw2] = useState(false);

  // ─── Soumettre la clé API ──────────────────────────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setStatus('loading');
    setMessage('');
    clearError();

    try {
      const response = await profileApi.updateApiKey({ api_key: apiKey.trim() });
      setProfilGw2(response.data.profil_gw2);
      setStatus('success');
      setMessage('Clé API validée et enregistrée avec succès.');
      setApiKey('');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Clé API invalide ou expirée.';
      setStatus('error');
      setMessage(msg);
      setError(msg);
    }
  }, [apiKey, clearError, setProfilGw2, setError]);

  // ─── Supprimer la clé API ─────────────────────────────────────
  const deleteApiKey = useCallback(async () => {
    setSaving(true);
    clearError();
    try {
      await profileApi.deleteApiKey();
      if (profilGw2) {
        setProfilGw2({ ...profilGw2, valide: false, nom_compte: null, monde: null });
      }
      setGw2Data(null);
      setStatus('idle');
      setMessage('');
      return { success: true };
    } catch {
      setError('Erreur lors de la suppression de la clé API.');
      return { success: false };
    } finally {
      setSaving(false);
    }
  }, [profilGw2, setSaving, clearError, setProfilGw2, setGw2Data, setError]);

  // ─── Charger les données GW2 fraîches ─────────────────────────
  const fetchGw2Data = useCallback(async (): Promise<Gw2DataResponse | null> => {
    setIsLoadingGw2(true);
    clearError();
    try {
      const response = await profileApi.gw2Data();
      setGw2Data(response.data);
      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Impossible de récupérer les données GW2.';
      setError(msg);
      return null;
    } finally {
      setIsLoadingGw2(false);
    }
  }, [clearError, setGw2Data, setError]);

  return {
    // Interface formulaire
    apiKey, setApiKey,
    status, message,
    handleSubmit,

    // Interface données GW2
    profilGw2, gw2Data,
    isLoadingGw2,
    deleteApiKey,
    fetchGw2Data,
  };
};

export default useApiKey;