import Header       from '@/components/layout/HeaderComponent/Header';
import useAuthStore from '@/store/authStore';
import usePageTitle from '@/hooks/usePageTitle';

/**
 * HomePage — page d'accueil GW2Nexus
 * Contient le Header hero + sections marketing (Sprint 3+)
 */
const HomePage = () => {
  const { user } = useAuthStore();

  usePageTitle('Accueil');

  return (
    <>

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