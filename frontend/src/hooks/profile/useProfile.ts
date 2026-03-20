// ═══════════════════════════════════════════════════════════════════
// src/hooks/profile/useProfile.ts
// Chargement des données GW2 (compte + personnages) via le backend proxy
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import type { Gw2Account, Gw2Character } from '@/data/profile.data';

// ─── Hook ────────────────────────────────────────────────────────────
export function useProfile() {
  const [gw2Data,    setGw2Data]    = useState<Gw2Account | null>(null);
  const [characters, setCharacters] = useState<Gw2Character[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);

  // ─── Fetch compte GW2 + personnages en parallèle ───────────────────
  useEffect(() => {
    const fetchGw2Data = async () => {
      setLoading(true);
      setError(false);
      try {
        const [accRes, charRes] = await Promise.all([
          fetch('/api/gw2/account',    { credentials: 'include' }),
          fetch('/api/gw2/characters', { credentials: 'include' }),
        ]);

        if (!accRes.ok || !charRes.ok) throw new Error('Réponse API invalide');

        const [account, chars] = await Promise.all([
          accRes.json(),
          charRes.json(),
        ]);

        setGw2Data(account);
        setCharacters(chars);
      } catch (err) {
        console.error('Erreur GW2 :', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGw2Data();
  }, []);

  return { gw2Data, characters, loading, error };
}