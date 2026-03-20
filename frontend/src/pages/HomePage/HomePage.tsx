import Header       from '@/components/layout/HeaderComponent/Header';
import useAuthStore from '@/store/authStore';

import PageTitle from '@/hooks/usePageTitle';

/**
 * HomePage — page d'accueil GW2Nexus
 * Contient le Header hero + sections marketing (Sprint 3+)
 */
const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <>

      <PageTitle title="GW2 Nexus - Votre compagnon ultime pour Guild Wars 2" />

      {/* Hero pleine page */}
      <Header isAuthenticated={!!user} />

      {/* Sections à venir (Sprint 3+) */}
      {/* <SectionForum />   */}
      {/* <SectionBuilds />  */}
      {/* <SectionGuildes /> */}
    </>
  );
};

export default HomePage;