// =============================================================
// pages/EventsPage/EventsPage.tsx — v2
// Page principale du timer d'événements GW2
// =============================================================

import React, { useState, useMemo } from 'react';
import { EVENT_GROUPS } from '@/data/events.data';
import { useTimeline, useEventTimer } from '@/hooks/event/useEventTimer';
import TimelineHeader from '@/components/events/TimeLineHeaderComponent/TimeLineHeader';
import EventZoneSection from '@/components/events/EventZoneSectionComponent/EventZoneSection';
import usePageTitle from '@/hooks/usePageTitle';
import styles from './EventsPage.module.css';
import type { EventExpansionGroup } from '@/types/events.types';

// ─────────────────────────────────────────────────────────────
// Sous-composant : un groupe d'expansion avec ses zones
// Extrait ici pour que le tri "zones actives en premier"
// soit recalculé indépendamment de chaque groupe.
// ─────────────────────────────────────────────────────────────

interface ExpansionGroupProps {
  group: EventExpansionGroup;
  timelineSlots: ReturnType<typeof useTimeline>;
}

const ExpansionGroupSection: React.FC<ExpansionGroupProps> = ({ group, timelineSlots }) => {
  // On calcule les états de TOUS les events du groupe pour savoir
  // quelles zones ont un event actif → elles remontent en premier.
  const allEvents = useMemo(
    () => group.zones.flatMap((z) => z.events),
    [group.zones],
  );
  const allStates = useEventTimer(allEvents);

  // Construire un Set des IDs d'events actifs pour le tri rapide
  const activeEventIds = useMemo(
    () => new Set(allStates.filter((s) => s.status === 'active').map((s) => s.event.id)),
    [allStates],
  );

  // Trier les zones : celles contenant un event actif remontent
  const sortedZones = useMemo(
    () =>
      [...group.zones].sort((a, b) => {
        const aHasActive = a.events.some((e) => activeEventIds.has(e.id)) ? 0 : 1;
        const bHasActive = b.events.some((e) => activeEventIds.has(e.id)) ? 0 : 1;
        return aHasActive - bHasActive;
      }),
    [group.zones, activeEventIds],
  );

  return (
    <div className={styles.expansionGroup}>
      {/* ── Titre séparateur ──────────────────────────────────── */}
      <div className={styles.expansionTitle}>
        <span className={styles.expansionLine} />
        <span className={styles.expansionLabel}>{group.label}</span>
        <span className={styles.expansionLine} />
      </div>

      {/* ── Zones ─────────────────────────────────────────────── */}
      <div className={styles.zoneList}>
        {sortedZones.map((zone) => (
          <EventZoneSection
            key={zone.id}
            zone={zone}
            timelineSlots={timelineSlots}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────

const EventsPage: React.FC = () => {
  usePageTitle('Événements');

  // Filtre actif (null = tout afficher)
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Créneaux de la timeline (mis à jour toutes les 30s)
  const timelineSlots = useTimeline();

  // Groupes visibles selon le filtre
  const visibleGroups = useMemo(
    () =>
      activeFilter === null
        ? EVENT_GROUPS
        : EVENT_GROUPS.filter((g) => g.id === activeFilter),
    [activeFilter],
  );

  return (
    <main className={styles.page}>

      {/* ── En-tête ──────────────────────────────────────────── */}
      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.pageTitle}>Événements</h1>
          <p className={styles.pageSubtitle}>
            World Bosses &amp; Méta-Événements — Heure serveur GW2 (UTC)
          </p>
        </div>

        {/* ── Filtres par expansion ────────────────────────── */}
        <nav className={styles.filters} aria-label="Filtrer par extension">
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

      {/* ── Tableau principal ────────────────────────────────── */}
      <div className={styles.timerWrapper}>

        {/* En-tête sticky : horloges + colonnes horaires */}
        <TimelineHeader timelineSlots={timelineSlots} />

        {/* Cas vide : filtre sans résultat */}
        {visibleGroups.length === 0 && (
          <div className={styles.emptyState}>
            Aucun événement pour ce filtre
          </div>
        )}

        {/* Groupes d'expansion triés (actifs en premier) */}
        {visibleGroups.map((group) => (
          <ExpansionGroupSection
            key={group.id}
            group={group}
            timelineSlots={timelineSlots}
          />
        ))}
      </div>

      <p className={styles.disclaimer}>
        Horaires basés sur le temps serveur GW2 (UTC) — susceptibles d'être ajustés par ArenaNet.
      </p>
    </main>
  );
};

export default EventsPage;