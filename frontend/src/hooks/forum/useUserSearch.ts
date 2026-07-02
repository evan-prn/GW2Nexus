import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/api/item.api';

/** Autocomplétion `@` de l'éditeur forum. */
export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['users-search', query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}
