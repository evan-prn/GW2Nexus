// =============================================================
// hooks/event/useWorldBossStatus.ts
// Récupère les world bosses déjà tués aujourd'hui via l'API GW2
//
// Nécessite une clé API utilisateur avec le scope "progression".
// Le token Bearer est injecté automatiquement par httpClient.
// =============================================================

import { useState, useEffect } from 'react';
import { fetchWorldBossStatus } from '@/api/events.api';
import useAuthStore from '@/store/authStore';

interface WorldBossStatusResult {
  data: Set<string> | null;
  isLoading: boolean;
  isError: boolean;
}

export const useWorldBossStatus = (): WorldBossStatusResult => {
  const apiKey = useAuthStore((s) => s.user?.api_key ?? null);

  const [data, setData]         = useState<Set<string> | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError]     = useState<boolean>(false);

  useEffect(() => {
    // Pas de clé API — on ne tente pas l'appel
    if (!apiKey) {
      setData(null);
      return;
    }

    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(false);

      try {
        const ids = await fetchWorldBossStatus();
        if (!cancelled) setData(new Set(ids));
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    // Cleanup — évite les setState sur un composant démonté
    return () => { cancelled = true; };
  }, [apiKey]);

  return { data, isLoading, isError };
};