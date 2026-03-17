import { useState, useRef, useEffect } from "react";
import axios from "axios";

// ─── Hook animation ───────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    icon: "⬡",
    title: "Discord",
    description: "Rejoignez le serveur pour échanger en temps réel avec la communauté GW2Nexus.",
    action: "Rejoindre le Discord",
    href: "#",
    tag: "Communauté",
    delay: "Instantané",
  },
  {
    icon: "◈",
    title: "GitHub",
    description: "Signalez un bug ou proposez une fonctionnalité via les Issues du dépôt.",
    action: "Ouvrir une Issue",
    href: "https://github.com/evan-prn/GW2Nexus",
    tag: "Open Source",
    delay: "< 72h",
  },
  {
    icon: "✦",
    title: "Email",
    description: "Pour toute demande formelle, partenariat ou signalement de contenu urgent.",
    action: "contact@gw2nexus.fr",
    href: "mailto:contact@gw2nexus.fr",
    tag: "Formel",
    delay: "< 48h",
  },
];

const SUBJECTS = [
  { value: "bug",         label: "🐛 Signalement de bug" },
  { value: "feature",     label: "✦ Suggestion de fonctionnalité" },
  { value: "account",     label: "◈ Problème de compte" },
  { value: "api",         label: "⬡ Problème avec la clé API GW2" },
  { value: "partnership", label: "◎ Partenariat / Presse" },
  { value: "other",       label: "— Autre demande" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus]   = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors]   = useState({});
  const [globalError, setGlobalError] = useState("");

  const heroReveal  = useReveal(0);
  const formReveal  = useReveal(0);
  const chansReveal = useReveal(120);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Efface l'erreur du champ modifié
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setStatus("sending");

    try {
      // 1. Récupérer le cookie CSRF Sanctum (requis même pour les routes publiques)
      await axios.get("/sanctum/csrf-cookie", { withCredentials: true });

      // 2. Envoyer le formulaire
      await axios.post(
        "/api/v1/contact",
        {
          name:    form.name,
          email:   form.email,
          subject: form.subject || "other",
          message: form.message,
        },
        { withCredentials: true }
      );

      setStatus("sent");

    } catch (err) {
      // Erreurs de validation Laravel (422)
      if (err.response?.status === 422) {
        const laravelErrors = err.response.data.errors ?? {};
        // Laravel renvoie { field: ["message1"] } — on prend le premier message
        const mapped = Object.fromEntries(
          Object.entries(laravelErrors).map(([field, msgs]) => [field, msgs[0]])
        );
        setErrors(mapped);
        setStatus("idle");
        return;
      }

      // Rate limiting (429)
      if (err.response?.status === 429) {
        setGlobalError(
          err.response.data.message ?? "Trop de messages envoyés. Réessayez dans quelques minutes."
        );
        setStatus("error");
        return;
      }

      // Erreur serveur générique
      setGlobalError("Une erreur est survenue. Veuillez réessayer ou nous contacter via Discord.");
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-page {
          min-height: 100vh;
          background: #0D0D0D;
          color: #E8E0D0;
          font-family: 'Raleway', sans-serif;
          line-height: 1.7;
          overflow-x: hidden;
        }

        /* ══════ HERO ══════ */
        .cp-hero {
          position: relative; padding: 140px 24px 72px;
          border-bottom: 1px solid rgba(201,168,76,0.1); overflow: hidden;
        }
        .cp-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 20% 60%, rgba(201,168,76,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 80% 20%, rgba(30,40,80,0.15) 0%, transparent 60%),
            #0D0D0D;
        }
        .cp-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 100% at 20% 50%, black, transparent);
        }
        .cp-hero-inner {
          position: relative; z-index: 2; max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center;
        }
        .cp-label {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Cinzel', serif; font-size: 10px;
          letter-spacing: 4px; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 20px; opacity: 0.8;
        }
        .cp-label::before, .cp-label::after {
          content: ''; display: block; width: 20px; height: 1px; background: #C9A84C; opacity: 0.5;
        }
        .cp-hero-title {
          font-family: 'Cinzel', serif; font-size: clamp(30px, 4vw, 50px);
          font-weight: 700; color: #F5E6C0; line-height: 1.1; margin-bottom: 18px;
        }
        .cp-hero-title span { color: #C9A84C; }
        .cp-hero-sub { font-size: 14.5px; font-weight: 300; color: rgba(232,224,208,0.55); line-height: 1.85; }

        .cp-info-lines { display: flex; flex-direction: column; gap: 12px; }
        .cp-info-line {
          display: flex; align-items: center; gap: 14px; padding: 14px 18px;
          border: 1px solid rgba(201,168,76,0.1); background: rgba(201,168,76,0.025);
          transition: border-color 0.25s;
        }
        .cp-info-line:hover { border-color: rgba(201,168,76,0.22); }
        .cp-info-icon { font-size: 18px; color: #C9A84C; opacity: 0.75; flex-shrink: 0; width: 24px; text-align: center; }
        .cp-info-lbl { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(232,224,208,0.35); margin-bottom: 2px; }
        .cp-info-val { font-size: 13px; color: rgba(232,224,208,0.7); }

        /* ══════ MAIN ══════ */
        .cp-main {
          max-width: 1100px; margin: 0 auto; padding: 72px 24px 100px;
          display: grid; grid-template-columns: 1.5fr 1fr; gap: 64px; align-items: start;
        }

        .cp-block-title {
          font-family: 'Cinzel', serif; font-size: 19px; font-weight: 700;
          color: #F5E6C0; margin-bottom: 28px;
          display: flex; align-items: center; gap: 12px;
        }
        .cp-block-title::before {
          content: ''; display: block; width: 3px; height: 20px;
          background: linear-gradient(to bottom, #C9A84C, transparent); flex-shrink: 0;
        }

        /* ══════ FORM ══════ */
        .cp-field { margin-bottom: 18px; }
        .cp-field-label {
          display: block; font-family: 'Cinzel', serif; font-size: 9px;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(201,168,76,0.55); margin-bottom: 8px;
        }
        .cp-input, .cp-select, .cp-textarea {
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.12);
          color: #E8E0D0; font-family: 'Raleway', sans-serif;
          font-size: 14px; font-weight: 300; outline: none;
          transition: border-color 0.25s, background 0.25s;
          -webkit-appearance: none; border-radius: 0;
        }
        .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
          border-color: rgba(201,168,76,0.38); background: rgba(201,168,76,0.025);
        }
        .cp-input::placeholder, .cp-textarea::placeholder { color: rgba(232,224,208,0.18); }
        .cp-input.has-error, .cp-select.has-error, .cp-textarea.has-error {
          border-color: rgba(220, 80, 80, 0.5);
          background: rgba(220,80,80,0.03);
        }
        .cp-textarea { resize: vertical; min-height: 130px; }
        .cp-select { cursor: pointer; }
        .cp-select option { background: #1a1a1a; color: #E8E0D0; }
        .cp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* ─── Erreur de champ ─── */
        .cp-field-error {
          margin-top: 6px; font-size: 12px; font-weight: 300;
          color: rgba(220, 100, 100, 0.85);
          display: flex; align-items: center; gap: 6px;
        }
        .cp-field-error::before { content: '⚠'; font-size: 10px; }

        /* ─── Erreur globale ─── */
        .cp-global-error {
          padding: 14px 18px; margin-bottom: 20px;
          border: 1px solid rgba(220,80,80,0.25);
          background: rgba(220,80,80,0.06);
          font-size: 13px; font-weight: 300;
          color: rgba(220, 120, 120, 0.9);
          display: flex; align-items: center; gap: 10px;
        }
        .cp-global-error::before { content: '⚠'; font-size: 16px; flex-shrink: 0; }

        /* ─── Submit ─── */
        .cp-submit {
          width: 100%; padding: 14px; margin-top: 6px;
          background: linear-gradient(135deg, #C9A84C, #8B6914);
          border: none; cursor: pointer;
          font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: #0D0D0D;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          transition: all 0.3s;
        }
        .cp-submit:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,0.3);
        }
        .cp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .cp-submit-inner { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .cp-spinner {
          width: 13px; height: 13px; border-radius: 50%;
          border: 2px solid rgba(13,13,13,0.25); border-top-color: #0D0D0D;
          animation: cpSpin 0.65s linear infinite;
        }
        @keyframes cpSpin { to { transform: rotate(360deg); } }

        /* ─── Succès ─── */
        .cp-success {
          padding: 48px 24px; text-align: center;
          border: 1px solid rgba(201,168,76,0.2); background: rgba(201,168,76,0.03);
          display: flex; flex-direction: column; align-items: center; gap: 14px;
        }
        .cp-success-icon { font-size: 36px; color: #C9A84C; }
        .cp-success-title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #F5E6C0; }
        .cp-success-text { font-size: 14px; font-weight: 300; color: rgba(232,224,208,0.5); max-width: 320px; line-height: 1.7; }

        /* ══════ CHANNELS ══════ */
        .cp-channels { display: flex; flex-direction: column; gap: 14px; }
        .cp-channel {
          padding: 20px 18px; border: 1px solid rgba(201,168,76,0.1); background: #111111;
          position: relative; overflow: hidden; transition: all 0.25s;
        }
        .cp-channel::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .cp-channel:hover { border-color: rgba(201,168,76,0.22); background: #131313; transform: translateX(4px); }
        .cp-channel:hover::before { opacity: 1; }
        .cp-channel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .cp-channel-name { display: flex; align-items: center; gap: 8px; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; color: #F5E6C0; }
        .cp-channel-icon { color: #C9A84C; font-size: 14px; }
        .cp-channel-badges { display: flex; align-items: center; gap: 6px; }
        .cp-channel-tag { font-size: 9px; font-family: 'Cinzel', serif; letter-spacing: 2px; text-transform: uppercase; color: rgba(201,168,76,0.4); border: 1px solid rgba(201,168,76,0.15); padding: 2px 7px; }
        .cp-channel-delay { font-size: 9px; font-family: 'Cinzel', serif; letter-spacing: 1px; color: rgba(232,224,208,0.3); }
        .cp-channel-desc { font-size: 12.5px; font-weight: 300; color: rgba(232,224,208,0.45); margin-bottom: 10px; line-height: 1.6; }
        .cp-channel-link { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 1px; color: #C9A84C; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: gap 0.2s; }
        .cp-channel-link:hover { gap: 9px; }

        /* ══════ RESPONSIVE ══════ */
        @media (max-width: 768px) {
          .cp-hero-inner { grid-template-columns: 1fr; gap: 36px; }
          .cp-main { grid-template-columns: 1fr; gap: 48px; }
          .cp-field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="contact-page">

        {/* ─── HERO ─── */}
        <section className="cp-hero">
          <div className="cp-hero-bg" />
          <div className="cp-hero-grid" />
          <div className="cp-hero-inner" ref={heroReveal.ref} style={heroReveal.style}>
            <div>
              <div className="cp-label">Contact</div>
              <h1 className="cp-hero-title">
                Prenez <span>contact</span><br />avec nous
              </h1>
              <p className="cp-hero-sub">
                Une question, un bug à signaler, une idée à partager ?
                Choisissez le canal le plus adapté à votre demande.
              </p>
            </div>
            <div className="cp-info-lines">
              {[
                { icon: "⏱", lbl: "Délai de réponse email",   val: "< 48h ouvrées" },
                { icon: "⬡", lbl: "Discord communautaire",     val: "Réponse instantanée" },
                { icon: "◈", lbl: "Issues GitHub",             val: "Traitement sous 72h" },
                { icon: "◎", lbl: "Modération & signalements", val: "moderation@gw2nexus.fr" },
              ].map((s) => (
                <div key={s.lbl} className="cp-info-line">
                  <span className="cp-info-icon">{s.icon}</span>
                  <div>
                    <div className="cp-info-lbl">{s.lbl}</div>
                    <div className="cp-info-val">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MAIN ─── */}
        <div className="cp-main">

          {/* ─── FORMULAIRE ─── */}
          <div ref={formReveal.ref} style={formReveal.style}>
            <div className="cp-block-title">Envoyer un message</div>

            {status === "sent" ? (
              <div className="cp-success">
                <span className="cp-success-icon">✦</span>
                <div className="cp-success-title">Message envoyé !</div>
                <p className="cp-success-text">
                  Nous avons bien reçu votre message et vous répondrons dans les 48h ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Erreur globale (rate limit, erreur serveur) */}
                {globalError && (
                  <div className="cp-global-error">{globalError}</div>
                )}

                <div className="cp-field-row">
                  <div className="cp-field">
                    <label className="cp-field-label">Nom ou pseudo GW2</label>
                    <input
                      className={`cp-input${errors.name ? " has-error" : ""}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="ArondorTheLion.1234"
                    />
                    {errors.name && <div className="cp-field-error">{errors.name}</div>}
                  </div>
                  <div className="cp-field">
                    <label className="cp-field-label">Adresse email</label>
                    <input
                      className={`cp-input${errors.email ? " has-error" : ""}`}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="joueur@exemple.fr"
                    />
                    {errors.email && <div className="cp-field-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="cp-field">
                  <label className="cp-field-label">Sujet</label>
                  <select
                    className={`cp-select${errors.subject ? " has-error" : ""}`}
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez un sujet…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {errors.subject && <div className="cp-field-error">{errors.subject}</div>}
                </div>

                <div className="cp-field">
                  <label className="cp-field-label">Message</label>
                  <textarea
                    className={`cp-textarea${errors.message ? " has-error" : ""}`}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande en détail… (10 caractères minimum)"
                  />
                  {errors.message && <div className="cp-field-error">{errors.message}</div>}
                </div>

                <button
                  className="cp-submit"
                  type="submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? (
                    <span className="cp-submit-inner">
                      <span className="cp-spinner" />
                      Envoi en cours…
                    </span>
                  ) : "Envoyer le message →"}
                </button>

              </form>
            )}
          </div>

          {/* ─── CANAUX ─── */}
          <div ref={chansReveal.ref} style={chansReveal.style}>
            <div className="cp-block-title">Autres canaux</div>
            <div className="cp-channels">
              {CHANNELS.map((ch) => (
                <div key={ch.title} className="cp-channel">
                  <div className="cp-channel-head">
                    <div className="cp-channel-name">
                      <span className="cp-channel-icon">{ch.icon}</span>
                      {ch.title}
                    </div>
                    <div className="cp-channel-badges">
                      <span className="cp-channel-delay">{ch.delay}</span>
                      <span className="cp-channel-tag">{ch.tag}</span>
                    </div>
                  </div>
                  <p className="cp-channel-desc">{ch.description}</p>
                  <a href={ch.href} className="cp-channel-link" target="_blank" rel="noreferrer">
                    {ch.action} →
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}