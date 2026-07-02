import { Fragment } from 'react';
import { useResolveChatCodes } from '@/hooks/forum/useResolveChatCodes';
import ChatCodeReference from '@/components/forum/ChatCodeReferenceComponent/ChatCodeReference';
import { CHAT_CODE_GLOBAL_PATTERN } from '@/utils/gw2ChatCode';
import styles from './ForumContent.module.css';

interface ForumContentProps {
  content: string;
}

const MENTION_PATTERN = /@[\p{L}0-9_-]{2,32}/gu;

/**
 * Rendu enrichi du contenu d'un message forum : les codes de chat GW2
 * `[&...]` deviennent des puces cliquables (icône + nom + couleur de
 * rareté), résolues en un seul appel batch et mises en cache. Le stockage
 * reste du texte brut — seul l'affichage change.
 *
 * Les mentions `@Pseudo` sont mises en valeur visuellement. Comme le site
 * n'a pas encore de page de profil public par utilisateur, elles ne sont
 * pas liées pour l'instant — l'autocomplétion `@` de l'éditeur garantit
 * déjà l'orthographe correcte du pseudo.
 */
export default function ForumContent({ content }: ForumContentProps) {
  const { data } = useResolveChatCodes(content);

  const combinedPattern = new RegExp(
    `(${CHAT_CODE_GLOBAL_PATTERN.source})|(${MENTION_PATTERN.source})`,
    'gu',
  );

  const segments: Array<{ type: 'text' | 'code' | 'mention'; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: match[1] ? 'code' : 'mention', value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return (
    <p className={styles.content}>
      {segments.map((segment, index) => {
        if (segment.type === 'mention') {
          return <strong key={index} className={styles.mention}>{segment.value}</strong>;
        }

        if (segment.type === 'code') {
          const item = data?.data?.[segment.value];
          return item ? (
            <ChatCodeReference key={index} item={item} />
          ) : (
            <Fragment key={index}>{segment.value}</Fragment>
          );
        }

        return <Fragment key={index}>{segment.value}</Fragment>;
      })}
    </p>
  );
}
