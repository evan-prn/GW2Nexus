import { Link } from 'react-router-dom';
import type { ItemSummary } from '@/types/item.types';
import { getRarityColor } from '@/utils/gw2Rarity';
import styles from './ChatCodeReference.module.css';

interface ChatCodeReferenceProps {
  item: ItemSummary;
}

/** Puce enrichie affichée à la place d'un code `[&...]` dans un message du forum. */
export default function ChatCodeReference({ item }: ChatCodeReferenceProps) {
  const color = getRarityColor(item.rarity);

  return (
    <Link
      to={`/objets/${item.gw2_id}`}
      className={styles.chip}
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}14` }}
      title={`${item.name} — ${item.type}, niveau ${item.level}`}
    >
      {item.icon_url && <img src={item.icon_url} alt="" width="18" height="18" loading="lazy" />}
      {item.name}
    </Link>
  );
}
