import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemAutocomplete } from '@/hooks/items/useItemAutocomplete';
import { resolveChatCode } from '@/api/item.api';
import { looksLikeChatCode } from '@/utils/gw2ChatCode';
import { getRarityColor } from '@/utils/gw2Rarity';
import styles from './ItemSearchBar.module.css';

interface ItemSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Barre de recherche instantanée avec auto-complétion et reconnaissance
 * automatique des codes de chat GW2 (`[&...]`) — redirige directement
 * vers la fiche de l'objet quand un code valide est saisi.
 */
export default function ItemSearchBar({ value, onChange, placeholder }: ItemSearchBarProps) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const isChatCode = looksLikeChatCode(draft);
  const { data: autocomplete } = useItemAutocomplete(isChatCode ? '' : draft);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (isChatCode) {
      return;
    }

    debounceRef.current = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(debounceRef.current);
  }, [draft, isChatCode, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCodeError(null);

    if (!looksLikeChatCode(draft)) {
      onChange(draft);
      setOpen(false);
      return;
    }

    setResolving(true);
    try {
      const response = await resolveChatCode(draft);
      navigate(`/objets/${response.data.gw2_id}`);
      setDraft('');
      onChange('');
    } catch {
      setCodeError("Code de chat invalide, illisible, ou correspondant à une ressource pas encore prise en charge.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.icon} aria-hidden="true">{isChatCode ? '🔗' : '🔍'}</span>
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
            setCodeError(null);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder ?? 'Rechercher un objet, ou coller un code [&...]'}
          className={styles.input}
          aria-label="Recherche d'objets"
        />
        {resolving && <span className={styles.spinner} aria-hidden="true" />}
      </form>

      {codeError && <p className={styles.error}>{codeError}</p>}

      {open && !isChatCode && autocomplete?.data && autocomplete.data.length > 0 && (
        <ul className={styles.dropdown} role="listbox">
          {autocomplete.data.map((item) => (
            <li key={item.gw2_id}>
              <button
                type="button"
                className={styles.suggestion}
                onClick={() => navigate(`/objets/${item.gw2_id}`)}
              >
                {item.icon_url && <img src={item.icon_url} alt="" width="28" height="28" loading="lazy" />}
                <span style={{ color: getRarityColor(item.rarity) }}>{item.name}</span>
                <span className={styles.suggestionType}>{item.type}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
