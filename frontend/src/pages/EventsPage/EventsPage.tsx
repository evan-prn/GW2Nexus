// =============================================================
// pages/EventsPage/EventsPage.tsx
// Page principale du timer d'événements GW2
//
// Orchestration complète :
//   1. Filtres par expansion (JW / World Bosses / HoT / ...)
//   2. TimelineHeader sticky (horloges + créneaux)
//   3. Groupes d'expansion avec leurs EventZoneSection
// =============================================================

import React, { useState, useMemo } from 'react';
import { EVENT_GROUPS } from '@/data/events.data';
import { useTimeline } from '@/hooks/event/useEventTimer';
import TimelineHeader from '@/components/events/TimeLineHeaderComponent/TimeLineHeader';
import EventZoneSection from '@/components/events/EventZoneSectionComponent/EventZoneSection';
import usePageTitle from '@/hooks/usePageTitle';
import styles from './EventsPage.module.css';

const EventsPage: React.FC = () => {
  // ── Titre de l'onglet navigateur ─────────────────────────────────────
  usePageTitle('Événements');

  // ── Filtre actif (null = tout afficher) ──────────────────────────────
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // ── Créneaux de la timeline (mis à jour toutes les 30s) ──────────────
  const timelineSlots = useTimeline();

  // ── Groupes filtrés ──────────────────────────────────────────────────
  const visibleGroups = useMemo(
    () =>
      activeFilter === null
        ? EVENT_GROUPS
        : EVENT_GROUPS.filter((g) => g.id === activeFilter),
    [activeFilter],
  );

  return (
    <main className={styles.page}>
      {/* ── En-tête de la page ───────────────────────────────────────── */}
      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>Événements</h1>
          <p className={styles.pageSubtitle}>
            Timer des World Bosses &amp; Méta-Événements — Heure serveur GW2 (UTC)
          </p>
        </div>

        {/* ── Filtres par expansion ──────────────────────────────────── */}
        <nav className={styles.filters} aria-label="Filtrer par extension">
          {/* Bouton "Tout" */}
          <button
            className={`${styles.filterBtn} ${activeFilter === null ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(null)}
            aria-pressed={activeFilter === null}
          >
            Tout
          </button>

          {EVENT_GROUPS.map((group) => (
            <button
              key={group.id}
              className={`${styles.filterBtn} ${activeFilter === group.id ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(group.id)}
              aria-pressed={activeFilter === group.id}
            >
              {group.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Tableau principal ─────────────────────────────────────────── */}
      <div className={styles.timerWrapper}>
        {/* En-tête sticky : horloges + colonnes horaires */}
        <TimelineHeader timelineSlots={timelineSlots} />

        {/* Groupes d'expansion */}
        {visibleGroups.map((group) => (
          <div key={group.id} className={styles.expansionGroup}>
            {/* Titre du groupe avec séparateur */}
            <div className={styles.expansionTitle}>
              <span className={styles.expansionLine} />
              <span className={styles.expansionLabel}>{group.label}</span>
              <span className={styles.expansionLine} />
            </div>

            {/* Zones de l'expansion */}
            <div className={styles.zoneList}>
              {group.zones.map((zone) => (
                <EventZoneSection
                  key={zone.id}
                  zone={zone}
                  timelineSlots={timelineSlots}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Note informative ──────────────────────────────────────────── */}
      <p className={styles.disclaimer}>
        Les horaires sont basés sur le temps serveur GW2 (UTC) et peuvent être ajustés par ArenaNet.
      </p>
    </main>
  );
};

export default EventsPage;