// ═══════════════════════════════════════════════════════════════════
// src/pages/RulesPage/RulesPage.tsx
// Orchestrateur de la page Règles & Légal :
// - instancie le hook useRulesPage (state activeTab + scroll)
// - compose les blocs Hero, TabsBar, TabMeta, Content
// ═══════════════════════════════════════════════════════════════════

import { useRulesPage }     from '@/hooks/rules/useRulesPage';                            // Hook personnalisé pour gérer l'état de la page Rules (onglet actif + scroll)
import RulesHero            from '@/components/rules/RulesHeroComponent/RulesHero';       // Hero de la page Rules, avec titre et background stylisé
import RulesTabsBar         from '@/components/rules/RulesTabsBarComponent/RulesTabsBar'; // Barre d'onglets sticky : Legal / Confidentialité / CGU
import RulesTabMeta         from '@/components/rules/RulesTabMetaComponent/RulesTabMeta'; // Affiche les infos méta de l'onglet actif (titre + date de dernière mise à jour)
import RulesContent         from '@/components/rules/RulesContentComponent/RulesContent'; // Contenu de l'onglet actif, avec scroll automatique lors du changement d'onglet
import usePageTitle         from '@/hooks/usePageTitle';                                  // Hook pour mettre à jour le titre de la page (document.title) de manière déclarative

import styles from './RulesPage.module.css';    // CSS module local à cette page, pour éviter les conflits de classes et faciliter la maintenance

// ─── Page ────────────────────────────────────────────────────────────
export default function RulesPage() {
  const { activeTab, currentTab, contentRef, switchTab } = useRulesPage();

  usePageTitle(currentTab ? `${currentTab.label}` : 'Règles & Légal');

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <RulesHero />

      {/* ── Barre d'onglets sticky ── */}
      <RulesTabsBar activeTab={activeTab} onSwitch={switchTab} />

      {/* ── Méta de l'onglet actif ── */}
      <RulesTabMeta tab={currentTab} />

      {/* ── Contenu de l'onglet actif ── */}
      <RulesContent activeTab={activeTab} contentRef={contentRef} />

    </div>
  );
}