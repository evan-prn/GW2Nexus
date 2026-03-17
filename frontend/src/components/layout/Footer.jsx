// frontend/src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Communauté',
    links: [
      { label: 'Forum',        href: '/forum'       },
      { label: 'Guildes',      href: '/guildes'     },
      { label: 'Builds',       href: '/builds'      },
      { label: 'Événements',   href: '/evenements'  },
    ],
  },
  {
    title: 'Jeu',
    links: [
      { label: 'Objets',       href: '/items'       },
      { label: 'Professions',  href: '/professions' },
      { label: 'API GW2',      href: 'https://wiki.guildwars2.com/wiki/API:Main', external: true },
    ],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Connexion',    href: '/login'       },
      { label: 'Inscription',  href: '/register'    },
      { label: 'Mon profil',   href: '/profil'      },
    ],
  },
  {
    title: 'Projet',
    links: [
      { label: 'À propos',     href: '/about'    },
      { label: 'Règles',       href: '/regles'      },
      { label: 'Contact',      href: '/contact'     },
      { label: 'GitHub',       href: 'https://github.com/evan-prn/GW2Nexus', external: true },
    ],
  },
];

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/evan-prn/GW2Nexus',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 17, height: 17 }}>
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 17, height: 17 }}>
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.23A.077.077 0 008.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 20.03 20.03 0 005.993 2.98.078.078 0 00.084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 01-1.872-.878.075.075 0 01-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 01.078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 01.079.009c.12.098.245.195.372.288a.075.075 0 01-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 00-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 00.084.028 19.963 19.963 0 006.002-2.981.076.076 0 00.032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 00-.031-.028z" />
      </svg>
    ),
  },
  {
    label: 'Reddit',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 17, height: 17 }}>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: 'relative',
      background: '#07090e',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      overflow: 'hidden',
    }}>

      {/* Liseré doré haut */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.5) 70%, transparent 100%)',
      }} />

      {/* Lueur d'ambiance */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 200,
        background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 0' }}>

        {/* ── Grille principale ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '40px 24px',
          marginBottom: 48,
        }}>

          {/* Colonne marque */}
          <div style={{ minWidth: 190 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
              <svg viewBox="0 0 40 40" fill="none" style={{ width: 30, height: 30, flexShrink: 0 }}>
                <polygon points="20,2 36,11 36,29 20,38 4,29 4,11"
                  stroke="#C9A84C" strokeWidth="2" fill="rgba(201,168,76,0.07)" />
                <polygon points="20,8 30,14 30,26 20,32 10,26 10,14"
                  fill="#C9A84C" opacity="0.88" />
                <text x="20" y="25" textAnchor="middle" fontSize="13"
                  fontWeight="bold" fill="#07090e" fontFamily="Georgia, serif">G</text>
              </svg>
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.05rem',
                letterSpacing: '0.12em',
                color: '#E8D5A3',
              }}>
                GW2<span style={{ color: '#C9A84C' }}>Nexus</span>
              </span>
            </Link>

            <p style={{
              margin: '0 0 20px',
              fontSize: '0.8rem',
              lineHeight: 1.75,
              color: '#3D4452',
              maxWidth: 210,
            }}>
              Hub communautaire dédié aux aventuriers de Tyrie. Forums, builds, guildes et données de jeu.
            </p>

            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: 6,
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: '#3D4452',
                    transition: 'color .2s, border-color .2s, background .2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color       = '#C9A84C';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                    e.currentTarget.style.background  = 'rgba(201,168,76,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color       = '#3D4452';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
                    e.currentTarget.style.background  = 'transparent';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <p style={{
                margin: '0 0 14px',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}>
                {title}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.82rem', color: '#3D4452', textDecoration: 'none', transition: 'color .15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3D4452'}
                      >
                        {label} ↗
                      </a>
                    ) : (
                      <Link
                        to={href}
                        style={{ fontSize: '0.82rem', color: '#3D4452', textDecoration: 'none', transition: 'color .15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3D4452'}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bandeau ArenaNet ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '14px 18px', marginBottom: 28,
          borderRadius: 6,
          background: 'rgba(201,168,76,0.03)',
          border: '1px solid rgba(201,168,76,0.08)',
        }}>
          <svg viewBox="0 0 20 20" fill="#C9A84C"
            style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }}>
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#2D333F', lineHeight: 1.65 }}>
            GW2Nexus utilise l'
            <a href="https://wiki.guildwars2.com/wiki/API:Main" target="_blank" rel="noopener noreferrer"
              style={{ color: '#C9A84C', textDecoration: 'none' }}>
              API officielle Guild Wars 2
            </a>
            {' '}fournie par ArenaNet. Guild Wars&nbsp;2 est une marque déposée d'ArenaNet,&nbsp;LLC.
            Ce projet est communautaire et n'est pas affilié à ArenaNet.
          </p>
        </div>

        {/* ── Bas de footer ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
          paddingTop: 20, paddingBottom: 28,
          borderTop: '1px solid rgba(201,168,76,0.06)',
        }}>
          <p style={{ margin: 0, fontSize: '0.73rem', color: '#2D333F' }}>
            © {year} GW2Nexus — Tous droits réservés
          </p>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#2D333F' }}>
            Fait avec <span style={{ color: '#C9A84C' }}>♥</span> pour la communauté Guild Wars&nbsp;2
          </p>
        </div>
      </div>
    </footer>
  );
}