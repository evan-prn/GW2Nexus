import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { ItemSummary } from '@/types/item.types';
import { getRarityColor } from '@/utils/gw2Rarity';
import RarityBadge from '@/components/items/RarityBadgeComponent/RarityBadge';
import styles from './ItemCard.module.css';

interface ItemCardProps {
  item: ItemSummary;
}

function ItemCard({ item }: ItemCardProps) {
  const rarityColor = getRarityColor(item.rarity);

  return (
    <Link
      to={`/objets/${item.gw2_id}`}
      className={styles.card}
      style={{ borderColor: `${rarityColor}40` }}
    >
      <div className={styles.iconWrap} style={{ borderColor: rarityColor }}>
        {item.icon_url ? (
          <img src={item.icon_url} alt="" width="48" height="48" loading="lazy" className={styles.icon} />
        ) : (
          <div className={styles.iconPlaceholder} aria-hidden="true">?</div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.name} style={{ color: rarityColor }}>{item.name}</span>
        <div className={styles.meta}>
          <RarityBadge rarity={item.rarity} compact />
          <span className={styles.type}>{item.type}</span>
          {item.level > 0 && <span className={styles.level}>Niv. {item.level}</span>}
        </div>
      </div>
    </Link>
  );
}

export default memo(ItemCard);
