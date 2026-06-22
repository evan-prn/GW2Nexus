// =============================================================
// pages/Events/EventDetailPage/EventDetailPage.tsx
// Page de détail d'un méta-événement GW2
// Route : /events/:eventId
// =============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { findEventById } from '@/data/findEvent.data';
import { useWorldBossStatus } from '@/hooks/event/useWorldBossStatus';
import { useGw2BossImages } from '@/hooks/event/useGw2BossImages';
import { useGw2ItemIcons } from '@/hooks/event/useGw2ItemIcons';
import {
  WORLD_BOSS_WIKI_ARTICLES,
  REWARD_WIKI_ARTICLES,
  REWARD_ITEM_IDS,
  resolveRewardIcon,
} from '@/api/gw2Images';
import styles from './EventDetailPage.module.css';

// ─────────────────────────────────────────────────────────────
// Utilitaires locaux
// ─────────────────────────────────────────────────────────────

const nowUtcMinutes = (): number => {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
};

const fmt = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// ─────────────────────────────────────────────────────────────
// Composant
// ─────────────────────────────────────────────────────────────

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  // ── Données statiques ────────────────────────────────────────
  const found = useMemo(() => findEventById(eventId ?? ''), [eventId]);

  // ── Statut API GW2 ───────────────────────────────────────────
  const { data: killedToday, isLoading: statusLoading } = useWorldBossStatus();

  // ── Portrait boss ────────────────────────────────────────────
  const bossArticle = eventId ? WORLD_BOSS_WIKI_ARTICLES[eventId] : undefined;
  const { data: bossImages } = useGw2BossImages(bossArticle ? [bossArticle] : []);
  const bossImageUrl = bossArticle ? bossImages?.[bossArticle] : undefined;

  // ── Icônes de récompenses ────────────────────────────────────
  // On collecte les titres wiki et item IDs uniques pour cet événement
  const rewardEmojis: string[] = useMemo(
    () => [...new Set(found?.event.rewards?.map((r) => r.icon) ?? [])],
    [found],
  );

  const rewardWikiTitles = useMemo(
    () => rewardEmojis.flatMap((e) => (REWARD_WIKI_ARTICLES[e] ? [REWARD_WIKI_ARTICLES[e]] : [])),
    [rewardEmojis],
  );
  const rewardItemIds = useMemo(
    () => rewardEmojis.flatMap((e) => (REWARD_ITEM_IDS[e] ? [REWARD_ITEM_IDS[e]] : [])),
    [rewardEmojis],
  );

  const { data: rewardWikiImages } = useGw2BossImages(rewardWikiTitles);
  const { data: rewardItemIcons }  = useGw2ItemIcons(rewardItemIds);

  // ── Heure UTC courante ───────────────────────────────────────
  const currentMinutes = nowUtcMinutes();

  // ── 404 ─────────────────────────────────────────────────────
  if (!found) {
    return (
      <div className={styles.notFound} role="alert">
        <p>Événement introuvable.</p>
        <button onClick={() => navigate('/events')}>← Retour</button>
      </div>
    );
  }

  const { event, zone, group } = found;

  // ── Statut "tué aujourd'hui" ─────────────────────────────────
  const isKilledToday =
    event.gw2ApiId != null && killedToday?.has(event.gw2ApiId) === true;

  // ── Calcul des slots du jour avec statut ─────────────────────
  const slotsWithStatus = event.slots.map((slot) => {
    const end = slot.startMinutes + slot.durationMinutes;
    const isActive  = currentMinutes >= slot.startMinutes && currentMinutes < end;
    const isUpcoming =
      !isActive &&
      slot.startMinutes > currentMinutes &&
      slot.startMinutes - currentMinutes <= 60;
    return { ...slot, isActive, isUpcoming };
  });

  return (
    <div className={styles.page}>

      {/* ── Retour ─────────────────────────────────────────── */}
      <button
        className={styles.back}
        onClick={() => navigate('/events')}
        aria-label="Retour aux événements"
      >
        ← Retour aux événements
      </button>

      {/* ── En-tête ────────────────────────────────────────── */}
      <header className={styles.header}>

        {/* Portrait boss (world bosses uniquement) */}
        {bossImageUrl && (
          <div className={styles.bossPortraitWrap}>
            <img
              src={bossImageUrl}
              alt={event.name}
              className={styles.bossPortrait}
              width="120"
              height="120"
              loading="lazy"
            />
          </div>
        )}

        <div className={styles.headerMeta}>
          <span className={styles.groupBadge} style={{ borderColor: zone.color }}>
            {group.label}
          </span>
          <span className={styles.zoneName}>{zone.name}</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.icon} aria-hidden="true">{zone.icon}</span>
          {event.name}
        </h1>

        {/* Statut tué aujourd'hui */}
        {event.gw2ApiId && (
          <div className={styles.killStatus} aria-live="polite">
            {statusLoading ? (
              <span className={styles.killPending}>Vérification…</span>
            ) : isKilledToday ? (
              <span className={styles.killDone}>✓ Déjà tué aujourd'hui</span>
            ) : (
              <span className={styles.killPending}>✗ Pas encore tué aujourd'hui</span>
            )}
          </div>
        )}
      </header>

      {/* ── Corps ──────────────────────────────────────────── */}
      <div className={styles.body}>

        {/* ── Récompenses ──────────────────────────────────── */}
        {event.rewards && event.rewards.length > 0 && (
          <section className={styles.section} aria-labelledby="rewards-title">
            <h2 id="rewards-title" className={styles.sectionTitle}>Récompenses possibles</h2>
            <ul className={styles.rewardList} role="list">
              {event.rewards.map((r, i) => {
                const iconUrl = resolveRewardIcon(r.icon, rewardWikiImages, rewardItemIcons);
                return (
                  <li key={i} className={styles.rewardItem}>
                    <span className={styles.rewardIcon} aria-hidden="true">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt=""
                          width="32"
                          height="32"
                          className={styles.rewardIconImg}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        r.icon
                      )}
                    </span>
                    <span className={styles.rewardName}>{r.name}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ── Horaires du jour ─────────────────────────────── */}
        <section className={styles.section} aria-labelledby="schedule-title">
          <h2 id="schedule-title" className={styles.sectionTitle}>Horaires du jour (UTC)</h2>
          <div className={styles.slotList} role="list">
            {slotsWithStatus.map((slot, i) => (
              <div
                key={i}
                role="listitem"
                className={[
                  styles.slot,
                  slot.isActive   ? styles.slotActive   : '',
                  slot.isUpcoming ? styles.slotUpcoming  : '',
                ].join(' ')}
              >
                <span className={styles.slotTime}>{fmt(slot.startMinutes)}</span>
                <span className={styles.slotSep} aria-hidden="true">→</span>
                <span className={styles.slotTime}>
                  {fmt(slot.startMinutes + slot.durationMinutes)}
                </span>
                {slot.isActive && (
                  <span className={styles.slotTag} aria-label="En cours actuellement">EN COURS</span>
                )}
                {slot.isUpcoming && (
                  <span className={styles.slotTagUpcoming} aria-label="Dans moins d'une heure">BIENTÔT</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Guide ────────────────────────────────────────── */}
        {event.guide && event.guide.length > 0 && (
          <section className={styles.section} aria-labelledby="guide-title">
            <h2 id="guide-title" className={styles.sectionTitle}>Guide — Comment le compléter</h2>
            <ol className={styles.guideList}>
              {event.guide.map((step) => (
                <li key={step.step} className={styles.guideStep}>
                  <div className={styles.guideStepNumber} aria-hidden="true">{step.step}</div>
                  <div className={styles.guideStepContent}>
                    <p className={styles.guideStepTitle}>{step.title}</p>
                    <p className={styles.guideStepDesc}>{step.description}</p>
                    {step.tip && (
                      <p className={styles.guideStepTip}>
                        <span className={styles.guideTipIcon} aria-hidden="true">💡</span>
                        {step.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Lien wiki ────────────────────────────────────── */}
        {event.wikiUrl && (
          <section className={styles.section} aria-labelledby="resources-title">
            <h2 id="resources-title" className={styles.sectionTitle}>Ressources</h2>
            <a
              className={styles.wikiLink}
              href={event.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Voir ${event.name} sur le wiki GW2 (ouvre un nouvel onglet)`}
            >
              Voir sur le wiki GW2 ↗
            </a>
          </section>
        )}

      </div>
    </div>
  );
}
