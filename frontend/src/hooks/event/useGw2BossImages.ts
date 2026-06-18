// frontend/src/hooks/event/useGw2BossImages.ts
// Charge les images depuis le wiki GW2 via pageimages (titre d'article).

import { useQuery } from '@tanstack/react-query';
import { fetchWikiPageImages } from '@/api/gw2Images';

/**
 * Charge les thumbnails depuis le wiki GW2 (MediaWiki pageimages).
 * @param articleTitles - Titres d'articles wiki (ex: ["Tequatl the Sunless"])
 * @returns Record<articleTitle, thumbnailUrl>
 */
export function useGw2BossImages(articleTitles: string[]) {
  const stableKey = [...articleTitles].sort().join(',');
  return useQuery({
    queryKey: ['gw2-wiki-images', stableKey],
    queryFn:  () => fetchWikiPageImages(articleTitles),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime:    24 * 60 * 60 * 1000,
    retry:     1,
    enabled:   articleTitles.length > 0,
  });
}
