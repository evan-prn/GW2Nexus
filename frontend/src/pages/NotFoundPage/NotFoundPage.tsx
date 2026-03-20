import { useEffect, useRef, useState }  from 'react';
import { useNavigate }                  from 'react-router-dom';

import PageTitle from '@/hooks/usePageTitle';

import styles from './NotFoundPage.module.css';

// ─── Types ──────────────────────────────────────────────────────────
interface Particle {
  id:       number;
  x:        number;
  y:        number;
  size:     number;
  duration: number;
  delay:    number;
  opacity:  number;
}

// ─── Données particules — générées une seule fois hors du composant ──
const PARTICLES: Particle[] = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  x:        Math.random() * 100,
  y:        Math.random() * 100,
  size:     Math.random() * 3 + 1,
  duration: Math.random() * 6 + 4,
  delay:    Math.random() * 4,
  opacity:  Math.random() * 0.5 + 0.2,
}));

// ─── Composant ──────────────────────────────────────────────────────
export default function NotFoundPage() {
  const navigate    = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Countdown — redirige vers / à 0 */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          navigate('/');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [navigate]);

  return (
    <div className={styles.root}>

      <PageTitle title="Page non trouvée - GW2 Nexus" />

      {/* ── Particules flottantes ── */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left:              `${p.x}%`,
            top:               `${p.y}%`,
            width:             p.size,
            height:            p.size,
            '--op':            p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Card centrale ── */}
      <div className={styles.card}>

        {/* Ornement décoratif */}
        <div className={styles.ornament}>
          <div className={styles.ornamentLine} />
          <div className={styles.ornamentDiamond} />
          <div className={styles.ornamentLineRight} />
        </div>

        {/* Code 404 */}
        <div className={styles.code}>404</div>

        {/* Sous-titre */}
        <div className={styles.subtitle}>Page introuvable</div>

        {/* Séparateur doré */}
        <hr className={styles.divider} />

        {/* Message lore */}
        <p className={styles.message}>
          "Les brumes de Tyrie ont englouti cette destination."
        </p>
        <p className={styles.submessage}>
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>

        {/* Countdown */}
        <div className={styles.countdown}>
          Retour à l'accueil dans
          <span className={styles.countdownNum}>{countdown}</span>
          secondes
        </div>

        {/* Boutons */}
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate('/')}
          >
            ⟵ Retour à l'accueil
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => navigate(-1)}
          >
            Page précédente
          </button>
        </div>

        {/* Footer ornement */}
        <p className={styles.footerOrnament}>
          GW2Nexus · Hub Communautaire
        </p>

      </div>
    </div>
  );
}