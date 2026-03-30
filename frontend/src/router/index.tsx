// frontend/src/router/index.tsx

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { lazy, ReactNode, Suspense } from 'react';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import AdminRoute from './AdminRoute';
import AdminLayout from '../components/admin/AdminLayoutComponent/AdminLayout';
import Navbar from '../components/layout/NavbarComponent/Navbar';
import Footer from '../components/layout/FooterComponent/Footer';
import useAuthStore from '../store/authStore';

// ─── Loader affiché pendant le chargement des chunks lazy ────────────────────
const PageLoader = () => (
  <div className="gw2-loading-screen">
    <div className="gw2-loading-spinner" />
  </div>
);

// ─── Wrapper Suspense réutilisable ────────────────────────────────────────────
const S = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// ─── RootLayout — Navbar + Footer autour de toutes les pages publiques ────────
//
// Le layout admin est volontairement séparé (AdminLayout) pour ne pas
// afficher la Navbar/Footer publique dans le back-office.
//
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

// ─────────────────────────────────────────────────────────────────────────────
// Lazy imports
// Chaque page est chargée à la demande — réduit le bundle initial.
// ─────────────────────────────────────────────────────────────────────────────

// Pages publiques
const HomePage            = lazy(() => import('@/pages/HomePage/HomePage'));
const AboutPage           = lazy(() => import('@/pages/AboutPage/AboutPage'));
const ContactPage         = lazy(() => import('@/pages/ContactPage/ContactPage'));
const RulesPage           = lazy(() => import('@/pages/RulesPage/RulesPage'));

// Auth (visiteur non connecté uniquement)
const LoginPage           = lazy(() => import('@/pages/Auth/LoginPage/LoginPage'));
const RegisterPage        = lazy(() => import('@/pages/Auth/RegisterPage/RegisterPage'));
const ForgotPasswordPage  = lazy(() => import('@/pages/Auth/ForgotPasswordPage/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('@/pages/Auth/ResetPasswordPage/ResetPasswordPage'));

// App — utilisateur connecté
const ProfilePage         = lazy(() => import('@/pages/ProfilePage/ProfilePage'));

// ── Sprint 2 — Timer d'événements GW2 ────────────────────────────────────────
// Page publique : pas besoin d'être connecté pour consulter les horaires.
const EventsPage          = lazy(() => import('@/pages/EventsPage/EventsPage'));

// Admin — rôle 'admin' obligatoire
const AdminOverviewPage   = lazy(() => import('@/pages/Admin/AdminOverviewPage/AdminOverviewPage'));
const AdminUserPage       = lazy(() => import('@/pages/Admin/AdminUserPage/AdminUserPage'));

// Erreur
const NotFoundPage        = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

const router = createBrowserRouter([

  // ===========================================================================
  // Arbre principal — Navbar + Footer (RootLayout)
  // ===========================================================================
  {
    element: <RootLayout />,
    children: [

      // ── Routes publiques ──────────────────────────────────────────────────
      { path: '/',        element: <S><HomePage /></S>    },
      { path: '/about',   element: <S><AboutPage /></S>   },
      { path: '/rules',   element: <S><RulesPage /></S>   },

      // ── Événements ────────────────────────────────────────────────────────
      { path: '/events',  element: <S><EventsPage /></S>  },

      // ── Routes Guest — visiteur non connecté uniquement ───────────────────
      // Redirige vers /profile si déjà authentifié
      {
        element: <GuestRoute />,
        children: [
          { path: '/login',            element: <S><LoginPage /></S>           },
          { path: '/register',         element: <S><RegisterPage /></S>        },
          { path: '/forgot-password',  element: <S><ForgotPasswordPage /></S>  },
          { path: '/reset-password',   element: <S><ResetPasswordPage /></S>   },
        ],
      },

      // ── Routes Protégées — authentification obligatoire ───────────────────
      {
        element: <ProtectedRoute />,
        children: [

          { path: '/contact', element: <S><ContactPage /></S> },
          { path: '/profile', element: <S><ProfilePage /></S> },

          // Sprint 3 — Forum
          // { path: '/forum',                            element: <S><ForumPage /></S>         },
          // { path: '/forum/:categorySlug',              element: <S><CategoryPage /></S>      },
          // { path: '/forum/:categorySlug/:slug',        element: <S><DiscussionPage /></S>    },
          // { path: '/forum/nouvelle-discussion',        element: <S><NewDiscussionPage /></S> },

          // Sprint 4 — API GW2 avancée
          // { path: '/items',     element: <S><ItemsPage /></S>      },
          // { path: '/items/:id', element: <S><ItemDetailPage /></S> },

          // Sprint 5 — Guildes & Builds
          // { path: '/guildes',        element: <S><GuildesPage /></S>      },
          // { path: '/guildes/:id',    element: <S><GuildeDetailPage /></S> },
          // { path: '/builds',         element: <S><BuildsPage /></S>       },
          // { path: '/builds/:id',     element: <S><BuildDetailPage /></S>  },
          // { path: '/builds/nouveau', element: <S><NewBuildPage /></S>     },
        ],
      },
    ],
  },

  // ===========================================================================
  // Arbre admin — layout séparé (sidebar, pas de Navbar/Footer publique)
  //
  // AdminRoute vérifie :
  //   1. isAuthenticated       → sinon redirige vers /login
  //   2. user.role === 'admin' → sinon redirige vers /profile
  //
  // AdminLayout fournit la sidebar de navigation admin.
  // ===========================================================================
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [

          // GET /admin — Vue d'ensemble + statistiques
          { index: true, element: <S><AdminOverviewPage /></S> },

          // GET /admin/users — Liste, recherche et modération des utilisateurs
          { path: 'users', element: <S><AdminUserPage /></S> },

          // Sprint 6 — futures features admin (décommenter au fur et à mesure)
          // { path: 'categories', element: <S><AdminCategoriesPage /></S> },
          // { path: 'logs',       element: <S><AdminLogsPage /></S>       },
        ],
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  { path: '*', element: <S><NotFoundPage /></S> },

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;