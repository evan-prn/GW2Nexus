import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { useItemFavorite } from '@/hooks/items/useItemFavorite';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  gw2Id: number;
  isFavorited: boolean;
  favoritesCount?: number;
}

export default function FavoriteButton({ gw2Id, isFavorited, favoritesCount }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { addFavorite, removeFavorite, isLoading } = useItemFavorite(gw2Id);

  if (!isAuthenticated) {
    return (
      <Link to="/login" className={styles.guestLink}>
        <span aria-hidden="true">☆</span> Connexion requise pour les favoris
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={isFavorited ? styles.buttonActive : styles.button}
      disabled={isLoading}
      onClick={() => (isFavorited ? removeFavorite() : addFavorite())}
      aria-pressed={isFavorited}
    >
      <span aria-hidden="true">{isFavorited ? '★' : '☆'}</span>
      {isFavorited ? 'Dans vos favoris' : 'Ajouter aux favoris'}
      {favoritesCount !== undefined && <span className={styles.count}>{favoritesCount}</span>}
    </button>
  );
}
