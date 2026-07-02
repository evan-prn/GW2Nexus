import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItemFavorite, removeItemFavorite } from '@/api/item.api';
import type { ApiDataResponse, Item } from '@/types/item.types';

/** Ajout/retrait des favoris avec mise à jour optimiste de la fiche objet en cache. */
export function useItemFavorite(gw2Id: number) {
  const queryClient = useQueryClient();
  const queryKey = ['item-detail', gw2Id];

  const applyOptimistic = (isFavorited: boolean) => {
    const previous = queryClient.getQueryData<ApiDataResponse<Item>>(queryKey);

    queryClient.setQueryData<ApiDataResponse<Item>>(queryKey, (current) =>
      current
        ? {
            ...current,
            data: {
              ...current.data,
              is_favorited: isFavorited,
              favorites_count: (current.data.favorites_count ?? 0) + (isFavorited ? 1 : -1),
            },
          }
        : current,
    );

    return previous;
  };

  const addMutation = useMutation({
    mutationFn: () => addItemFavorite(gw2Id),
    onMutate: () => applyOptimistic(true),
    onError: (_err, _vars, previous) => {
      if (previous) queryClient.setQueryData(queryKey, previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeItemFavorite(gw2Id),
    onMutate: () => applyOptimistic(false),
    onError: (_err, _vars, previous) => {
      if (previous) queryClient.setQueryData(queryKey, previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    addFavorite: addMutation.mutateAsync,
    removeFavorite: removeMutation.mutateAsync,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
