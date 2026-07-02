import { useQuery } from '@tanstack/react-query';
import { resolveChatCodesBatch } from '@/api/item.api';
import { extractChatCodes } from '@/utils/gw2ChatCode';

/**
 * Résout en un seul appel tous les codes de chat GW2 présents dans un
 * message du forum — alimente le rendu enrichi (ChatCodeReference).
 */
export function useResolveChatCodes(content: string) {
  const codes = extractChatCodes(content);
  const stableKey = [...codes].sort().join(',');

  return useQuery({
    queryKey: ['forum-chat-codes', stableKey],
    queryFn: () => resolveChatCodesBatch(codes),
    enabled: codes.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
