// frontend/src/components/layout/Header.jsx
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const STATS = [
  { value: '12 000+', label: 'Objets indexés'  },
  { value: '500+',    label: 'Builds partagés' },
  { value: '200+',    label: 'Guildes actives' },
]

/**
 * Header héro — page d'accueil GW2Nexus
 *
 * Props :
 *   isAuthenticated — bool
 */
export default function Header({ isAuthenticated = false }) {
  const canvasRef = useRef(null)

  // ── Particules canvas dorées/blanches ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.min(70, Math.floor(canvas.offsetWidth / 18))
    const particles = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    -(Math.random() * 0.35 + 0.1),
      size:  Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.55 + 0.1,
      gold:  Math.random() > 0.55,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.alpha -= 0.0006
        if (p.y < -8 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 8
          p.alpha = Math.random() * 0.5 + 0.2
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha.toFixed(2)})`
          : `rgba(255,255,255,${(p.alpha * 0.4).toFixed(2)})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <header style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      background: '#0a0d14', overflow: 'hidden',
    }}>

      {/* ── Fonds décoratifs ── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Dégradé radial doré centré */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />
        {/* Vignette bords */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(5,7,12,0.7) 100%)',
        }} />
        {/* Grille subtile */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }}>
          <defs>
            <pattern id="hgrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
        {/* Hexagone décoratif grand */}
        <svg style={{ position: 'absolute', top: '10%', right: '6%', width: 320, height: 320, opacity: 0.035 }} viewBox="0 0 200 200">
          <polygon points="100,5 173,47 173,153 100,195 27,153 27,47" stroke="#C9A84C" strokeWidth="1" fill="none"/>
          <polygon points="100,22 160,57 160,143 100,178 40,143 40,57" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          <polygon points="100,40 148,67 148,133 100,160 52,133 52,67" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: '15%', left: '4%', width: 200, height: 200, opacity: 0.025 }} viewBox="0 0 200 200">
          <polygon points="100,5 173,47 173,153 100,195 27,153 27,47" stroke="#C9A84C" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* ── Canvas particules ── */}
      <canvas ref={canvasRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
      }} />

      {/* ── Contenu principal ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 64px',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 36, padding: '7px 16px', borderRadius: 999,
          border: '1px solid rgba(201,168,76,0.3)',
          background: 'rgba(201,168,76,0.05)',
          fontSize: '0.7rem', letterSpacing: '0.18em',
          color: '#C9A84C', fontWeight: 600, textTransform: 'uppercase',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#C9A84C',
            animation: 'pulse 2s infinite',
          }} />
          Hub Communautaire Guild Wars 2
        </div>

        {/* Titre */}
        <h1 style={{ margin: '0 0 24px', lineHeight: 1.05 }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 400, letterSpacing: '-0.01em',
            color: '#E8D5A3',
          }}>GW2</span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 700, letterSpacing: '0.12em',
            color: '#C9A84C',
          }}>NEXUS</span>
        </h1>

        {/* Séparateur ornemental */}
        <div aria-hidden="true" style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
        }}>
          <div style={{ height: 1, width: 80, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6))' }} />
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#C9A84C', flexShrink: 0 }}>
            <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
          </svg>
          <div style={{ height: 1, width: 80, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.6))' }} />
        </div>

        {/* Accroche */}
        <p style={{
          maxWidth: 560, margin: '0 0 10px',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: '#6B7280', lineHeight: 1.7, fontWeight: 300,
          letterSpacing: '0.03em',
        }}>
          Le hub communautaire ultime pour les aventuriers de Tyrie.
        </p>
        <p style={{
          maxWidth: 480, margin: '0 0 48px',
          fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6,
        }}>
          Forums, builds, guildes et données de jeu — tout en un seul endroit.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <CTAButton to="/forum" primary>⚔&nbsp; Accéder au forum</CTAButton>
          ) : (
            <>
              <CTAButton to="/inscription" primary>⚔&nbsp; Rejoindre l'aventure</CTAButton>
              <CTAButton to="/forum">Explorer le forum</CTAButton>
            </>
          )}
        </div>

        {/* ── Stats ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '0 48px', marginTop: 72,
        }}>
          {STATS.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
              <p style={{
                margin: '0 0 4px',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontFamily: 'Georgia, serif', fontWeight: 700, color: '#C9A84C',
              }}>{value}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#4B5563', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Flèche scroll ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'bounce 2s infinite',
      }}>
        <span style={{ fontSize: '0.65rem', color: '#4B5563', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Découvrir
        </span>
        <svg style={{ width: 20, height: 20, color: '#C9A84C', fill: 'none',
          stroke: 'currentColor', strokeWidth: 2 }} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
      `}</style>
    </header>
  )
}

/* ── Bouton CTA réutilisable ── */
function CTAButton({ to, primary = false, children }) {
  const base = {
    display: 'inline-flex', alignItems: 'center',
    padding: '12px 28px', borderRadius: 6, fontWeight: 700,
    fontSize: '0.875rem', letterSpacing: '0.07em',
    textDecoration: 'none', transition: 'all .25s',
    cursor: 'pointer',
  }
  const styles = primary
    ? { ...base, background: '#C9A84C', color: '#0a0d14', border: '1px solid #C9A84C' }
    : { ...base, background: 'transparent', color: '#C9A84C',
        border: '1px solid rgba(201,168,76,0.4)' }

  return (
    <Link to={to} style={styles}
      onMouseEnter={e => {
        if (primary) {
          e.currentTarget.style.background = '#D4B866'
          e.currentTarget.style.boxShadow  = '0 0 24px rgba(201,168,76,0.5)'
        } else {
          e.currentTarget.style.borderColor = '#C9A84C'
          e.currentTarget.style.background  = 'rgba(201,168,76,0.06)'
        }
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = primary ? '#C9A84C' : 'transparent'
        e.currentTarget.style.boxShadow   = 'none'
        e.currentTarget.style.borderColor = primary ? '#C9A84C' : 'rgba(201,168,76,0.4)'
        e.currentTarget.style.transform   = 'none'
      }}
    >
      {children}
    </Link>
  )
}