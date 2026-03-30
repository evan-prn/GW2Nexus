// =============================================================
// pages/Events/EventDetailPage/EventDetailPage.tsx
// Page de détail d'un méta-événement GW2
// Route : /events/:eventId
// =============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { findEventById } from '@/data/findEvent.data';
import { useWorldBossStatus } from '@/hooks/event/useWorldBossStatus';
import styles from './EventDetailPage.module.css';

// ─────────────────────────────────────────────────────────────
// Utilitaire local — minutes UTC depuis minuit
// ─────────────────────────────────────────────────────────────

const nowUtcMinutes = (): number => {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
};

/** Formate des minutes UTC en "HH:MM" */
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

  // ── Heure UTC courante ───────────────────────────────────────
  const currentMinutes = nowUtcMinutes();

  // ── 404 ─────────────────────────────────────────────────────
  if (!found) {
    return (
      <div className={styles.notFound}>
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
      <button className={styles.back} onClick={() => navigate('/events')}>
        ← Retour aux événements
      </button>

      {/* ── En-tête ────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.groupBadge} style={{ borderColor: zone.color }}>
            {group.label}
          </span>
          <span className={styles.zoneName}>{zone.name}</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.icon}>{zone.icon}</span>
          {event.name}
        </h1>

        {/* Statut tué aujourd'hui — world bosses Core uniquement */}
        {event.gw2ApiId && (
          <div className={styles.killStatus}>
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

        {/* ── Horaires du jour ─────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Horaires du jour (UTC)</h2>
          <div className={styles.slotList}>
            {slotsWithStatus.map((slot, i) => (
              <div
                key={i}
                className={[
                  styles.slot,
                  slot.isActive   ? styles.slotActive   : '',
                  slot.isUpcoming ? styles.slotUpcoming  : '',
                ].join(' ')}
              >
                <span className={styles.slotTime}>{fmt(slot.startMinutes)}</span>
                <span className={styles.slotSep}>→</span>
                <span className={styles.slotTime}>
                  {fmt(slot.startMinutes + slot.durationMinutes)}
                </span>
                {slot.isActive && (
                  <span className={styles.slotTag}>EN COURS</span>
                )}
                {slot.isUpcoming && (
                  <span className={styles.slotTagUpcoming}>BIENTÔT</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Lien wiki ────────────────────────────────────── */}
        {event.wikiUrl && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ressources</h2>
            <a
              className={styles.wikiLink}
              href={event.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur le wiki GW2 ↗
            </a>
          </section>
        )}

      </div>
    </div>
  );
}