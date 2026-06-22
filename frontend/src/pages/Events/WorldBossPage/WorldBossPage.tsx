// =============================================================
// pages/Events/WorldBossPage/WorldBossPage.tsx
// Timer World Boss — liste tous les world bosses GW2 Core Tyria
// Route : /events/world-boss
// =============================================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_GROUPS } from '@/data/events.data';
import { useEventTimer, useServerClock, formatCountdown, formatLocalTime } from '@/hooks/event/useEventTimer';
import { useGw2BossImages } from '@/hooks/event/useGw2BossImages';
import { useGw2ItemIcons } from '@/hooks/event/useGw2ItemIcons';
import {
  WORLD_BOSS_WIKI_ARTICLES,
  REWARD_WIKI_ARTICLES,
  REWARD_ITEM_IDS,
  resolveRewardIcon,
} from '@/api/gw2Images';
import usePageTitle from '@/hooks/usePageTitle';
import styles from './WorldBossPage.module.css';
import type { GW2Event, EventState } from '@/types/events.types';

// ─────────────────────────────────────────────────────────────
// Extraction des world bosses depuis les données
// ─────────────────────────────────────────────────────────────

interface WorldBossEntry {
  event: GW2Event;
  zoneName: string;
  zoneIcon: string;
  zoneColor: string;
}

const WORLD_BOSS_ENTRIES: WorldBossEntry[] = EVENT_GROUPS
  .find((g) => g.id === 'world_bosses')
  ?.zones.flatMap((zone) =>
    zone.events.map((event) => ({
      event,
      zoneName: zone.name,
      zoneIcon: zone.icon,
      zoneColor: zone.color,
    })),
  ) ?? [];

const WORLD_BOSS_EVENTS: GW2Event[] = WORLD_BOSS_ENTRIES.map((e) => e.event);

// Collecte de tous les titres d'articles à charger : boss + items de récompenses
const ALL_BOSS_ARTICLES   = Object.values(WORLD_BOSS_WIKI_ARTICLES);
const ALL_REWARD_ARTICLES = Object.values(REWARD_WIKI_ARTICLES);
const ALL_WIKI_ARTICLES: string[] = Array.from(new Set([...ALL_BOSS_ARTICLES, ...ALL_REWARD_ARTICLES]));

// Item IDs GW2 pour les icônes de récompenses (⚔️ etc.)
const ALL_REWARD_ITEM_IDS = Object.values(REWARD_ITEM_IDS);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const STATUS_ORDER: Record<string, number> = { active: 0, upcoming: 1, idle: 2 };

// ─────────────────────────────────────────────────────────────
// Composant portrait boss
// ─────────────────────────────────────────────────────────────

interface BossPortraitProps {
  eventId: string;
  fallbackIcon: string;
  wikiImages: Record<string, string> | undefined;
}

const BossPortrait: React.FC<BossPortraitProps> = ({ eventId, fallbackIcon, wikiImages }) => {
  const article  = WORLD_BOSS_WIKI_ARTICLES[eventId];
  const imageUrl = article ? wikiImages?.[article] : undefined;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        className={styles.bossPortrait}
        width="36"
        height="36"
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }

  return (
    <span className={styles.bossPortraitPlaceholder} aria-hidden="true">
      {fallbackIcon}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Composant icône de récompense
// ─────────────────────────────────────────────────────────────

interface RewardIconProps {
  emoji: string;
  name: string;
  wikiImages: Record<string, string> | undefined;
  itemIcons:  Record<number, string> | undefined;
}

const RewardIcon: React.FC<RewardIconProps> = ({ emoji, name, wikiImages, itemIcons }) => {
  const url = resolveRewardIcon(emoji, wikiImages, itemIcons);

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        title={name}
        className={styles.rewardImg}
        width="24"
        height="24"
        loading="lazy"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }

  return (
    <span className={styles.reward} title={name} aria-hidden="true">
      {emoji}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Composant ligne de boss
// ─────────────────────────────────────────────────────────────

interface BossRowProps {
  entry:      WorldBossEntry;
  state:      EventState;
  wikiImages: Record<string, string> | undefined;
  itemIcons:  Record<number, string> | undefined;
  onClick:    () => void;
}

const BossRow: React.FC<BossRowProps> = ({ entry, state, wikiImages, itemIcons, onClick }) => {
  const isActive   = state.status === 'active';
  const isUpcoming = state.status === 'upcoming';

  const rowClass = [
    styles.row,
    isActive   ? styles.rowActive   : '',
    isUpcoming ? styles.rowUpcoming : '',
  ].join(' ');

  return (
    <tr
      className={rowClass}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${entry.event.name} — ${isActive ? 'En cours' : isUpcoming ? 'Bientôt' : 'Inactif'}. Voir le guide.`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Boss */}
      <td className={styles.tdBoss}>
        <BossPortrait
          eventId={entry.event.id}
          fallbackIcon={entry.zoneIcon}
          wikiImages={wikiImages}
        />
        <span className={styles.bossName}>{entry.event.name}</span>
        {isActive   && <span className={styles.tagActive}   aria-hidden="true">EN COURS</span>}
        {isUpcoming && <span className={styles.tagUpcoming} aria-hidden="true">BIENTÔT</span>}
      </td>

      {/* Zone */}
      <td className={styles.tdZone}>
        <span className={styles.zoneBar} style={{ background: entry.zoneColor }} aria-hidden="true" />
        {entry.zoneName}
      </td>

      {/* Prochain spawn */}
      <td className={styles.tdTimer}>
        <div className={styles.timerBlock}>
          <span className={[
            styles.countdown,
            isActive   ? styles.countdownActive   : '',
            isUpcoming ? styles.countdownUpcoming : '',
          ].join(' ')}>
            {isActive
              ? formatCountdown(state.secondsRemaining) + ' restant'
              : formatCountdown(state.secondsUntilStart)}
          </span>
          <span className={styles.nextTime}>
            {isActive ? 'Actif' : `à ${formatLocalTime(state.nextStartLocal)}`}
          </span>
        </div>
      </td>

      {/* Récompenses */}
      <td className={styles.tdRewards}>
        {entry.event.rewards?.map((r, i) => (
          <RewardIcon
            key={i}
            emoji={r.icon}
            name={r.name}
            wikiImages={wikiImages}
            itemIcons={itemIcons}
          />
        )) ?? <span className={styles.rewardNone} aria-hidden="true">—</span>}
      </td>

      {/* Caret */}
      <td className={styles.tdCaret} aria-hidden="true">›</td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────

const WorldBossPage: React.FC = () => {
  usePageTitle('Timer World Boss');
  const navigate = useNavigate();
  const { utcTime, localTime } = useServerClock();

  const states = useEventTimer(WORLD_BOSS_EVENTS);

  // Chargement groupé : boss portraits + icônes de récompenses en une seule requête wiki
  const { data: wikiImages } = useGw2BossImages(ALL_WIKI_ARTICLES);

  // Chargement des icônes via l'API GW2 (⚔️ exotique, etc.)
  const { data: itemIcons } = useGw2ItemIcons(ALL_REWARD_ITEM_IDS);

  // Fusionner entries + states puis trier : actifs > bientôt > idle (par countdown)
  const sorted = useMemo(() => {
    return WORLD_BOSS_ENTRIES
      .map((entry, i) => ({ entry, state: states[i] }))
      .sort((a, b) => {
        const orderDiff = STATUS_ORDER[a.state.status] - STATUS_ORDER[b.state.status];
        if (orderDiff !== 0) return orderDiff;
        return a.state.secondsUntilStart - b.state.secondsUntilStart;
      });
  }, [states]);

  const activeCount   = states.filter((s) => s.status === 'active').length;
  const upcomingCount = states.filter((s) => s.status === 'upcoming').length;

  return (
    <main className={styles.page}>

      {/* ── En-tête ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <button
            className={styles.backBtn}
            onClick={() => navigate('/events')}
            aria-label="Retour aux méta-événements"
          >
            ← Événements
          </button>
          <h1 className={styles.title}>
            <span className={styles.titleIcon} aria-hidden="true">🐉</span>
            Timer World Boss
          </h1>
          <p className={styles.subtitle}>
            Tyrie Centrale — {WORLD_BOSS_ENTRIES.length} world bosses
          </p>
        </div>

        {/* Clocks + stats */}
        <div className={styles.clocks} aria-label="Horloges serveur">
          <div className={styles.clockBlock}>
            <span className={styles.clockLabel}>Serveur GW2</span>
            <span className={styles.clockTime} aria-live="off">{utcTime} UTC</span>
          </div>
          <div className={styles.clockDivider} aria-hidden="true" />
          <div className={styles.clockBlock}>
            <span className={styles.clockLabel}>Heure locale</span>
            <span className={styles.clockTime} aria-live="off">{localTime}</span>
          </div>
          <div className={styles.clockDivider} aria-hidden="true" />
          <div className={styles.clockBlock}>
            <span className={styles.clockLabel}>En cours</span>
            <span
              className={[styles.clockTime, activeCount > 0 ? styles.clockActive : ''].join(' ')}
              aria-live="polite"
              aria-atomic="true"
            >
              {activeCount}
            </span>
          </div>
          <div className={styles.clockBlock}>
            <span className={styles.clockLabel}>Bientôt</span>
            <span
              className={[styles.clockTime, upcomingCount > 0 ? styles.clockUpcoming : ''].join(' ')}
              aria-live="polite"
              aria-atomic="true"
            >
              {upcomingCount}
            </span>
          </div>
        </div>
      </header>

      {/* ── Tableau ──────────────────────────────────────────── */}
      <div className={styles.tableWrapper} role="region" aria-label="Liste des world bosses">
        <table className={styles.table}>
          <caption className="sr-only">World bosses de Tyrie Centrale avec horaires en temps réel</caption>
          <thead>
            <tr className={styles.thead}>
              <th className={styles.thBoss} scope="col">Boss</th>
              <th className={styles.thZone} scope="col">Zone</th>
              <th className={styles.thTimer} scope="col">Prochain spawn</th>
              <th className={styles.thRewards} scope="col">Récompenses</th>
              <th className={styles.thCaret} scope="col" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ entry, state }) => (
              <BossRow
                key={entry.event.id}
                entry={entry}
                state={state}
                wikiImages={wikiImages}
                itemIcons={itemIcons}
                onClick={() => navigate(`/events/${entry.event.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.disclaimer}>
        Horaires basés sur le temps serveur GW2 (UTC) — cliquez sur un boss pour le guide complet.
      </p>
    </main>
  );
};

export default WorldBossPage;
