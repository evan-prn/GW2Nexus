// src/components/admin/AdminRouteComponent/AdminRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

// ---------------------------------------------------------------------------
// AdminRoute — Guard de route réservé aux administrateurs
//
// Double vérification :
//   1. isAuthenticated — redirige vers /login si non connecté
//   2. user.role === 'admin' — redirige vers /dashboard si rôle insuffisant
//
// Important : ce guard est une protection UX, pas la sécurité principale.
// Chaque endpoint backend est protégé par AdminMiddleware + AdminPolicy,
// indépendamment de ce composant.
// ---------------------------------------------------------------------------

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
