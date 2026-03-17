// frontend/src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Forum',      href: '/forum',       icon: '⚔' },
  { label: 'Builds',    href: '/builds',      icon: '🛡' },
  { label: 'Guildes',   href: '/guildes',     icon: '🏰' },
  { label: 'Objets',    href: '/objets',      icon: '💎' },
  { label: 'Événements',href: '/evenements',  icon: '🗺' },
]

/**
 * Navbar principale GW2Nexus
 *
 * Props :
 *   user     — { nom, avatar?, role } | null
 *   onLogout — () => void
 */
export default function Navbar({ user = null, onLogout }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const location = useLocation()

  // Effet de fond au scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fermeture des menus au changement de route
  useEffect(() => {
    setMenuOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all .3s ease',
        background: scrolled ? 'rgba(15,17,23,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* ── Logo ── */}
          <Link to="/" aria-label="GW2Nexus — Accueil" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36 }}>
              <polygon points="20,2 36,11 36,29 20,38 4,29 4,11"
                stroke="#C9A84C" strokeWidth="2" fill="rgba(201,168,76,0.08)" />
              <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" fill="#C9A84C" opacity="0.9" />
              <text x="20" y="25" textAnchor="middle" fontSize="14"
                fontWeight="bold" fill="#0f1117" fontFamily="serif">G</text>
            </svg>
            <span style={{
              fontFamily: 'Georgia, serif', fontSize: '1.2rem',
              letterSpacing: '0.15em', color: '#E8D5A3',
            }}>
              GW2<span style={{ color: '#C9A84C' }}>Nexus</span>
            </span>
          </Link>

          {/* ── Liens desktop ── */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}
            className="nav-links-desktop">
            {NAV_LINKS.map(({ label, href, icon }) => {
              const isActive = location.pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link to={href}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 6,
                      fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.03em',
                      textDecoration: 'none',
                      color: isActive ? '#C9A84C' : '#9CA3AF',
                      borderBottom: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                      transition: 'color .2s, border-color .2s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#E8D5A3' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#9CA3AF' }}
                  >
                    <span style={{ fontSize: '1rem' }}>{icon}</span>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* ── Actions droite ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              /* Utilisateur connecté */
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserOpen(v => !v)}
                  aria-expanded={userOpen}
                  aria-haspopup="true"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
                    background: 'transparent',
                    border: `1px solid ${userOpen ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.3)'}`,
                    transition: 'border-color .2s',
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt=""
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover',
                        outline: '1px solid rgba(201,168,76,0.5)' }} />
                  ) : (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(201,168,76,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#C9A84C', fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {user.nom.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '0.875rem', color: '#E8D5A3', maxWidth: 120,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.nom}
                  </span>
                  <svg style={{
                    width: 14, height: 14, color: '#C9A84C', fill: 'currentColor',
                    transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s',
                  }} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: 210, background: '#161b26',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#6B7280' }}>Connecté en tant que</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.875rem', fontWeight: 600,
                        color: '#E8D5A3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.nom}
                      </p>
                      {user.role !== 'user' && (
                        <span style={{
                          display: 'inline-block', marginTop: 4, padding: '2px 6px',
                          fontSize: '0.65rem', borderRadius: 4, letterSpacing: '0.1em',
                          background: 'rgba(201,168,76,0.15)', color: '#C9A84C', textTransform: 'uppercase',
                        }}>
                          {user.role}
                        </span>
                      )}
                    </div>

                    {[
                      { label: 'Mon profil',   href: '/profil',         icon: '👤' },
                      { label: 'Clé API GW2',  href: '/profil/api-key', icon: '🔑' },
                      { label: 'Mes builds',   href: '/profil/builds',  icon: '🛡' },
                      ...(user.role === 'admin' ? [{ label: 'Administration', href: '/admin', icon: '⚙' }] : []),
                    ].map(item => (
                      <Link key={item.href} to={item.href}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', textDecoration: 'none',
                          fontSize: '0.875rem', color: '#9CA3AF', transition: 'all .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#E8D5A3'; e.currentTarget.style.background = 'rgba(201,168,76,0.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent' }}
                      >
                        <span>{item.icon}</span>{item.label}
                      </Link>
                    ))}

                    <button onClick={onLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 16px', cursor: 'pointer',
                        background: 'transparent', border: 'none',
                        borderTop: '1px solid rgba(201,168,76,0.1)',
                        fontSize: '0.875rem', color: 'rgba(239,68,68,0.8)',
                        transition: 'color .15s', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.8)'}
                    >
                      <span>🚪</span>Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Visiteur */
              <>
                <Link to="/connexion" style={{
                  fontSize: '0.875rem', fontWeight: 500, color: '#C9A84C',
                  textDecoration: 'none', transition: 'color .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8D5A3'}
                  onMouseLeave={e => e.currentTarget.style.color = '#C9A84C'}
                >
                  Connexion
                </Link>
                <Link to="/inscription" style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '7px 18px', borderRadius: 6,
                  background: '#C9A84C', color: '#0f1117',
                  fontSize: '0.875rem', fontWeight: 700,
                  letterSpacing: '0.05em', textDecoration: 'none',
                  transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#D4B866'; e.currentTarget.style.boxShadow = '0 0 16px rgba(201,168,76,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Rejoindre
                </Link>
              </>
            )}

            {/* Burger mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-label="Menu mobile"
              className="burger-btn"
              style={{
                padding: 8, background: 'transparent', border: 'none',
                cursor: 'pointer', color: '#9CA3AF',
              }}
            >
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
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
        <div style={{
          background: 'rgba(15,17,23,0.98)',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          backdropFilter: 'blur(12px)',
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '12px 16px' }}>
            {NAV_LINKS.map(({ label, href, icon }) => {
              const isActive = location.pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link to={href} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                    fontSize: '0.9rem', fontWeight: 500,
                    color: isActive ? '#C9A84C' : '#9CA3AF',
                    background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                  }}>
                    <span style={{ fontSize: '1rem' }}>{icon}</span>{label}
                  </Link>
                </li>
              )
            })}
            {!user && (
              <li style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                <Link to="/connexion" style={{
                  display: 'block', padding: '10px 12px',
                  fontSize: '0.875rem', color: '#C9A84C', textDecoration: 'none',
                }}>
                  Connexion
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ── CSS responsive burger ── */}
      <style>{`
        .nav-links-desktop { display: flex !important; }
        .burger-btn        { display: none  !important; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none  !important; }
          .burger-btn        { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}