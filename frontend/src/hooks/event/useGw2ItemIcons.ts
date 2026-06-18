// frontend/src/hooks/event/useGw2ItemIcons.ts
// Charge les icônes d'items GW2 via l'API officielle /v2/items.

import { useQuery } from '@tanstack/react-query';
import { fetchGw2ItemIcons } from '@/api/gw2Images';

/**
 * Charge les URLs d'icônes d'items GW2 via l'API officielle.
 * @param itemIds - Liste d'item IDs GW2 (ex: [30703])
 * @returns Record<itemId, iconUrl>
 */
export function useGw2ItemIcons(itemIds: number[]) {
  const stableKey = [...itemIds].sort((a, b) => a - b).join(',');
  return useQuery({
    queryKey: ['gw2-item-icons', stableKey],
    queryFn:  () => fetchGw2ItemIcons(itemIds),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime:    24 * 60 * 60 * 1000,
    retry:     1,
    enabled:   itemIds.length > 0,
  });
}
