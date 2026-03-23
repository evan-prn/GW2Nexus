// src/components/admin/AdminLayoutComponent/AdminLayout.tsx

import { NavLink, Outlet, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import styles from './AdminLayout.module.css';

// ---------------------------------------------------------------------------
// AdminLayout — Layout dédié au back-office
//
// Responsabilités :
//   - Sidebar de navigation admin fixe à gauche
//   - <Outlet /> pour afficher la page active à droite
//   - Informations de l'admin connecté en bas de sidebar
//   - Lien de retour vers l'application principale
//
// Ce layout est rendu par AdminRoute qui garantit que seul
// un utilisateur avec role === 'admin' peut y accéder.
// ---------------------------------------------------------------------------

export default function AdminLayout() {
  const { user } = useAuthStore();

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>

        <div className={styles.sidebarHeader}>
          {/* Retour vers l'application principale */}
          <Link to="/profile" className={styles.backLink} title="Retour à l'application">
            ←
          </Link>
          <span className={styles.sidebarLogo}>⚙</span>
          <div>
            <p className={styles.sidebarTitle}>GW2Nexus</p>
            <p className={styles.sidebarSub}>Back Office</p>
          </div>
        </div>

        <nav className={styles.nav}>

          <p className={styles.navSection}>Tableau de bord</p>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>◈</span>
            Vue d'ensemble
          </NavLink>

          <p className={styles.navSection}>Modération</p>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>◉</span>
            Utilisateurs
          </NavLink>

          <NavLink
            to="/admin/forum"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>◧</span>
            Forum
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>◧</span>
            Catégories forum
          </NavLink>

        </nav>


        {/* Identité de l'admin connecté + retour app */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            {user?.avatar ? (
              <img src={user?.avatar} alt="" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar} aria-hidden="true">
                {user?.nom?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.adminInfoText}>
              <p className={styles.adminName}>{user?.nom}</p>
              <p className={styles.adminRole}>Administrateur</p>
            </div>
          </div>
        </div>

      </aside>

      {/* ── Contenu principal ────────────────────────────────────── */}
      <main className={styles.main}>
        <Outlet />
      </main>

    </div >
  );
}