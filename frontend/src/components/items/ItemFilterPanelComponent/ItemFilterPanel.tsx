import type { ItemFacets, ItemFilters } from '@/types/item.types';
import { getRarityColor, getRarityLabel, RARITY_ORDER } from '@/utils/gw2Rarity';
import styles from './ItemFilterPanel.module.css';

interface ItemFilterPanelProps {
  filters: ItemFilters;
  facets: ItemFacets | undefined;
  onChange: (filters: ItemFilters) => void;
}

const GW2_PROFESSIONS = [
  'Guardian', 'Warrior', 'Engineer', 'Ranger', 'Thief',
  'Elementalist', 'Mesmer', 'Necromancer', 'Revenant',
];

const BINDING_LABELS: Record<string, string> = {
  none: 'Non lié',
  account: 'Lié au compte',
  soulbound: 'Lié à l\'âme',
};

type MultiKey = 'type' | 'rarity' | 'binding' | 'weapon_type' | 'armor_type' | 'armor_weight';

function toggleValue(list: string[] | undefined, value: string): string[] {
  const current = list ?? [];
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

export default function ItemFilterPanel({ filters, facets, onChange }: ItemFilterPanelProps) {
  const update = (patch: Partial<ItemFilters>) => onChange({ ...filters, ...patch });

  const renderCheckboxGroup = (
    title: string,
    key: MultiKey,
    options: string[],
    formatLabel: (value: string) => string = (v) => v,
    formatColor?: (value: string) => string | undefined,
  ) => {
    if (options.length === 0) return null;

    return (
      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>{title}</legend>
        {options.map((option) => {
          const checked = (filters[key] ?? []).includes(option);
          const count = facets?.[key]?.[option];

          return (
            <label key={option} className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => update({ [key]: toggleValue(filters[key], option) } as Partial<ItemFilters>)}
              />
              <span style={{ color: formatColor?.(option) }}>{formatLabel(option)}</span>
              {count !== undefined && <span className={styles.count}>{count}</span>}
            </label>
          );
        })}
      </fieldset>
    );
  };

  const rarityOptions = facets?.rarity ? Object.keys(facets.rarity) : RARITY_ORDER;

  return (
    <div className={styles.panel}>
      {renderCheckboxGroup(
        'Rareté',
        'rarity',
        rarityOptions.sort((a, b) => RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b)),
        getRarityLabel,
        getRarityColor,
      )}

      {facets?.type && renderCheckboxGroup('Catégorie', 'type', Object.keys(facets.type).sort())}

      {facets?.weapon_type && renderCheckboxGroup('Type d\'arme', 'weapon_type', Object.keys(facets.weapon_type).sort())}

      {facets?.armor_type && renderCheckboxGroup('Emplacement d\'armure', 'armor_type', Object.keys(facets.armor_type).sort())}

      {facets?.armor_weight && renderCheckboxGroup('Poids d\'armure', 'armor_weight', Object.keys(facets.armor_weight).sort())}

      {renderCheckboxGroup('Liaison', 'binding', ['none', 'account', 'soulbound'], (v) => BINDING_LABELS[v] ?? v)}

      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>Niveau</legend>
        <div className={styles.levelRange}>
          <label>
            Min
            <input
              type="range"
              min={0}
              max={80}
              value={filters.level_min ?? 0}
              onChange={(e) => update({ level_min: Number(e.target.value) })}
            />
            <span>{filters.level_min ?? 0}</span>
          </label>
          <label>
            Max
            <input
              type="range"
              min={0}
              max={80}
              value={filters.level_max ?? 80}
              onChange={(e) => update({ level_max: Number(e.target.value) })}
            />
            <span>{filters.level_max ?? 80}</span>
          </label>
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupTitle}>Profession</legend>
        <select
          className={styles.select}
          value={filters.profession ?? ''}
          onChange={(e) => update({ profession: e.target.value || undefined })}
        >
          <option value="">Toutes</option>
          {GW2_PROFESSIONS.map((profession) => (
            <option key={profession} value={profession}>{profession}</option>
          ))}
        </select>
      </fieldset>

      <button
        type="button"
        className={styles.resetBtn}
        onClick={() => onChange({ q: filters.q })}
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
