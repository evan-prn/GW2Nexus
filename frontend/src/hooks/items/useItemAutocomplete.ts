import { useQuery } from '@tanstack/react-query';
import { fetchItemAutocomplete } from '@/api/item.api';

/** Suggestions instantanées — barre de recherche ET autocomplétion `#` du forum. */
export function useItemAutocomplete(query: string) {
  return useQuery({
    queryKey: ['items-autocomplete', query],
    queryFn: () => fetchItemAutocomplete(query),
    enabled: query.trim().length >= 2,
    staleTime: 60 * 1000,
  });
}
