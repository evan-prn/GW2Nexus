// ═══════════════════════════════════════════════════════════════════
// src/pages/ContactPage/ContactPage.tsx
// Orchestrateur de la page Contact :
// - instancie le hook useContactForm
// - gère les animations reveal au scroll
// - compose les trois blocs (Hero, Form, Channels)
// ═══════════════════════════════════════════════════════════════════

import ContactHero        from '@/components/contact/ContactHeroComponent/ContactHero';
import ContactForm        from '@/components/contact/ContactFormComponent/ContactForm';
import ContactChannels    from '@/components/contact/ContactChannelsComponent/ContactChannels';
import { useContactForm } from '@/hooks/contact/useContactForm';
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver';
import usePageTitle       from '@/hooks/usePageTitle';
import type { CSSProperties } from 'react';

import styles from './ContactPage.module.css';

const getRevealStyle = (visible: boolean, delay = 0): CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
});
// ─── Page ────────────────────────────────────────────────────────────
export default function ContactPage() {
  // Logique formulaire déléguée au hook dédié
  const { form, status, errors, globalError, handleChange, handleSubmit } =
    useContactForm();

  // Animations reveal indépendantes pour chaque bloc
  const { ref: heroRef,  visible: heroVisible }  = useIntersectionObserver(0.08);
  const { ref: formRef,  visible: formVisible }  = useIntersectionObserver(0.08);
  const { ref: chansRef, visible: chansVisible } = useIntersectionObserver(0.08);

  usePageTitle('Contact');

  return (
    <div className={styles.page}>


      {/* Fond décoratif — purement visuel, ignoré par les lecteurs d'écran */}
      <div className={styles.bgOverlay} aria-hidden="true" />

      {/* ── Hero ── */}
      <div ref={heroRef} style={getRevealStyle(heroVisible)}>
        <ContactHero />
      </div>

      {/* ── Grille principale ── */}
      <div className={styles.main}>

        {/* Formulaire */}
        <div ref={formRef} style={getRevealStyle(formVisible)}>
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
        <div ref={chansRef} style={getRevealStyle(chansVisible, 120)}>
          <h2 className={styles.blockTitle}>Réseaux Externes</h2>
          <ContactChannels />
        </div>

      </div>
    </div>
  );
}
