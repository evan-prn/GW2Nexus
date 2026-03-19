// ═══════════════════════════════════════════════════════════════════
// src/pages/ContactPage/ContactPage.tsx
// Orchestrateur de la page Contact :
// - instancie le hook useContactForm
// - gère les animations reveal au scroll
// - compose les trois blocs (Hero, Form, Channels)
// ═══════════════════════════════════════════════════════════════════

import { useRef, useState, useEffect } from 'react';

import ContactHero     from '@/components/contact/ContactHeroComponent/ContactHero';
import ContactForm     from '@/components/contact/ContactFormComponent/ContactForm';
import ContactChannels from '@/components/contact/ContactChannelsComponent/ContactChannels';
import { useContactForm } from '@/hooks/contact/useContactForm';

import styles from './ContactPage.module.css';

// ─── Hook local : animation reveal au scroll ─────────────────────────
// Déclaré ici car spécifique à cette page pour l'instant.
// À déplacer dans src/hooks/ui/useReveal.ts si d'autres pages en ont besoin.
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    },
  };
}

// ─── Page ────────────────────────────────────────────────────────────
export default function ContactPage() {
  // Logique formulaire déléguée au hook dédié
  const { form, status, errors, globalError, handleChange, handleSubmit } =
    useContactForm();

  // Animations reveal indépendantes pour chaque bloc
  const heroReveal  = useReveal(0);
  const formReveal  = useReveal(0);
  const chansReveal = useReveal(120);

  return (
    <div className={styles.page}>
      {/* Fond décoratif — purement visuel, ignoré par les lecteurs d'écran */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      {/* ── Hero ── */}
      <div ref={heroReveal.ref} style={heroReveal.style}>
        <ContactHero />
      </div>

      {/* ── Grille principale ── */}
      <div className={styles.main}>

        {/* Formulaire */}
        <div ref={formReveal.ref} style={formReveal.style}>
          <h2 className={styles.blockTitle}>Formulaire de Contact</h2>
          <ContactForm
            form={form}
            status={status}
            errors={errors}
            globalError={globalError}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Canaux externes */}
        <div ref={chansReveal.ref} style={chansReveal.style}>
          <h2 className={styles.blockTitle}>Réseaux Externes</h2>
          <ContactChannels />
        </div>

      </div>
    </div>
  );
}