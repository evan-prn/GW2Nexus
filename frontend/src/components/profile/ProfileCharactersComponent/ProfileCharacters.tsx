// ═══════════════════════════════════════════════════════════════════
// src/components/profile/ProfileCharactersComponent/ProfileCharacters.tsx
// Grille des personnages GW2 avec profession et niveau
// ═══════════════════════════════════════════════════════════════════

import { PROFESSION_ICONS }   from '@/data/profile.data';
import type { Gw2Character }  from '@/data/profile.data';
import styles from './ProfileCharacters.module.css';

// ─── Props ───────────────────────────────────────────────────────────
interface ProfileCharactersProps {
  characters: Gw2Character[];
}

// ─── Composant ───────────────────────────────────────────────────────
export default function ProfileCharacters({ characters }: ProfileCharactersProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>🧙</span>
        <h2 className={styles.headerTitle}>Personnages</h2>
        <span className={styles.count}>{characters.length}</span>
      </div>

      <div className={styles.body}>
        {characters.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🗺️</span>
            <p className={styles.emptyText}>Aucun personnage trouvé</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {characters.map((char) => (
              <div key={char.name} className={styles.card}>
                {/* Icône profession */}
                <span className={styles.professionIcon}>
                  {PROFESSION_ICONS[char.profession] ?? '⚔️'}
                </span>
                <p className={styles.name}>{char.name}</p>
                <p className={styles.profession}>
                  {char.profession} — Niv. {char.level}
                </p>
                <p className={styles.meta}>
                  {char.race} / {char.gender}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}