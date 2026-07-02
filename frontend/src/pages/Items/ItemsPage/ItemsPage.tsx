import { useMemo, useState } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import { useItemsSearch } from '@/hooks/items/useItemsSearch';
import ItemSearchBar from '@/components/items/ItemSearchBarComponent/ItemSearchBar';
import ItemFilterPanel from '@/components/items/ItemFilterPanelComponent/ItemFilterPanel';
import ItemGrid from '@/components/items/ItemGridComponent/ItemGrid';
import type { ItemFilters } from '@/types/item.types';
import styles from './ItemsPage.module.css';

export default function ItemsPage() {
  usePageTitle('Encyclopédie des objets');

  const [filters, setFilters] = useState<ItemFilters>({ q: '' });

  const searchFilters = useMemo<Omit<ItemFilters, 'page' | 'per_page'>>(() => ({
    q: filters.q,
    sort: filters.sort,
    type: filters.type,
    rarity: filters.rarity,
    binding: filters.binding,
    weapon_type: filters.weapon_type,
    armor_type: filters.armor_type,
    armor_weight: filters.armor_weight,
    stat_set_id: filters.stat_set_id,
    level_min: filters.level_min,
    level_max: filters.level_max,
    profession: filters.profession,
    game_type: filters.game_type,
  }), [filters]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useItemsSearch(searchFilters);

  const items = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const total = data?.pages[0]?.meta.total ?? 0;
  const facets = data?.pages[0]?.facets;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Encyclopédie des objets</h1>
          <p className={styles.subtitle}>
            {total > 0 ? `${total.toLocaleString('fr-FR')} objets référencés` : 'Recherchez parmi le catalogue complet de Guild Wars 2'}
          </p>
        </div>
        <div className={styles.searchWrap}>
          <ItemSearchBar value={filters.q ?? ''} onChange={(q) => setFilters((f) => ({ ...f, q }))} />
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ItemFilterPanel filters={filters} facets={facets} onChange={setFilters} />
        </aside>

        <div className={styles.results}>
          {isLoading ? (
            <p className={styles.hint}>Chargement des objets…</p>
          ) : items.length === 0 ? (
            <p className={styles.hint}>Aucun objet ne correspond à ces critères.</p>
          ) : (
            <ItemGrid
              items={items}
              hasNextPage={Boolean(hasNextPage)}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={() => void fetchNextPage()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
