import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
  opacity: Math.random() * 0.5 + 0.2,
}));

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  return (
    <div className="nf-root">

      {/* Particules flottantes */}
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="nf-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            "--op": p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="nf-card animate-fade-in">

        {/* Ornement */}
        <div className="ornament mb-8" style={{ width: "160px" }}>
          <div className="ornament-line" />
          <div className="ornament-diamond" />
          <div className="ornament-line right" />
        </div>

        {/* Code 404 */}
        <div className="nf-code">404</div>
        <div className="nf-subtitle">Page introuvable</div>

        {/* Séparateur */}
        <hr className="divider-gold" style={{ width: "120px" }} />

        {/* Message lore */}
        <p className="text-lore text-lg nf-message">
          "Les brumes de Tyrie ont englouti cette destination."
        </p>
        <p className="text-muted text-sm nf-submessage">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>

        {/* Countdown */}
        <div className="nf-countdown">
          Retour à l'accueil dans
          <span className="nf-countdown-num">{countdown}</span>
          secondes
        </div>

        {/* Boutons */}
        <div className="flex flex-wrap gap-4" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            ⟵ Retour à l'accueil
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Page précédente
          </button>
        </div>

        <div className="nf-footer-ornament">GW2Nexus · Hub Communautaire</div>
      </div>
    </div>
  );
}