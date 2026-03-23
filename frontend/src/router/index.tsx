// frontend/src/router/index.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { lazy, ReactNode, Suspense } from 'react';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute     from './GuestRoute';
import Navbar         from '../components/layout/NavbarComponent/Navbar';
import Footer         from '../components/layout/FooterComponent/Footer';
import useAuthStore   from '../store/authStore';

// ─── Loading fallback ────────────────────────────────────────────────
const PageLoader = () => (
  <div className="gw2-loading-screen">
    <div className="gw2-loading-spinner" />
  </div>
);

// ─── RootLayout — Navbar + Footer autour de toutes les pages ─────────
const RootLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ─── Lazy imports ────────────────────────────────────────────────────

// Public
const HomePage    = lazy(() => import('../pages/HomePage/HomePage'));        // Page d'accueil
const AboutPage   = lazy(() => import('../pages/AboutPage/AboutPage'));       // Page "À propos"
const ContactPage = lazy(() => import('../pages/ContactPage/ContactPage'));     // Page de contact
const RulesPage   = lazy(() => import('../pages/RulesPage/RulesPage'));       // Page de règles et conditions

// Auth
const LoginPage          = lazy(() => import('../pages/Auth/LoginPage/LoginPage'));          // Page de connexion
const RegisterPage       = lazy(() => import('../pages/Auth/RegisterPage/RegisterPage'));       // Page d'inscription
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage/ForgotPasswordPage')); // Page de mot de passe oublié
const ResetPasswordPage  = lazy(() => import('../pages/Auth/ResetPasswordPage/ResetPasswordPage'));  // Page de réinitialisation de mot de passe

// App
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));     // Page de profil utilisateur

// Error
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));  // Page 404

// ─── Wrapper Suspense réutilisable ───────────────────────────────────
const S = ({ children }: { children: ReactNode }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

// ─── Router ──────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [

      // ── Route publique ────────────────────────────────────────────
      { path: '/', element: <S><HomePage /></S> },              // Page d'accueil
      { path: '/about', element: <S><AboutPage /></S> },        // Page "À propos"
      { path: '/rules', element: <S><RulesPage /></S> },        // Page de règles et conditions


      // ── Routes Guest (visiteur non connecté seulement) ────────────
      {
        element: <GuestRoute />,
        children: [
          { path: '/login',           element: <S><LoginPage /></S> },          // Page de connexion
          { path: '/register',        element: <S><RegisterPage /></S> },       // Page d'inscription
          { path: '/forgot-password', element: <S><ForgotPasswordPage /></S> }, // Mot de passe oublié
          { path: '/reset-password',  element: <S><ResetPasswordPage /></S> },  // Réinitialisation
        ],
      },

      // ── Routes Protégées (authentifié obligatoire) ────────────────
      {
        element: <ProtectedRoute />,
        children: [

          // Contact
          { path: '/contact', element: <S><ContactPage /></S> },                    // Page de contact (accessible uniquement aux utilisateurs connectés)

          // Sprint 2 — Dashboard & Profil
          { path: '/profile',            element: <S><ProfilePage /></S> },         // Vue d'ensemble du profil
          // { path: '/profile/api-key',    element: <S><ApiKeyPage /></S> },

          // Sprint 3 — Forum
          // { path: '/forum',                     element: <S><ForumPage /></S> },
          // { path: '/forum/:categorySlug',        element: <S><CategoryPage /></S> },
          // { path: '/forum/:categorySlug/:slug',  element: <S><DiscussionPage /></S> },
          // { path: '/forum/nouvelle-discussion',  element: <S><NewDiscussionPage /></S> },

          // Sprint 4 — API GW2 avancée
          // { path: '/items',      element: <S><ItemsPage /></S> },
          // { path: '/items/:id',  element: <S><ItemDetailPage /></S> },
          // { path: '/events',     element: <S><EventsPage /></S> },

          // Sprint 5 — Guildes & Builds
          // { path: '/guildes',         element: <S><GuildesPage /></S> },
          // { path: '/guildes/:id',     element: <S><GuildeDetailPage /></S> },
          // { path: '/builds',          element: <S><BuildsPage /></S> },
          // { path: '/builds/:id',      element: <S><BuildDetailPage /></S> },
          // { path: '/builds/nouveau',  element: <S><NewBuildPage /></S> },

          // Sprint 6 — Admin
          // {
          //   element: <ProtectedRoute roles={['admin', 'moderateur']} />,
          //   children: [
          //     { path: '/admin/moderation', element: <S><ModerationPage /></S> },
          //   ],
          // },
        ],
      },

      // ── 404 ──────────────────────────────────────────────────────
      { path: '*', element: <S><NotFoundPage /></S> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;