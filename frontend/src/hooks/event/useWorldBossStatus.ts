// =============================================================
// hooks/event/useWorldBossStatus.ts
// Récupère les world bosses déjà tués aujourd'hui via l'API GW2
//
// Nécessite une clé API utilisateur avec le scope "progression".
// On vérifie has_api_key (booléen) — la clé en clair n'est jamais
// exposée côté frontend pour des raisons de sécurité.
// Le token Bearer est injecté automatiquement par httpClient.
// =============================================================

import { useState, useEffect } from 'react';
import { fetchWorldBossStatus } from '@/api/events.api';
import useAuthStore from '@/store/authStore';

interface WorldBossStatusResult {
  data:      Set<string> | null;
  isLoading: boolean;
  isError:   boolean;
}

export const useWorldBossStatus = (): WorldBossStatusResult => {
  // has_api_key indique si l'utilisateur a une clé API GW2 enregistrée
  // On ne récupère jamais la clé en clair depuis le store frontend
  const hasApiKey = useAuthStore((s: { user: { has_api_key: any; }; }) => s.user?.has_api_key ?? false);

  const [data,      setData]    = useState<Set<string> | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError,   setError]   = useState<boolean>(false);

  useEffect(() => {
    // Pas de clé API enregistrée — on ne tente pas l'appel GW2
    if (!hasApiKey) {
      setData(null);
      return;
    }

    let cancelled = false;

    const loadStatus = async () => {
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

    loadStatus();

    // Cleanup — évite les setState sur un composant démonté
    return () => { cancelled = true; };
  }, [hasApiKey]);

  return { data, isLoading, isError };
};