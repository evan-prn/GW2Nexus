import type { Item } from '@/types/item.types';
import styles from './ItemStatsBlock.module.css';

interface ItemStatsBlockProps {
  item: Item;
}

const ATTRIBUTE_LABELS_FR: Record<string, string> = {
  Power: 'Puissance',
  Precision: 'Précision',
  Toughness: 'Robustesse',
  Vitality: 'Vitalité',
  ConditionDamage: 'Dégâts par altération',
  Healing: 'Guérison',
  BoonDuration: 'Concentration',
  ConditionDuration: 'Expertise',
  CritDamage: 'Férocité',
};

export default function ItemStatsBlock({ item }: ItemStatsBlockProps) {
  const details = item.details ?? {};
  const hasWeaponStats = item.type === 'Weapon' && (details.min_power !== undefined || details.max_power !== undefined);
  const hasArmorStats = item.type === 'Armor' && details.defense !== undefined;
  const attributes = item.stat_set?.attributes ?? [];

  if (!hasWeaponStats && !hasArmorStats && attributes.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.title}>Statistiques</h2>

      <div className={styles.grid}>
        {hasWeaponStats && (
          <>
            <div className={styles.stat}>
              <span className={styles.label}>Dégâts</span>
              <span className={styles.value}>{String(details.min_power)} – {String(details.max_power)}</span>
            </div>
            {details.damage_type ? (
              <div className={styles.stat}>
                <span className={styles.label}>Type de dégâts</span>
                <span className={styles.value}>{String(details.damage_type)}</span>
              </div>
            ) : null}
          </>
        )}

        {hasArmorStats && (
          <div className={styles.stat}>
            <span className={styles.label}>Défense</span>
            <span className={styles.value}>{String(details.defense)}</span>
          </div>
        )}

        {attributes.map((attr) => (
          <div className={styles.stat} key={attr.attribute}>
            <span className={styles.label}>{ATTRIBUTE_LABELS_FR[attr.attribute] ?? attr.attribute}</span>
            <span className={styles.value}>
              {attr.value ?? 0}{attr.multiplier ? ` (×${attr.multiplier})` : ''}
            </span>
          </div>
        ))}
      </div>

      {item.stat_set?.name && (
        <p className={styles.statSetName}>Ensemble de statistiques : <strong>{item.stat_set.name}</strong></p>
      )}
    </section>
  );
}
