import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

// ─── Loading fallback ────────────────────────────────────────────────
const PageLoader = () => (
  <div className="gw2-loading-screen">
    <div className="gw2-loading-spinner" />
  </div>
);

// ─── Lazy imports ────────────────────────────────────────────────────

// Auth
const LoginPage           = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage        = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage  = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('../features/auth/pages/ResetPasswordPage'));

// App
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// 404
const NotFoundPage = lazy(() => import('../features/error/pages/NotFoundPage'));

// ─── Wrapper Suspense réutilisable ───────────────────────────────────
const S = ({ children }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

// ─── Router ──────────────────────────────────────────────────────────
const router = createBrowserRouter([

  { path: '/', element: <Navigate to="/login" replace /> },

  // ── Routes Guest (non authentifié seulement) ─────────────────────
  {
    element: <GuestRoute />,
    children: [
      { path: '/login',           element: <S><LoginPage /></S> },          // Page de connexion
      { path: '/register',        element: <S><RegisterPage /></S> },       // Page d'inscription
      { path: '/forgot-password', element: <S><ForgotPasswordPage /></S> }, // Page de mot de passe oublié
      { path: '/reset-password',  element: <S><ResetPasswordPage /></S> },  // Page de réinitialisation du mot de passe
    ],
  },

  // ── Routes Protégées (authentifié obligatoire) ────────────────────
  {
    element: <ProtectedRoute />,
    children: [

      // Sprint 2 — Dashboard & Profil
      { path: '/dashboard', element: <S><DashboardPage /></S> },
      // { path: '/profil',            element: <S><ProfilePage /></S> },
      // { path: '/profil/api-key',    element: <S><ApiKeyPage /></S> },

      // Sprint 3 — Forum
      // { path: '/forum',                      element: <S><ForumPage /></S> },
      // { path: '/forum/:categorySlug',         element: <S><CategoryPage /></S> },
      // { path: '/forum/:categorySlug/:slug',   element: <S><DiscussionPage /></S> },
      // { path: '/forum/nouvelle-discussion',   element: <S><NewDiscussionPage /></S> },

      // Sprint 4 — API GW2 avancée
      // { path: '/items',          element: <S><ItemsPage /></S> },
      // { path: '/items/:id',      element: <S><ItemDetailPage /></S> },
      // { path: '/events',         element: <S><EventsPage /></S> },

      // Sprint 5 — Guildes & Builds
      // { path: '/guildes',        element: <S><GuildesPage /></S> },
      // { path: '/guildes/:id',    element: <S><GuideDetailPage /></S> },
      // { path: '/builds',         element: <S><BuildsPage /></S> },
      // { path: '/builds/:id',     element: <S><BuildDetailPage /></S> },
      // { path: '/builds/nouveau', element: <S><NewBuildPage /></S> },

      // Sprint 6 — Admin
      // { path: '/admin', element: <ProtectedRoute roles={['admin', 'moderateur']} />, children: [
      //   { path: 'moderation', element: <S><ModerationPage /></S> },
      // ]},
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────
  { path: '*', element: <S><NotFoundPage /></S> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;