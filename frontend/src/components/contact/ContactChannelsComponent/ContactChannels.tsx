// ═══════════════════════════════════════════════════════════════════
// src/components/contact/ContactChannelsComponent/ContactChannels.tsx
// Liste des canaux de contact externes (Discord, GitHub, Email)
// Composant purement présentationnel — aucune logique
// ═══════════════════════════════════════════════════════════════════

import { CHANNELS } from '@/data/contact.data';
import styles from './ContactChannels.module.css';

// ─── Composant ───────────────────────────────────────────────────────
// Pas de props — données provenant de contact.data.ts
export default function ContactChannels() {
  return (
    <div className={styles.list}>
      {CHANNELS.map((ch) => (
        <div key={ch.title} className={styles.card}>

          {/* En-tête : icône, nom, badge tag */}
          <div className={styles.cardHeader}>
            <span className={styles.icon}>{ch.icon}</span>
            <span className={styles.name}>{ch.title}</span>
            <span className={styles.tag}>{ch.tag}</span>
          </div>

          {/* Délai de réponse */}
          <p className={styles.delay}>Délai : {ch.delay}</p>

          {/* Description */}
          <p className={styles.desc}>{ch.description}</p>

          {/* Lien externe */}
          <a
            href={ch.href}
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            Accéder au canal →
          </a>
        </div>
      ))}
    </div>
  );
}