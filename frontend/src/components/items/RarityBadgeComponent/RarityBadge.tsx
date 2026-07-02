import { getRarityColor, getRarityLabel } from '@/utils/gw2Rarity';
import styles from './RarityBadge.module.css';

interface RarityBadgeProps {
  rarity: string;
  compact?: boolean;
}

export default function RarityBadge({ rarity, compact = false }: RarityBadgeProps) {
  const color = getRarityColor(rarity);

  return (
    <span
      className={compact ? styles.badgeCompact : styles.badge}
      style={{ color, borderColor: color, backgroundColor: `${color}1A` }}
    >
      {getRarityLabel(rarity)}
    </span>
  );
}
