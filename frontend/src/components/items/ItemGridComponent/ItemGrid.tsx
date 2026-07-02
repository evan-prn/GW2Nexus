import { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ItemSummary } from '@/types/item.types';
import ItemCard from '@/components/items/ItemCardComponent/ItemCard';
import styles from './ItemGrid.module.css';

interface ItemGridProps {
  items: ItemSummary[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const CARD_MIN_WIDTH = 260;
const ROW_HEIGHT = 84;
const ROW_GAP = 10;

/**
 * Grille virtualisée (fenêtrage par ligne via @tanstack/react-virtual) +
 * scroll infini — garde le DOM léger même avec des milliers de résultats
 * chargés au fil du scroll.
 */
export default function ItemGrid({ items, hasNextPage, isFetchingNextPage, onLoadMore }: ItemGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const compute = () => setColumns(Math.max(1, Math.floor(el.clientWidth / CARD_MIN_WIDTH)));
    compute();

    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + ROW_GAP,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className={styles.viewport}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columns;
          const rowItems = items.slice(start, start + columns);

          return (
            <div
              key={virtualRow.key}
              className={styles.row}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: ROW_HEIGHT,
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            >
              {rowItems.map((item) => (
                <ItemCard key={item.gw2_id} item={item} />
              ))}
            </div>
          );
        })}
      </div>

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {isFetchingNextPage && (
        <p className={styles.loadingMore}>Chargement d'autres objets…</p>
      )}
    </div>
  );
}
