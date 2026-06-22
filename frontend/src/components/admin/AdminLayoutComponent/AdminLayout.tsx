import { Link, NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/profile" className={styles.backLink} title="Retour a l'application">
            {'<'}
          </Link>
          <span className={styles.sidebarLogo}>GW</span>
          <div>
            <p className={styles.sidebarTitle}>GW2Nexus</p>
            <p className={styles.sidebarSub}>Back Office</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {isAdmin && (
            <>
              <p className={styles.navSection}>Tableau de bord</p>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <span className={styles.navIcon}>D</span>
                Vue d'ensemble
              </NavLink>
            </>
          )}

          <p className={styles.navSection}>Moderation</p>

          {isAdmin && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <span className={styles.navIcon}>U</span>
              Utilisateurs
            </NavLink>
          )}

          <NavLink
            to="/admin/forum"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            <span className={styles.navIcon}>F</span>
            Forum
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            {user?.avatar ? (
              <img src={user.avatar} alt="" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar} aria-hidden="true">
                {user?.nom?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.adminInfoText}>
              <p className={styles.adminName}>{user?.nom}</p>
              <p className={styles.adminRole}>{isAdmin ? 'Administrateur' : 'Moderateur'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
