import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface NavUser {
  nom: string;
  avatar?: string;
  role?: string;
}

interface NavbarProps {
  user?: NavUser | null;
  onLogout?: () => void;
}

interface NavLink {
  label: string;
  href: string;
  icon: string;
}

interface DropdownItem {
  label: string;
  href: string;
  icon: string;
}

// ─── Données ────────────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { label: 'Forum',      href: '/forum',      icon: '⚔' },
  { label: 'Builds',     href: '/builds',     icon: '🛡' },
  { label: 'Guildes',    href: '/guildes',    icon: '🏰' },
  { label: 'Objets',     href: '/objets',     icon: '💎' },
  { label: 'Événements', href: '/evenements', icon: '🗺' },
];

// ─── Composant ──────────────────────────────────────────────────────
export default function Navbar({ user = null, onLogout }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location    = useLocation();

  /* Effet de fond au scroll */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Fermeture des menus au changement de route */
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  /* Fermeture dropdown au clic extérieur */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Items dropdown selon le rôle */
  const dropdownItems: DropdownItem[] = [
    { label: 'Mon profil',  href: '/profil',         icon: '👤' },
    { label: 'Clé API GW2', href: '/profil/api-key', icon: '🔑' },
    { label: 'Mes builds',  href: '/profil/builds',  icon: '🛡' },
    ...(user?.role === 'admin'
      ? [{ label: 'Administration', href: '/admin', icon: '⚙' }]
      : []
    ),
  ];

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className={scrolled ? styles.navScrolled : styles.nav}
    >
      <div className={styles.inner}>
        <div className={styles.bar}>

          {/* ── Logo ── */}
          <Link to="/" aria-label="GW2Nexus — Accueil" className={styles.logo}>
            <NavLogo />
            <span className={styles.logoName}>
              GW2<span className={styles.logoAccent}>Nexus</span>
            </span>
          </Link>

          {/* ── Liens desktop ── */}
          <ul className={styles.navLinks}>
            {NAV_LINKS.map(({ label, href, icon }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    to={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={isActive ? styles.navLinkActive : styles.navLink}
                  >
                    <span className={styles.navLinkIcon}>{icon}</span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Actions droite ── */}
          <div className={styles.actions}>
            {user ? (
              /* Utilisateur connecté */
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setUserOpen(v => !v)}
                  aria-expanded={userOpen}
                  aria-haspopup="true"
                  className={`${styles.userBtn} ${userOpen ? styles.userBtnOpen : ''}`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className={styles.userAvatar} />
                  ) : (
                    <div className={styles.userInitial} aria-hidden="true">
                      {user.nom.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={styles.userName}>{user.nom}</span>
                  <svg
                    className={userOpen ? styles.chevronOpen : styles.chevron}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownLabel}>Connecté en tant que</p>
                      <p className={styles.dropdownName}>{user.nom}</p>
                      {user.role !== 'user' && (
                        <span className={styles.dropdownRole}>{user.role}</span>
                      )}
                    </div>

                    {dropdownItems.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={styles.dropdownLink}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={onLogout}
                      className={styles.dropdownLogout}
                    >
                      <span aria-hidden="true">🚪</span>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Visiteur */
              <>
                <Link to="/login" className={styles.loginLink}>
                  Connexion
                </Link>
                <Link to="/register" className={styles.registerLink}>
                  Rejoindre
                </Link>
              </>
            )}

            {/* Burger mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className={styles.burger}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Menu mobile ── */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(({ label, href, icon }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    to={href}
                    className={isActive ? styles.mobileLinkActive : styles.mobileLink}
                  >
                    <span className={styles.mobileLinkIcon}>{icon}</span>
                    {label}
                  </Link>
                </li>
              );
            })}

            {!user && (
              <li className={styles.mobileLoginItem}>
                <Link to="/login" className={styles.mobileLoginLink}>
                  Connexion
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

// ─── Logo SVG ────────────────────────────────────────────────────────
const NavLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
    <polygon
      points="20,2 36,11 36,29 20,38 4,29 4,11"
      stroke="#C9A84C"
      strokeWidth="2"
      fill="rgba(201,168,76,0.08)"
    />
    <polygon
      points="20,8 30,14 30,26 20,32 10,26 10,14"
      fill="#C9A84C"
      opacity="0.9"
    />
    <text
      x="20" y="25"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="#0f1117"
      fontFamily="serif"
    >
      G
    </text>
  </svg>
);