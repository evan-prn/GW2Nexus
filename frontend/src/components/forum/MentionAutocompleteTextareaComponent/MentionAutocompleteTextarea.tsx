import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, TextareaHTMLAttributes } from 'react';
import { useUserSearch } from '@/hooks/forum/useUserSearch';
import { useItemAutocomplete } from '@/hooks/items/useItemAutocomplete';
import { getRarityColor } from '@/utils/gw2Rarity';
import styles from './MentionAutocompleteTextarea.module.css';

type NativeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface MentionAutocompleteTextareaProps extends Omit<NativeTextareaProps, 'onChange'> {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface TriggerState {
  type: '@' | '#';
  query: string;
  start: number;
}

/**
 * `<textarea>` enrichi pour l'éditeur forum : déclenche une liste de
 * suggestions flottante sur `@` (mention d'utilisateur) et `#` (objet
 * GW2), insère le token texte correspondant à la sélection. Le format de
 * stockage (texte brut) ne change pas — voir ForumContent pour le rendu.
 *
 * Interface volontairement proche d'un <textarea> natif (value/onChange/ref)
 * pour remplacer les usages existants sans changer le code appelant.
 */
const MentionAutocompleteTextarea = forwardRef<HTMLTextAreaElement, MentionAutocompleteTextareaProps>(
  ({ value, onChange, ...rest }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

    const [trigger, setTrigger] = useState<TriggerState | null>(null);

    const userQuery = useUserSearch(trigger?.type === '@' ? trigger.query : '');
    const itemQuery = useItemAutocomplete(trigger?.type === '#' ? trigger.query : '');

    const detectTrigger = (text: string, cursor: number): TriggerState | null => {
      const uptoCursor = text.slice(0, cursor);
      const match = uptoCursor.match(/(?:^|\s)([@#])(\S{0,32})$/);
      if (!match) return null;

      const symbol = match[1] as '@' | '#';
      return { type: symbol, query: match[2], start: cursor - match[2].length - 1 };
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event);
      setTrigger(detectTrigger(event.target.value, event.target.selectionStart ?? event.target.value.length));
    };

    const refreshTriggerFrom = (target: HTMLTextAreaElement) => {
      setTrigger(detectTrigger(target.value, target.selectionStart ?? target.value.length));
    };

    const insertToken = (token: string) => {
      const el = innerRef.current;
      if (!el || !trigger) return;

      const before = value.slice(0, trigger.start);
      const cursor = el.selectionStart ?? value.length;
      const after = value.slice(cursor);
      const nextValue = `${before}${token} ${after}`;

      // Technique standard pour modifier programmatiquement un <textarea>
      // contrôlé par React : passer par le setter natif puis déclencher un
      // vrai événement 'input' — React le capte comme un onChange normal,
      // avec un event.target complet (contrairement à un objet event simulé
      // à la main, fragile si le composant appelant lit autre chose que .value).
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      nativeSetter?.call(el, nextValue);
      el.dispatchEvent(new Event('input', { bubbles: true }));

      setTrigger(null);

      requestAnimationFrame(() => {
        const nextCursor = before.length + token.length + 1;
        el.focus();
        el.setSelectionRange(nextCursor, nextCursor);
      });
    };

    const showUserSuggestions = trigger?.type === '@' && (userQuery.data?.data.length ?? 0) > 0;
    const showItemSuggestions = trigger?.type === '#' && (itemQuery.data?.data.length ?? 0) > 0;

    return (
      <div className={styles.wrapper}>
        <textarea
          {...rest}
          ref={innerRef}
          value={value}
          onChange={handleChange}
          onKeyUp={(event) => refreshTriggerFrom(event.currentTarget)}
          onClick={(event) => refreshTriggerFrom(event.currentTarget)}
          onBlur={() => setTimeout(() => setTrigger(null), 150)}
        />

        {showUserSuggestions && (
          <ul className={styles.dropdown} role="listbox">
            {userQuery.data!.data.map((mentionUser) => (
              <li key={mentionUser.id}>
                <button type="button" className={styles.suggestion} onClick={() => insertToken(`@${mentionUser.nom}`)}>
                  {mentionUser.avatar && <img src={mentionUser.avatar} alt="" width="22" height="22" />}
                  {mentionUser.nom}
                </button>
              </li>
            ))}
          </ul>
        )}

        {showItemSuggestions && (
          <ul className={styles.dropdown} role="listbox">
            {itemQuery.data!.data.map((item) => (
              <li key={item.gw2_id}>
                <button
                  type="button"
                  className={styles.suggestion}
                  disabled={!item.chat_link}
                  onClick={() => item.chat_link && insertToken(item.chat_link)}
                >
                  {item.icon_url && <img src={item.icon_url} alt="" width="22" height="22" />}
                  <span style={{ color: getRarityColor(item.rarity) }}>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

MentionAutocompleteTextarea.displayName = 'MentionAutocompleteTextarea';

export default MentionAutocompleteTextarea;
