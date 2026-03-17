// frontend/src/pages/HomePage.jsx
import Header from '../components/layout/Header';
import useAuthStore from '../store/authStore';

/**
 * Page d'accueil — contient le Header hero + sections marketing.
 * C'est ici (et seulement ici) que le Header est rendu.
 */
const HomePage = () => {
  const { user } = useAuthStore();

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