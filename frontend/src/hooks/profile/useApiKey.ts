// ═══════════════════════════════════════════════════════════════════
// src/hooks/profile/useApiKey.ts
// Gestion de la clé API GW2 : saisie, validation via backend, feedback
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';

// ─── Types ───────────────────────────────────────────────────────────
export type ApiKeyStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── Hook ────────────────────────────────────────────────────────────
export function useApiKey() {
  const [apiKey,    setApiKey]    = useState('');
  const [status,    setStatus]    = useState<ApiKeyStatus>('idle');
  const [message,   setMessage]   = useState('');

  // ─── Soumission et validation de la clé API ─────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      // Cookie CSRF avant POST (Sanctum SPA mode)
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      await axios.post(
        '/api/v1/profile/api-key',
        { api_key: apiKey.trim() },
        { withCredentials: true }
      );

      setStatus('success');
      setMessage('Clé API validée et enregistrée avec succès.');
      setApiKey('');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setStatus('error');
      setMessage(
        axiosErr.response?.data?.message ?? 'Clé API invalide ou expirée.'
      );
    }
  };

  const reset = () => {
    setStatus('idle');
    setMessage('');
  };

  return { apiKey, setApiKey, status, message, handleSubmit, reset };
}