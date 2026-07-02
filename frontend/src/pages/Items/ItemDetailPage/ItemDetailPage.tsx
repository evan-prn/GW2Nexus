import { useNavigate, useParams } from 'react-router-dom';
import usePageTitle from '@/hooks/usePageTitle';
import { useItemDetail } from '@/hooks/items/useItemDetail';
import RarityBadge from '@/components/items/RarityBadgeComponent/RarityBadge';
import FavoriteButton from '@/components/items/FavoriteButtonComponent/FavoriteButton';
import ItemStatsBlock from '@/components/items/ItemStatsBlockComponent/ItemStatsBlock';
import ItemObtainSection from '@/components/items/ItemObtainSectionComponent/ItemObtainSection';
import ItemCommentsSection from '@/components/items/ItemCommentsSectionComponent/ItemCommentsSection';
import { getRarityColor } from '@/utils/gw2Rarity';
import styles from './ItemDetailPage.module.css';

const BINDING_LABELS: Record<string, string> = {
  none: 'Non lié',
  account: 'Lié au compte',
  soulbound: 'Lié à l\'âme',
};

export default function ItemDetailPage() {
  const { gw2Id } = useParams<{ gw2Id: string }>();
  const navigate = useNavigate();
  const numericId = gw2Id ? Number(gw2Id) : undefined;
  const { data, isLoading, isError } = useItemDetail(numericId);
  const item = data?.data;

  usePageTitle(item?.name ?? 'Objet');

  if (isLoading) {
    return <div className={styles.hint}>Chargement de l'objet…</div>;
  }

  if (isError || !item) {
    return (
      <div className={styles.notFound} role="alert">
        <p>Objet introuvable.</p>
        <button onClick={() => navigate('/objets')}>← Retour à l'encyclopédie</button>
      </div>
    );
  }

  const rarityColor = getRarityColor(item.rarity);

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/objets')}>
        ← Retour à l'encyclopédie
      </button>

      <header className={styles.header}>
        {item.icon_url && (
          <div className={styles.iconWrap} style={{ borderColor: rarityColor }}>
            <img src={item.icon_url} alt={item.name} width="96" height="96" loading="lazy" />
          </div>
        )}

        <div className={styles.headerInfo}>
          <div className={styles.badges}>
            <RarityBadge rarity={item.rarity} />
            <span className={styles.typeBadge}>{item.type}</span>
            {item.level > 0 && <span className={styles.typeBadge}>Niveau {item.level}</span>}
          </div>

          <h1 className={styles.title} style={{ color: rarityColor }}>{item.name}</h1>

          {item.description && (
            <p className={styles.description} dangerouslySetInnerHTML={{ __html: sanitizeGw2Markup(item.description) }} />
          )}

          <div className={styles.quickFacts}>
            <span>{BINDING_LABELS[item.binding] ?? item.binding}</span>
            {item.vendor_value > 0 && <span>Valeur marchand : {item.vendor_value.toLocaleString('fr-FR')}</span>}
            {item.chat_link && <span className={styles.chatLink}>{item.chat_link}</span>}
          </div>

          <div className={styles.actions}>
            <FavoriteButton
              gw2Id={item.gw2_id}
              isFavorited={item.is_favorited ?? false}
              favoritesCount={item.favorites_count}
            />
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <ItemStatsBlock item={item} />
        <ItemObtainSection item={item} />
        <ItemCommentsSection gw2Id={item.gw2_id} />
      </div>
    </div>
  );
}

/**
 * L'API GW2 renvoie des descriptions avec un balisage propriétaire
 * `<c=@flavor>...</c>` (couleur/italique in-game). On échappe tout le HTML
 * par défaut (au cas où) puis on ne réactive que ce marqueur connu — jamais
 * de HTML arbitraire injecté tel quel, même depuis une source de confiance.
 */
function sanitizeGw2Markup(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/&lt;c=@[a-zA-Z]+&gt;/g, '<em>')
    .replace(/&lt;\/c&gt;/g, '</em>')
    .replace(/\n/g, '<br />');
}
