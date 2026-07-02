import { useQuery } from '@tanstack/react-query';
import { fetchItemDetail } from '@/api/item.api';

export function useItemDetail(gw2Id: number | undefined) {
  return useQuery({
    queryKey: ['item-detail', gw2Id],
    queryFn: () => fetchItemDetail(gw2Id as number),
    enabled: gw2Id !== undefined,
    staleTime: 5 * 60 * 1000,
  });
}
