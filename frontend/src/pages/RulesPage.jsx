import { useState, useRef, useEffect } from "react";

// ─── Hook animation ───────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    },
  };
}

// ─── Section block component ──────────────────────────────────────────────────

function Section({ number, title, children, delay = 0 }) {
  const { ref, style } = useReveal(delay);
  return (
    <div className="rs-section" ref={ref} style={style}>
      <div className="rs-section-title">
        <span className="rs-section-num">{number} —</span>
        {title}
      </div>
      <div className="rs-section-body">{children}</div>
    </div>
  );
}

// ─── TAB CONTENT ─────────────────────────────────────────────────────────────

function TabLegal() {
  return (
    <div className="rs-tab-content">
      <Section number="01" title="Éditeur du site">
        <p>
          Le site <strong>GW2Nexus</strong> (accessible à l'adresse <strong>gw2nexus.fr</strong>)
          est édité par une équipe de développeurs indépendants dans le cadre d'un projet
          communautaire open source dédié au jeu vidéo Guild Wars 2.
        </p>
        <p>
          <strong>Responsables de publication :</strong> Les membres de l'équipe GW2Nexus,
          joignables via <a href="mailto:contact@gw2nexus.fr">contact@gw2nexus.fr</a>.
        </p>
        <p>
          <strong>Code source :</strong>{" "}
          <a href="https://github.com/evan-prn/GW2Nexus" target="_blank" rel="noreferrer">
            github.com/evan-prn/GW2Nexus
          </a>
        </p>
      </Section>

      <Section number="02" title="Hébergement" delay={60}>
        <p>
          GW2Nexus est hébergé sur un serveur privé virtuel (VPS) sous Ubuntu 24 LTS,
          avec Nginx comme serveur web et PHP-FPM 8.3 pour l'exécution du backend Laravel.
          Les données sont stockées dans une base MySQL 8 avec sauvegardes quotidiennes.
        </p>
      </Section>

      <Section number="03" title="Propriété intellectuelle" delay={120}>
        <p>
          Le code source est publié sous licence open source (voir fichier <strong>LICENSE</strong> sur GitHub).
        </p>
        <p>
          Guild Wars 2, ArenaNet et tous les éléments du jeu sont la propriété exclusive
          d'<strong>ArenaNet, LLC</strong> et <strong>NCSoft Corporation</strong>. GW2Nexus n'est pas
          affilié à ArenaNet et utilise l'API officielle dans le respect des{" "}
          <a href="https://www.guildwars2.com/en/legal/guild-wars-2-content-terms-of-use/" target="_blank" rel="noreferrer">
            conditions d'utilisation du contenu GW2
          </a>.
        </p>
        <p>
          Les contributions des utilisateurs (discussions, builds, commentaires) restent
          la propriété de leurs auteurs. En publiant du contenu, l'utilisateur accorde
          à GW2Nexus une licence d'affichage non-exclusive et gratuite.
        </p>
      </Section>

      <Section number="04" title="Limitation de responsabilité" delay={180}>
        <p>
          GW2Nexus est fourni <strong>« en l'état »</strong>, sans garantie de disponibilité continue.
          L'équipe ne peut être tenue responsable des interruptions liées à la maintenance
          ou à des incidents techniques imprévus.
        </p>
        <p>
          Les données issues de l'API Guild Wars 2 sont affichées à titre informatif.
          GW2Nexus décline toute responsabilité en cas d'indisponibilité de l'API ArenaNet.
        </p>
        <p>
          GW2Nexus n'est pas responsable des contenus publiés par les utilisateurs.
          Un système de signalement est disponible pour tout contenu inapproprié.
        </p>
      </Section>

      <Section number="05" title="Cookies" delay={240}>
        <p>
          GW2Nexus utilise uniquement des cookies essentiels au fonctionnement de
          l'authentification (Laravel Sanctum, mode SPA cookie) : cookie de session
          et token CSRF. Ces cookies ne servent pas au tracking publicitaire.
        </p>
      </Section>

      <Section number="06" title="Droit applicable" delay={300}>
        <p>
          Les présentes mentions légales sont soumises au droit français.
          En cas de litige, les tribunaux français seront seuls compétents.
          Contact : <a href="mailto:legal@gw2nexus.fr">legal@gw2nexus.fr</a>
        </p>
      </Section>
    </div>
  );
}

function TabPrivacy() {
  return (
    <div className="rs-tab-content">
      <Section number="01" title="Introduction">
        <p>
          GW2Nexus accorde une importance capitale à la protection de vos données personnelles.
          Cette politique décrit quelles données sont collectées, pourquoi et comment,
          conformément au <strong>RGPD</strong> et à la loi Informatique et Libertés.
        </p>
        <p>
          Questions : <a href="mailto:privacy@gw2nexus.fr">privacy@gw2nexus.fr</a>
        </p>
      </Section>

      <Section number="02" title="Données collectées" delay={60}>
        <p>GW2Nexus collecte uniquement les données nécessaires au fonctionnement du service :</p>

        <div className="rs-data-grid">
          {[
            {
              icon: "◎", label: "Identité",
              items: ["Nom / pseudo d'affichage", "Adresse email", "Pseudo GW2 (optionnel)"],
            },
            {
              icon: "⬡", label: "Données de jeu",
              items: ["Clé API GW2 (chiffrée AES-256)", "Nom de compte GW2", "Serveur / monde", "Liste des personnages"],
            },
            {
              icon: "◈", label: "Contenu généré",
              items: ["Discussions et commentaires", "Builds créés", "Pages de guilde"],
            },
            {
              icon: "✦", label: "Données techniques",
              items: ["Adresse IP (logs serveur)", "Cookie de session", "Token CSRF"],
            },
          ].map((cat) => (
            <div key={cat.label} className="rs-data-card">
              <div className="rs-data-head">
                <span className="rs-data-icon">{cat.icon}</span>
                <span className="rs-data-label">{cat.label}</span>
              </div>
              <ul className="rs-data-list">
                {cat.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="rs-callout">
          <span className="rs-callout-icon">✦</span>
          <div>
            <div className="rs-callout-title">Clé API GW2 — protection renforcée</div>
            <p>
              Votre clé API est chiffrée en base de données via <strong>AES-256</strong> (fonction
              <code> encrypt()</code> Laravel) avant stockage. Elle n'est jamais exposée
              en clair dans les réponses API ni dans les logs serveur.
            </p>
          </div>
        </div>
      </Section>

      <Section number="03" title="Finalités du traitement" delay={120}>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="rs-list">
          <li>Gérer votre compte et authentifier vos connexions</li>
          <li>Afficher vos données GW2 sur votre profil public</li>
          <li>Publier vos discussions, builds et commentaires</li>
          <li>Envoyer des emails transactionnels (vérification, réinitialisation mot de passe)</li>
          <li>Assurer la sécurité et la modération de la plateforme</li>
        </ul>
        <p>
          GW2Nexus <strong>ne vend pas</strong> vos données et ne les partage avec
          aucun tiers à des fins publicitaires.
        </p>
      </Section>

      <Section number="04" title="Conservation des données" delay={180}>
        <p>
          Vos données sont conservées tant que votre compte est actif. En cas de suppression
          de compte, les données personnelles sont anonymisées sous <strong>30 jours</strong>.
          Les contenus publiés (discussions, builds) peuvent être conservés sous forme
          anonymisée pour maintenir la cohérence du forum.
        </p>
        <p>
          Les logs serveur sont conservés <strong>12 mois maximum</strong> à des fins de sécurité.
        </p>
      </Section>

      <Section number="05" title="Vos droits (RGPD)" delay={240}>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <div className="rs-rights-list">
          {[
            { icon: "◎", right: "Accès", desc: "Obtenir une copie de vos données personnelles" },
            { icon: "◈", right: "Rectification", desc: "Corriger des données inexactes ou incomplètes" },
            { icon: "⬡", right: "Effacement", desc: "Supprimer votre compte et vos données associées" },
            { icon: "✦", right: "Portabilité", desc: "Recevoir vos données dans un format structuré (JSON)" },
            { icon: "★", right: "Opposition", desc: "Vous opposer à certains traitements de vos données" },
          ].map((r) => (
            <div key={r.right} className="rs-right-row">
              <span className="rs-right-icon">{r.icon}</span>
              <span className="rs-right-name">{r.right}</span>
              <span className="rs-right-desc">{r.desc}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "20px" }}>
          Pour exercer ces droits : <a href="mailto:privacy@gw2nexus.fr">privacy@gw2nexus.fr</a>.
          En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>.
        </p>
      </Section>
    </div>
  );
}

function TabTerms() {
  return (
    <div className="rs-tab-content">
      <Section number="01" title="Acceptation des conditions">
        <p>
          En accédant à GW2Nexus et en créant un compte, vous acceptez sans réserve
          les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces
          conditions, veuillez ne pas utiliser le service.
        </p>
        <p>
          GW2Nexus se réserve le droit de modifier ces CGU à tout moment.
          Les utilisateurs seront notifiés par email des modifications substantielles.
        </p>
      </Section>

      <Section number="02" title="Inscription et compte" delay={60}>
        <p>
          Pour accéder aux fonctionnalités complètes, vous devez créer un compte avec
          une adresse email valide et un mot de passe sécurisé. Vous êtes seul responsable
          de la confidentialité de vos identifiants.
        </p>
        <ul className="rs-list">
          <li>Un seul compte par personne est autorisé</li>
          <li>Vous devez avoir 13 ans minimum pour vous inscrire</li>
          <li>Les informations fournies doivent être exactes</li>
          <li>Toute tentative de création de comptes multiples peut entraîner un bannissement</li>
        </ul>
      </Section>

      <Section number="03" title="Règles de conduite" delay={120}>
        <p>
          GW2Nexus est une communauté dédiée aux joueurs de Guild Wars 2.
          Tout utilisateur s'engage à respecter les règles suivantes :
        </p>

        <div className="rs-rules-grid">
          {[
            {
              type: "allowed", icon: "✓", title: "Autorisé",
              items: [
                "Partager guides, builds et stratégies",
                "Débattre dans le respect mutuel",
                "Signaler les contenus inappropriés",
                "Utiliser l'API GW2 pour son propre compte",
                "Créer et gérer une page de guilde",
              ],
            },
            {
              type: "forbidden", icon: "✗", title: "Interdit",
              items: [
                "Harcèlement, insultes, discriminations",
                "Spam ou contenu publicitaire non sollicité",
                "Partage d'informations personnelles de tiers",
                "Contenu illégal ou protégé sans autorisation",
                "Tentatives de contournement des systèmes de sécurité",
              ],
            },
          ].map((block) => (
            <div key={block.type} className={`rs-rules-block rs-rules-${block.type}`}>
              <div className="rs-rules-head">
                <span className="rs-rules-icon">{block.icon}</span>
                <span className="rs-rules-title">{block.title}</span>
              </div>
              <ul className="rs-rules-list">
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section number="04" title="Contenu utilisateur" delay={180}>
        <p>
          Vous êtes entièrement responsable des contenus que vous publiez (discussions,
          commentaires, builds). GW2Nexus se réserve le droit de supprimer tout contenu
          enfreignant ces CGU, sans préavis.
        </p>
        <p>
          En publiant du contenu, vous certifiez en être l'auteur ou disposer des droits
          nécessaires, et accordez à GW2Nexus une licence d'affichage gratuite et non-exclusive.
        </p>
      </Section>

      <Section number="05" title="Modération" delay={240}>
        <p>
          L'équipe GW2Nexus peut à tout moment, sans préavis ni justification :
        </p>
        <ul className="rs-list">
          <li>Supprimer ou modifier tout contenu enfreignant ces CGU</li>
          <li>Suspendre temporairement ou définitivement un compte</li>
          <li>Restreindre l'accès à certaines fonctionnalités</li>
        </ul>
        <p>
          Les décisions de modération peuvent être contestées par email à{" "}
          <a href="mailto:moderation@gw2nexus.fr">moderation@gw2nexus.fr</a>.
        </p>
      </Section>

      <Section number="06" title="Utilisation de l'API GW2" delay={300}>
        <p>
          L'utilisation de la clé API Guild Wars 2 sur GW2Nexus est soumise aux conditions
          d'ArenaNet. Vous ne devez fournir que votre propre clé API. GW2Nexus n'utilise
          la clé API qu'avec votre consentement explicite, uniquement pour les endpoints
          nécessaires à l'affichage de vos données.
        </p>
        <p>
          GW2Nexus respecte les limites de taux (rate limits) imposées par l'API ArenaNet
          et met en cache les réponses pour minimiser les appels.
        </p>
      </Section>

      <Section number="07" title="Résiliation" delay={360}>
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre
          profil. La suppression entraîne l'anonymisation de vos données dans un délai de
          30 jours conformément à notre politique de confidentialité.
        </p>
        <p>
          GW2Nexus peut résilier votre accès en cas de violation grave et répétée des
          présentes CGU, sans obligation de remboursement.
        </p>
      </Section>
    </div>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

const TABS = [
  {
    id: "legal",
    icon: "◎",
    label: "Mentions légales",
    shortLabel: "Légal",
    updated: "Janvier 2025",
    description: "Éditeur, hébergement, propriété intellectuelle et droit applicable.",
    component: TabLegal,
  },
  {
    id: "privacy",
    icon: "⬡",
    label: "Confidentialité",
    shortLabel: "Confidentialité",
    updated: "Janvier 2025",
    description: "Collecte, traitement et protection de vos données personnelles. RGPD.",
    component: TabPrivacy,
  },
  {
    id: "terms",
    icon: "◈",
    label: "Conditions d'utilisation",
    shortLabel: "CGU",
    updated: "Janvier 2025",
    description: "Règles d'utilisation, conduite, modération et responsabilités.",
    component: TabTerms,
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState("legal");
  const heroReveal = useReveal(0);
  const contentRef = useRef(null);

  const current = TABS.find((t) => t.id === activeTab);
  const ActiveComponent = current.component;

  function switchTab(id) {
    setActiveTab(id);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rules-page {
          min-height: 100vh;
          background: #0D0D0D;
          color: #E8E0D0;
          font-family: 'Raleway', sans-serif;
          line-height: 1.7;
          overflow-x: hidden;
        }

        /* ══════════════════════════════
           HERO
        ══════════════════════════════ */
        .rs-hero {
          position: relative;
          padding: 140px 24px 0;
          overflow: hidden;
        }

        .rs-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 65%),
            #0D0D0D;
        }

        .rs-hero-lines {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -55deg,
            rgba(201,168,76,0.018) 0px,
            rgba(201,168,76,0.018) 1px,
            transparent 1px,
            transparent 48px
          );
          mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 80%);
        }

        .rs-hero-content {
          position: relative; z-index: 2;
          max-width: 900px; margin: 0 auto;
          padding-bottom: 56px;
        }

        .rs-label {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Cinzel', serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 20px; opacity: 0.8;
        }
        .rs-label::before, .rs-label::after {
          content: ''; display: block; width: 20px; height: 1px;
          background: #C9A84C; opacity: 0.5;
        }

        .rs-hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(32px, 5vw, 54px);
          font-weight: 700; color: #F5E6C0;
          line-height: 1.1; margin-bottom: 16px;
        }
        .rs-hero-title span { color: #C9A84C; }

        .rs-hero-subtitle {
          font-size: 15px; font-weight: 300;
          color: rgba(232,224,208,0.5);
          max-width: 540px; line-height: 1.85;
        }

        /* ══════════════════════════════
           TABS BAR
        ══════════════════════════════ */
        .rs-tabs-bar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(13,13,13,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(201,168,76,0.12);
        }

        .rs-tabs-inner {
          max-width: 900px; margin: 0 auto;
          padding: 0 24px;
          display: flex; gap: 0;
        }

        .rs-tab-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 18px 28px;
          background: none; border: none; cursor: pointer;
          font-family: 'Cinzel', serif; font-size: 12px;
          letter-spacing: 1px;
          color: rgba(232,224,208,0.4);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .rs-tab-btn:hover {
          color: rgba(232,224,208,0.75);
          background: rgba(201,168,76,0.03);
        }

        .rs-tab-btn.rs-tab-active {
          color: #C9A84C;
          border-bottom-color: #C9A84C;
          background: rgba(201,168,76,0.04);
        }

        .rs-tab-icon { font-size: 14px; opacity: 0.8; }

        @media (max-width: 500px) {
          .rs-tab-btn { padding: 16px 16px; font-size: 10px; gap: 6px; }
          .rs-tab-icon { display: none; }
        }

        /* ══════════════════════════════
           TAB META CARD
        ══════════════════════════════ */
        .rs-tab-meta {
          max-width: 900px; margin: 0 auto;
          padding: 32px 24px 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }

        .rs-tab-meta-title {
          font-family: 'Cinzel', serif; font-size: 13px;
          font-weight: 700; color: rgba(232,224,208,0.6);
          letter-spacing: 0.5px; margin-bottom: 4px;
        }

        .rs-tab-meta-desc {
          font-size: 13px; font-weight: 300;
          color: rgba(232,224,208,0.4);
        }

        .rs-tab-updated {
          flex-shrink: 0;
          padding: 6px 12px;
          border: 1px solid rgba(201,168,76,0.12);
          background: rgba(201,168,76,0.03);
          font-family: 'Cinzel', serif; font-size: 9px;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(201,168,76,0.45);
          white-space: nowrap;
        }

        /* ══════════════════════════════
           CONTENT AREA
        ══════════════════════════════ */
        .rs-content {
          max-width: 900px; margin: 0 auto;
          padding: 56px 24px 100px;
          scroll-margin-top: 80px;
        }

        .rs-tab-content { display: flex; flex-direction: column; }

        /* ─── SECTION ─── */
        .rs-section {
          padding: 48px 0;
          border-bottom: 1px solid rgba(201,168,76,0.07);
        }
        .rs-section:first-child { padding-top: 0; }
        .rs-section:last-child { border-bottom: none; padding-bottom: 0; }

        .rs-section-title {
          font-family: 'Cinzel', serif; font-size: 17px;
          font-weight: 700; color: #F5E6C0;
          margin-bottom: 24px; letter-spacing: 0.5px;
          display: flex; align-items: center; gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }

        .rs-section-num {
          font-size: 10px; letter-spacing: 3px;
          color: rgba(201,168,76,0.5);
          font-family: 'Cinzel', serif;
          flex-shrink: 0;
        }

        .rs-section-body p {
          font-size: 14px; font-weight: 300;
          color: rgba(232,224,208,0.6); line-height: 1.9;
          margin-bottom: 14px;
        }
        .rs-section-body p:last-child { margin-bottom: 0; }
        .rs-section-body strong { color: rgba(232,224,208,0.85); font-weight: 600; }
        .rs-section-body code {
          font-family: monospace; font-size: 12px;
          color: #C9A84C;
          background: rgba(201,168,76,0.08);
          padding: 1px 6px; border-radius: 2px;
        }
        .rs-section-body a {
          color: #C9A84C; text-decoration: none;
          border-bottom: 1px solid rgba(201,168,76,0.25);
          transition: border-color 0.2s;
        }
        .rs-section-body a:hover { border-color: #C9A84C; }

        /* ─── DATA GRID ─── */
        .rs-data-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin: 20px 0;
        }

        .rs-data-card {
          padding: 18px;
          border: 1px solid rgba(201,168,76,0.1);
          background: rgba(201,168,76,0.02);
          transition: border-color 0.25s;
        }
        .rs-data-card:hover { border-color: rgba(201,168,76,0.2); }

        .rs-data-head {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px;
        }
        .rs-data-icon { color: #C9A84C; font-size: 13px; }
        .rs-data-label {
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 700; color: rgba(232,224,208,0.75);
        }

        .rs-data-list { list-style: none; }
        .rs-data-list li {
          font-size: 12.5px; font-weight: 300;
          color: rgba(232,224,208,0.5);
          padding: 4px 0;
          border-bottom: 1px solid rgba(201,168,76,0.05);
          display: flex; align-items: center; gap: 8px;
        }
        .rs-data-list li:last-child { border-bottom: none; }
        .rs-data-list li::before {
          content: '›'; color: rgba(201,168,76,0.4);
          font-size: 14px; flex-shrink: 0;
        }

        /* ─── CALLOUT ─── */
        .rs-callout {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 20px;
          border: 1px solid rgba(201,168,76,0.2);
          background: linear-gradient(135deg, rgba(201,168,76,0.05), rgba(201,168,76,0.02));
          margin-top: 20px;
        }
        .rs-callout-icon { font-size: 20px; color: #C9A84C; flex-shrink: 0; margin-top: 2px; }
        .rs-callout-title {
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 700; color: #F5E6C0; margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .rs-callout p {
          font-size: 13px !important; margin-bottom: 0 !important;
        }

        /* ─── GENERIC LIST ─── */
        .rs-list {
          list-style: none; margin: 14px 0;
        }
        .rs-list li {
          font-size: 14px; font-weight: 300;
          color: rgba(232,224,208,0.6);
          padding: 6px 0 6px 20px;
          position: relative;
          border-bottom: 1px solid rgba(201,168,76,0.05);
          line-height: 1.6;
        }
        .rs-list li:last-child { border-bottom: none; }
        .rs-list li::before {
          content: '◈';
          position: absolute; left: 0;
          color: rgba(201,168,76,0.4); font-size: 10px;
          top: 8px;
        }

        /* ─── RIGHTS LIST ─── */
        .rs-rights-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }

        .rs-right-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 16px;
          border: 1px solid rgba(201,168,76,0.08);
          background: #111111;
          transition: all 0.22s;
        }
        .rs-right-row:hover {
          border-color: rgba(201,168,76,0.2);
          transform: translateX(4px);
        }
        .rs-right-icon { font-size: 14px; color: #C9A84C; opacity: 0.7; flex-shrink: 0; width: 20px; text-align: center; }
        .rs-right-name {
          font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 700; color: rgba(232,224,208,0.8);
          width: 110px; flex-shrink: 0;
        }
        .rs-right-desc { font-size: 13px; font-weight: 300; color: rgba(232,224,208,0.5); }

        /* ─── RULES GRID (allowed / forbidden) ─── */
        .rs-rules-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin: 20px 0;
        }

        .rs-rules-block { padding: 20px; border: 1px solid; }

        .rs-rules-allowed {
          border-color: rgba(80,180,80,0.15);
          background: rgba(80,180,80,0.03);
        }
        .rs-rules-forbidden {
          border-color: rgba(220,80,80,0.15);
          background: rgba(220,80,80,0.03);
        }

        .rs-rules-head {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .rs-rules-icon {
          font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700;
        }
        .rs-rules-allowed .rs-rules-icon { color: rgba(80,200,80,0.8); }
        .rs-rules-forbidden .rs-rules-icon { color: rgba(220,80,80,0.8); }

        .rs-rules-title {
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
        }
        .rs-rules-allowed .rs-rules-title { color: rgba(80,200,80,0.7); }
        .rs-rules-forbidden .rs-rules-title { color: rgba(220,80,80,0.7); }

        .rs-rules-list { list-style: none; }
        .rs-rules-list li {
          font-size: 13px; font-weight: 300;
          color: rgba(232,224,208,0.55);
          padding: 5px 0 5px 16px;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          line-height: 1.5;
        }
        .rs-rules-list li:last-child { border-bottom: none; }
        .rs-rules-allowed .rs-rules-list li::before { content: '✓'; position: absolute; left: 0; color: rgba(80,200,80,0.5); font-size: 11px; top: 7px; }
        .rs-rules-forbidden .rs-rules-list li::before { content: '✗'; position: absolute; left: 0; color: rgba(220,80,80,0.5); font-size: 11px; top: 7px; }

        /* ══════════════════════════════
           RESPONSIVE
        ══════════════════════════════ */
        @media (max-width: 600px) {
          .rs-data-grid { grid-template-columns: 1fr; }
          .rs-rules-grid { grid-template-columns: 1fr; }
          .rs-right-name { width: auto; min-width: 90px; }
          .rs-tab-meta { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
      `}</style>

      <div className="rules-page">

        {/* ─── HERO ─── */}
        <section className="rs-hero">
          <div className="rs-hero-bg" />
          <div className="rs-hero-lines" />
          <div className="rs-hero-content" ref={heroReveal.ref} style={heroReveal.style}>
            <div className="rs-label">Règles &amp; Légal</div>
            <h1 className="rs-hero-title">
              Transparence &amp; <span>Confiance</span>
            </h1>
            <p className="rs-hero-subtitle">
              Mentions légales, politique de confidentialité et conditions d'utilisation
              de GW2Nexus — tout ce que vous devez savoir avant d'utiliser le service.
            </p>
          </div>
        </section>

        {/* ─── TABS BAR ─── */}
        <div className="rs-tabs-bar">
          <div className="rs-tabs-inner">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`rs-tab-btn${activeTab === tab.id ? " rs-tab-active" : ""}`}
                onClick={() => switchTab(tab.id)}
              >
                <span className="rs-tab-icon">{tab.icon}</span>
                {tab.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* ─── TAB META ─── */}
        <div className="rs-tab-meta">
          <div>
            <div className="rs-tab-meta-title">{current.label}</div>
            <div className="rs-tab-meta-desc">{current.description}</div>
          </div>
          <div className="rs-tab-updated">◎ Mis à jour : {current.updated}</div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="rs-content" ref={contentRef}>
          <ActiveComponent key={activeTab} />
        </div>

      </div>
    </>
  );
}