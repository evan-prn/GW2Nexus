/**
 * AuthLayout — wrapper visuel des pages d'authentification
 * Fond atmosphérique GW2, logo, ornements dorés
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {/* Fond animé */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-grid" />
      </div>

      {/* Contenu centré */}
      <div className="auth-container">
        {/* Logo GW2Nexus */}
        <div className="auth-logo">
          <div className="auth-logo-emblem">
            <GW2LogoIcon />
          </div>
          <div className="auth-logo-text">
            <span className="auth-logo-gw2">GW2</span>
            <span className="auth-logo-nexus">Nexus</span>
          </div>
          <p className="auth-logo-tagline">Le hub communautaire Guild Wars 2</p>
        </div>

        {/* Card principale */}
        <div className="auth-card">
          <div className="auth-card-inner">
            {children}
          </div>
          {/* Bordure dorée décorative */}
          <div className="auth-card-border" aria-hidden="true" />
        </div>

        {/* Footer */}
        <p className="auth-footer">
          © 2025 GW2Nexus — Projet communautaire non officiel
        </p>
      </div>
    </div>
  );
};

// ─── SVG Logo GW2 simplifié ─────────────────────────────────────────
const GW2LogoIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="20,2 37,11 37,29 20,38 3,29 3,11"
      stroke="#C9A84C"
      strokeWidth="1.5"
      fill="rgba(201,168,76,0.08)"
    />
    <polygon
      points="20,8 31,14 31,26 20,32 9,26 9,14"
      stroke="#C9A84C"
      strokeWidth="0.8"
      fill="rgba(201,168,76,0.05)"
      opacity="0.6"
    />
    <text
      x="20"
      y="24"
      textAnchor="middle"
      fill="#C9A84C"
      fontSize="11"
      fontFamily="Cinzel, serif"
      fontWeight="700"
    >
      N
    </text>
  </svg>
);

export default AuthLayout;