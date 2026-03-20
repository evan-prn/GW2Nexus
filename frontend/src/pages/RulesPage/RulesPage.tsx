// ═══════════════════════════════════════════════════════════════════
// src/pages/RulesPage/RulesPage.tsx
// Orchestrateur de la page Règles & Légal :
// - instancie le hook useRulesPage (state activeTab + scroll)
// - compose les blocs Hero, TabsBar, TabMeta, Content
// ═══════════════════════════════════════════════════════════════════

import { useRulesPage }    from '@/hooks/rules/useRulesPage';
import RulesHero           from '@/components/rules/RulesHeroComponent/RulesHero';
import RulesTabsBar        from '@/components/rules/RulesTabsBarComponent/RulesTabsBar';
import RulesTabMeta        from '@/components/rules/RulesTabMetaComponent/RulesTabMeta';
import RulesContent        from '@/components/rules/RulesContentComponent/RulesContent';

import PageTitle from '@/hooks/usePageTitle';

import styles from './RulesPage.module.css';

// ─── Page ────────────────────────────────────────────────────────────
export default function RulesPage() {
  const { activeTab, currentTab, contentRef, switchTab } = useRulesPage();

  return (
    <div className={styles.page}>

      <PageTitle title="Règles et mentions légales - GW2 Nexus" />

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