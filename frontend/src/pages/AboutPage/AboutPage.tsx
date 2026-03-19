import { useEffect, useRef, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "12", label: "Tables de données", icon: "⬡" },
  { value: "6", label: "Sprints de développement", icon: "◈" },
  { value: "90+", label: "Attributs modélisés", icon: "✦" },
  { value: "3", label: "Mois pour le MVP", icon: "◎" },
];

const FEATURES = [
  {
    icon: "⚔",
    title: "Forum Communautaire",
    description:
      "Échangez stratégies, guides et expériences avec l'ensemble de la communauté GW2. Catégories, fils de discussion, réponses acceptées.",
    tag: "EP-03",
  },
  {
    icon: "◈",
    title: "Profils Joueurs",
    description:
      "Connectez votre clé API Guild Wars 2 pour afficher vos données de jeu, personnages et statistiques de compte directement sur votre profil.",
    tag: "EP-02",
  },
  {
    icon: "⬡",
    title: "Base de Données GW2",
    description:
      "Explorez objets, quêtes et événements du jeu avec des données fraîches issues de l'API officielle ArenaNet, enrichies par la communauté.",
    tag: "EP-04",
  },
  {
    icon: "✦",
    title: "Système de Builds",
    description:
      "Créez, partagez et commentez des builds pour toutes les professions. Filtrez par mode de jeu : PvE, PvP, WvW.",
    tag: "EP-06",
  },
  {
    icon: "◎",
    title: "Guildes",
    description:
      "Importez votre guilde depuis l'API GW2, gérez vos membres et créez un espace dédié à votre communauté de guilde.",
    tag: "EP-05",
  },
  {
    icon: "★",
    title: "Intégration API Officielle",
    description:
      "Synchronisation en temps réel avec l'API Guild Wars 2 pour des données toujours à jour : tokeninfo, items, world boss timers.",
    tag: "EP-04",
  },
];

const TEAM = [
  {
    name: "PERNOT Evan",
    role: "Frontend & DevOps",
    focus: ["React", "Docker", "CI/CD"],
    avatar: "D1",
    github: "evan-prn",
  },
  {
    name: "MORALES Julian",
    role: "Backend & Base de données",
    focus: ["Laravel", "MySQL", "API GW2", "Auth"],
    avatar: "D2",
    github: "",
  },
];

const STACK_ITEMS = [
  { name: "Laravel 11", category: "Backend", color: "#FF4444" },
  { name: "React 18", category: "Frontend", color: "#61DAFB" },
  { name: "MySQL 8", category: "Database", color: "#4479A1" },
  { name: "Docker", category: "DevOps", color: "#2496ED" },
  { name: "Sanctum", category: "Auth", color: "#C9A84C" },
  { name: "Vite", category: "Frontend", color: "#646CFF" },
  { name: "TailwindCSS", category: "Frontend", color: "#06B6D4" },
  { name: "Redis", category: "Cache", color: "#DC382D" },
  { name: "GitHub Actions", category: "CI/CD", color: "#2088FF" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedSection({ children, delay = 0, className = "" }) {
  const { ref, visible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "48px 0" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #C9A84C40)" }} />
      <span style={{ color: "#C9A84C", fontSize: "18px", opacity: 0.7 }}>✦</span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #C9A84C40)" }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0D0D0D;
          color: #E8E0D0;
          font-family: 'Raleway', sans-serif;
          line-height: 1.7;
          overflow-x: hidden;
        }

        .about-page {
          min-height: 100vh;
          background: #0D0D0D;
        }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 120px 24px 80px;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,0,0,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 20% 60%, rgba(30,30,60,0.3) 0%, transparent 70%),
            #0D0D0D;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 860px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 2px;
          font-size: 11px;
          font-family: 'Cinzel', serif;
          letter-spacing: 3px;
          color: #C9A84C;
          text-transform: uppercase;
          margin-bottom: 32px;
          background: rgba(201,168,76,0.05);
          animation: fadeIn 1s ease 0.2s both;
        }

        .hero-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -2px;
          margin-bottom: 8px;
          animation: fadeInUp 1s ease 0.4s both;
        }

        .hero-title-main {
          background: linear-gradient(135deg, #F5E6C0 0%, #C9A84C 40%, #E8C97A 70%, #8B6914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .hero-title-sub {
          display: block;
          font-size: clamp(14px, 2vw, 20px);
          font-family: 'Cinzel', serif;
          font-weight: 400;
          letter-spacing: 8px;
          color: rgba(201,168,76,0.5);
          text-transform: uppercase;
          margin-top: 16px;
          -webkit-text-fill-color: rgba(201,168,76,0.5);
        }

        .hero-description {
          font-size: 17px;
          font-weight: 300;
          color: rgba(232,224,208,0.7);
          max-width: 600px;
          margin: 40px auto 56px;
          animation: fadeInUp 1s ease 0.6s both;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          color: #0D0D0D;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          transition: all 0.3s ease;
          animation: fadeInUp 1s ease 0.8s both;
        }

        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201,168,76,0.4);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(201,168,76,0.4);
          font-size: 10px;
          font-family: 'Cinzel', serif;
          letter-spacing: 3px;
          text-transform: uppercase;
          animation: bounce 2s ease infinite;
        }

        /* ─── LAYOUT ─── */
        .section {
          padding: 100px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 64px;
        }

        .section-label {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 16px;
          opacity: 0.8;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700;
          color: #F5E6C0;
          line-height: 1.2;
        }

        .section-title span {
          color: #C9A84C;
        }

        .section-subtitle {
          margin-top: 16px;
          font-size: 15px;
          font-weight: 300;
          color: rgba(232,224,208,0.55);
          max-width: 560px;
        }

        /* ─── STATS ─── */
        .stats-band {
          background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.02) 100%);
          border-top: 1px solid rgba(201,168,76,0.1);
          border-bottom: 1px solid rgba(201,168,76,0.1);
          padding: 60px 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          max-width: 900px;
          margin: 0 auto;
        }

        .stat-item {
          text-align: center;
          padding: 32px 24px;
          position: relative;
        }

        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(201,168,76,0.15);
        }

        .stat-icon {
          font-size: 24px;
          color: #C9A84C;
          margin-bottom: 12px;
          opacity: 0.7;
          display: block;
        }

        .stat-value {
          font-family: 'Cinzel Decorative', serif;
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #F5E6C0, #C9A84C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 11px;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(232,224,208,0.45);
        }

        /* ─── FEATURES GRID ─── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.08);
        }

        .feature-card {
          background: #111111;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.04), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          background: #131313;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card-tag {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 9px;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          color: rgba(201,168,76,0.35);
          text-transform: uppercase;
        }

        .feature-icon {
          font-size: 28px;
          color: #C9A84C;
          margin-bottom: 20px;
          display: block;
          transition: transform 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-title {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 700;
          color: #F5E6C0;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .feature-description {
          font-size: 13.5px;
          font-weight: 300;
          color: rgba(232,224,208,0.55);
          line-height: 1.7;
        }

        /* ─── STACK ─── */
        .stack-section {
          padding: 100px 24px;
          background: radial-gradient(ellipse 80% 50% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%);
        }

        .stack-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stack-items {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 48px;
        }

        .stack-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          transition: all 0.25s ease;
          cursor: default;
        }

        .stack-item:hover {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.04);
          transform: translateY(-2px);
        }

        .stack-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .stack-name {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(232,224,208,0.8);
        }

        .stack-category {
          font-size: 10px;
          letter-spacing: 1px;
          color: rgba(232,224,208,0.3);
          text-transform: uppercase;
          padding-left: 10px;
          border-left: 1px solid rgba(255,255,255,0.1);
        }

        /* ─── MISSION ─── */
        .mission-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .mission-text p {
          font-size: 15px;
          font-weight: 300;
          color: rgba(232,224,208,0.65);
          margin-bottom: 24px;
        }

        .mission-text strong {
          color: #C9A84C;
          font-weight: 600;
        }

        .mission-ornament {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mission-ornament-inner {
          width: 280px;
          height: 280px;
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .mission-ornament-inner::before {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1px solid rgba(201,168,76,0.08);
          border-radius: 50%;
        }

        .mission-ornament-inner::after {
          content: '';
          position: absolute;
          inset: 40px;
          border: 1px solid rgba(201,168,76,0.05);
          border-radius: 50%;
        }

        .mission-center-symbol {
          font-family: 'Cinzel Decorative', serif;
          font-size: 64px;
          background: linear-gradient(135deg, #F5E6C0, #C9A84C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
        }

        /* ─── TEAM ─── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        .team-card {
          background: linear-gradient(135deg, #141414 0%, #111111 100%);
          border: 1px solid rgba(201,168,76,0.1);
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .team-card:hover {
          border-color: rgba(201,168,76,0.25);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .team-card:hover::before {
          opacity: 1;
        }

        .team-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #C9A84C20, #C9A84C10);
          border: 1px solid rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          color: #C9A84C;
          margin-bottom: 20px;
          clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
        }

        .team-name {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          color: #F5E6C0;
          margin-bottom: 4px;
        }

        .team-role {
          font-size: 12px;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .team-focus {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .team-tag {
          font-size: 11px;
          padding: 4px 10px;
          border: 1px solid rgba(201,168,76,0.2);
          color: rgba(232,224,208,0.5);
          font-family: 'Cinzel', serif;
          letter-spacing: 1px;
        }

        .team-github {
          margin-top: 20px;
          font-size: 11px;
          color: rgba(201,168,76,0.4);
          font-family: 'Cinzel', serif;
          letter-spacing: 1px;
        }

        /* ─── FOOTER BANNER ─── */
        .about-footer {
          padding: 80px 24px;
          text-align: center;
          border-top: 1px solid rgba(201,168,76,0.08);
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.02));
        }

        .footer-quote {
          font-family: 'Cinzel', serif;
          font-size: clamp(16px, 2.5vw, 22px);
          color: rgba(232,224,208,0.4);
          font-style: italic;
          max-width: 600px;
          margin: 0 auto 16px;
          letter-spacing: 1px;
        }

        .footer-attribution {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(201,168,76,0.3);
          font-family: 'Cinzel', serif;
        }

        /* ─── ANIMATIONS ─── */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2)::after { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .mission-layout { grid-template-columns: 1fr; gap: 40px; }
          .mission-ornament { display: none; }
          .team-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .hero-title { letter-spacing: -1px; }
        }
      `}</style>

      <div className="about-page">

        {/* ─── HERO ─── */}
        <section className="hero" ref={heroRef}>
          <div className="hero-bg" />
          <div className="hero-noise" />
          <div
            className="hero-grid"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />

          <div className="hero-content">
            <div className="hero-badge">
              <span>✦</span>
              Hub Communautaire Guild Wars 2
              <span>✦</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-main">GW2Nexus</span>
              <span className="hero-title-sub">Le Carrefour des Aventuriers</span>
            </h1>

            <p className="hero-description">
              Une plateforme communautaire moderne dédiée aux joueurs de Guild Wars 2 —
              forums, profils, builds, guildes et données de jeu réunies en un seul lieu.
            </p>

            <button className="hero-cta">
              <span>Rejoindre la communauté</span>
              <span>→</span>
            </button>
          </div>

          <div className="hero-scroll-indicator">
            <span>Découvrir</span>
            <span style={{ fontSize: "16px" }}>↓</span>
          </div>
        </section>

        {/* ─── STATS BAND ─── */}
        <div className="stats-band">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 100}>
                <div className="stat-item">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* ─── MISSION ─── */}
        <div className="section">
          <div className="mission-layout">
            <AnimatedSection>
              <div className="section-header" style={{ marginBottom: 32 }}>
                <span className="section-label">Notre Mission</span>
                <h2 className="section-title">
                  Construire le <span>nexus</span><br />de la communauté GW2
                </h2>
              </div>
              <div className="mission-text">
                <p>
                  Guild Wars 2 mérite une communauté à la hauteur de sa richesse.
                  GW2Nexus naît d'un constat simple : les joueurs francophones manquent
                  d'un <strong>hub centralisé</strong> combinant forum, données de jeu
                  et outils communautaires.
                </p>
                <p>
                  Notre approche repose sur l'<strong>intégration directe de l'API officielle
                  ArenaNet</strong> — vos données de compte, personnages et équipements
                  s'affichent en temps réel, sans copier-coller fastidieux.
                </p>
                <p>
                  Développé en <strong>stack moderne</strong> (Laravel · React · MySQL),
                  GW2Nexus est conçu pour la performance, la sécurité et l'évolutivité.
                  Un projet open-source porté par des joueurs, pour des joueurs.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="mission-ornament">
                <div className="mission-ornament-inner">
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "1px solid rgba(201,168,76,0.05)",
                      animation: "rotate 30s linear infinite",
                    }}
                  />
                  <span className="mission-center-symbol">⬡</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <GoldDivider />

          {/* ─── FEATURES ─── */}
          <AnimatedSection>
            <div className="section-header">
              <span className="section-label">Fonctionnalités</span>
              <h2 className="section-title">
                Tout ce dont un aventurier <span>a besoin</span>
              </h2>
              <p className="section-subtitle">
                Six épopées de développement pour un MVP complet et cohérent.
              </p>
            </div>
          </AnimatedSection>

          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 80}>
                <div className="feature-card">
                  <span className="feature-card-tag">{feature.tag}</span>
                  <span className="feature-icon">{feature.icon}</span>
                  <div className="feature-title">{feature.title}</div>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* ─── STACK ─── */}
        <div className="stack-section">
          <div className="stack-container">
            <AnimatedSection>
              <div className="section-header">
                <span className="section-label">Technologies</span>
                <h2 className="section-title">
                  Une stack <span>moderne</span> &amp; robuste
                </h2>
                <p className="section-subtitle">
                  Choix délibérés pour la performance, la maintenabilité et la sécurité.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="stack-items">
                {STACK_ITEMS.map((item) => (
                  <div key={item.name} className="stack-item">
                    <div
                      className="stack-dot"
                      style={{ backgroundColor: item.color, opacity: 0.85 }}
                    />
                    <span className="stack-name">{item.name}</span>
                    <span className="stack-category">{item.category}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* ─── TEAM ─── */}
        <div className="section">
          <AnimatedSection>
            <div className="section-header" style={{ textAlign: "center" }}>
              <span className="section-label">L&apos;Équipe</span>
              <h2 className="section-title" style={{ textAlign: "center" }}>
                Deux développeurs, <span>une vision</span>
              </h2>
              <p className="section-subtitle" style={{ margin: "16px auto 0" }}>
                Un projet Agile Scrum sur 6 sprints, mené avec rigueur et passion du jeu.
              </p>
            </div>
          </AnimatedSection>

          <div className="team-grid">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 150}>
                <div className="team-card">
                  <div className="team-avatar">{member.avatar}</div>
                  <div className="team-name">{member.name}</div>
                  <div className="team-role">{member.role}</div>
                  <div className="team-focus">
                    {member.focus.map((f) => (
                      <span key={f} className="team-tag">{f}</span>
                    ))}
                  </div>
                  {member.github && (
                    <div className="team-github">⌥ github.com/{member.github}</div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* ─── FOOTER BANNER ─── */}
        <div className="about-footer">
          <AnimatedSection>
            <p className="footer-quote">
              &ldquo;The journey is the destination.&rdquo;
            </p>
            <p className="footer-attribution">GW2Nexus · Built with ♥ for the GW2 Community</p>
          </AnimatedSection>
        </div>

      </div>
    </>
  );
}