import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface HeaderProps {
  isAuthenticated?: boolean;
}

interface Stat {
  value: string;
  label: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  gold: boolean;
}

// ─── Données ────────────────────────────────────────────────────────
const STATS: Stat[] = [
  { value: '12 000+', label: 'Objets indexés'  },
  { value: '500+',    label: 'Builds partagés' },
  { value: '200+',    label: 'Guildes actives' },
];

// ─── Constantes particules ──────────────────────────────────────────
const PARTICLE_COUNT     = 500;   // nombre total de particules
const PARTICLE_SPEED_MAX = 0.5;   // vitesse verticale maximale (montée)
const PARTICLE_SPEED_MIN = 0.08;  // vitesse verticale minimale
const PARTICLE_DRIFT     = 0.4;   // dérive horizontale max (±)
const PARTICLE_SIZE_MAX  = 2.4;   // rayon max
const PARTICLE_SIZE_MIN  = 0.3;   // rayon min
const PARTICLE_ALPHA_MAX = 0.7;   // opacité max à la création
const PARTICLE_ALPHA_MIN = 0.1;   // opacité min à la création
const PARTICLE_FADE      = 0.0005; // vitesse de fondu par frame
const GOLD_RATIO         = 0.55;  // proportion de particules dorées

// ─── Composant ──────────────────────────────────────────────────────
export default function Header({ isAuthenticated = false }: HeaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Particules canvas dorées/blanches ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Création des particules réparties sur toute la hauteur dès le départ
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,   // dispersion verticale initiale
      vx:    (Math.random() - 0.5) * PARTICLE_DRIFT,
      vy:    -(Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN),
      size:  Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
      alpha: Math.random() * (PARTICLE_ALPHA_MAX - PARTICLE_ALPHA_MIN) + PARTICLE_ALPHA_MIN,
      gold:  Math.random() > (1 - GOLD_RATIO),
    }));

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= PARTICLE_FADE;

        // Réinitialisation quand la particule sort par le haut ou s'estompe
        if (p.y < -8 || p.alpha <= 0) {
          p.x     = Math.random() * canvas.width;
          p.y     = canvas.height + 8;
          p.vx    = (Math.random() - 0.5) * PARTICLE_DRIFT;
          p.vy    = -(Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN);
          p.size  = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
          p.alpha = Math.random() * (PARTICLE_ALPHA_MAX - PARTICLE_ALPHA_MIN) + PARTICLE_ALPHA_MIN;
          p.gold  = Math.random() > (1 - GOLD_RATIO);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha.toFixed(2)})`
          : `rgba(255,255,255,${(p.alpha * 0.45).toFixed(2)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <header className={styles.header}>

      {/* ── Fonds décoratifs ── */}
      <div className={styles.backgrounds} aria-hidden="true">
        <div className={styles.bgRadial} />
        <div className={styles.bgVignette} />

        {/* Grille */}
        <svg className={styles.bgGrid}>
          <defs>
            <pattern id="hgrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>

        {/* Hexagone droit */}
        <svg className={styles.bgHexRight} viewBox="0 0 200 200">
          <polygon points="100,5 173,47 173,153 100,195 27,153 27,47" stroke="#C9A84C" strokeWidth="1" fill="none" />
          <polygon points="100,22 160,57 160,143 100,178 40,143 40,57" stroke="#C9A84C" strokeWidth="0.5" fill="none" />
          <polygon points="100,40 148,67 148,133 100,160 52,133 52,67" stroke="#C9A84C" strokeWidth="0.3" fill="none" />
        </svg>

        {/* Hexagone gauche */}
        <svg className={styles.bgHexLeft} viewBox="0 0 200 200">
          <polygon points="100,5 173,47 173,153 100,195 27,153 27,47" stroke="#C9A84C" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* ── Canvas particules ── */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* ── Contenu principal ── */}
      <div className={styles.content}>

        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Hub Communautaire Guild Wars 2
        </div>

        {/* Titre */}
        <h1 className={styles.title}>
          <span className={styles.titleGw2}>GW2</span>
          <span className={styles.titleNexus}>NEXUS</span>
        </h1>

        {/* Séparateur ornemental */}
        <div className={styles.ornament} aria-hidden="true">
          <div className={styles.ornamentLineLeft} />
          <svg className={styles.ornamentStar} viewBox="0 0 24 24">
            <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
          </svg>
          <div className={styles.ornamentLineRight} />
        </div>

        {/* Accroche */}
        <p className={styles.tagline}>
          Le hub communautaire ultime pour les aventuriers de Tyrie.
        </p>
        <p className={styles.subtitle}>
          Forums, builds, guildes et données de jeu — tout en un seul endroit.
        </p>

        {/* CTA */}
        <div className={styles.ctas}>
          {isAuthenticated ? (
            <Link to="/forum" className={styles.ctaPrimary}>
              ⚔&nbsp; Accéder au forum
            </Link>
          ) : (
            <>
              <Link to="/inscription" className={styles.ctaPrimary}>
                ⚔&nbsp; Rejoindre l'aventure
              </Link>
              <Link to="/forum" className={styles.ctaSecondary}>
                Explorer le forum
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {STATS.map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Flèche scroll ── */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>Découvrir</span>
        <svg className={styles.scrollArrow} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

    </header>
  );
}