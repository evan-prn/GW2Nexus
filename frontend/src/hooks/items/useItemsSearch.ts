import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchItems } from '@/api/item.api';
import type { ItemFilters } from '@/types/item.types';

const PER_PAGE = 30;

/**
 * Recherche/filtres/pagination de l'encyclopédie d'objets — scroll infini.
 * React Query annule automatiquement les requêtes obsolètes quand les
 * filtres changent rapidement (debounce géré par l'appelant, voir ItemsPage).
 */
export function useItemsSearch(filters: Omit<ItemFilters, 'page' | 'per_page'>) {
  return useInfiniteQuery({
    queryKey: ['items-search', filters],
    queryFn: ({ pageParam }) => fetchItems({ ...filters, page: pageParam, per_page: PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined,
    staleTime: 60 * 1000,
  });
}
