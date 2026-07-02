const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.defineLayout({ name: "GW2", width: 13.33, height: 7.5 });
pptx.layout = "GW2";
pptx.author = "Evan Pernot";
pptx.title = "GW2 Nexus & GW2Nexus Mobile — Soutenance de projet";

const C = {
  gold: "C9A84C",
  goldLight: "F0D98A",
  goldDark: "8B6914",
  bgVoid: "0A0A0A",
  bgDeep: "0E0E12",
  bgSurface: "16161C",
  bgCard: "1C1C24",
  textPrimary: "F0E8D8",
  textSecondary: "C0A888",
  success: "52C48A",
  error: "F06060",
  warning: "E0B030",
  info: "70AADE",
  white: "FFFFFF",
};
const FT = "Georgia";
const FB = "Calibri";

let pageNum = 0;

function baseSlide(kicker) {
  pageNum++;
  const slide = pptx.addSlide();
  slide.background = { color: C.bgDeep };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.gold }, line: { type: "none" } });
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: 0.6, y: 0.26, w: 10, h: 0.3, fontFace: FB, fontSize: 11, color: C.gold, bold: true, charSpacing: 2,
    });
  }
  slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 7.1, w: 12.13, h: 0.01, fill: { color: C.bgCard }, line: { type: "none" } });
  slide.addText("GW2 Nexus & GW2Nexus Mobile — Soutenance de projet de fin d'études", {
    x: 0.6, y: 7.14, w: 9.5, h: 0.3, fontFace: FB, fontSize: 8, color: C.textSecondary,
  });
  slide.addText(String(pageNum), {
    x: 12.2, y: 7.14, w: 0.53, h: 0.3, fontFace: FB, fontSize: 8, color: C.textSecondary, align: "right",
  });
  return slide;
}

function slideTitle(slide, text, y = 0.62, size = 26) {
  slide.addText(text, { x: 0.6, y, w: 12.13, h: 0.7, fontFace: FT, fontSize: size, color: C.textPrimary, bold: true });
}

function subtitleLine(slide, text, y) {
  slide.addText(text, { x: 0.6, y, w: 12.13, h: 0.45, fontFace: FB, fontSize: 14, italic: true, color: C.textSecondary });
}

function bulletBlock(slide, items, opts = {}) {
  const x = opts.x ?? 0.6, y = opts.y ?? 1.55, w = opts.w ?? 12.13, h = opts.h ?? 5.2, fontSize = opts.fontSize ?? 15;
  const runs = items.map((it) => ({
    text: it,
    options: { bullet: { code: "25CF" }, breakLine: true, color: C.textPrimary, fontSize, fontFace: FB, paraSpaceAfter: 10 },
  }));
  slide.addText(runs, { x, y, w, h, valign: "top", lineSpacingMultiple: 1.15 });
}

function twoColBullets(slide, leftHeading, leftItems, rightHeading, rightItems, opts = {}) {
  const y = opts.y ?? 1.55;
  const colW = 5.85;
  slide.addText(leftHeading, { x: 0.6, y: y, w: colW, h: 0.4, fontFace: FT, fontSize: 15, bold: true, color: C.gold });
  bulletBlock(slide, leftItems, { x: 0.6, y: y + 0.5, w: colW, h: 4.6, fontSize: 13 });
  slide.addText(rightHeading, { x: 6.88, y: y, w: colW, h: 0.4, fontFace: FT, fontSize: 15, bold: true, color: C.gold });
  bulletBlock(slide, rightItems, { x: 6.88, y: y + 0.5, w: colW, h: 4.6, fontSize: 13 });
  slide.addShape(pptx.ShapeType.rect, { x: 6.665, y: y, w: 0.01, h: 5.1, fill: { color: C.bgCard }, line: { type: "none" } });
}

function card(slide, x, y, w, h, heading, body, accent) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: C.bgCard }, line: { color: accent || C.gold, width: 1 } });
  slide.addText(heading, { x: x + 0.18, y: y + 0.1, w: w - 0.36, h: 0.35, fontFace: FT, fontSize: 13, bold: true, color: accent || C.gold });
  slide.addText(body, { x: x + 0.18, y: y + 0.48, w: w - 0.36, h: h - 0.62, fontFace: FB, fontSize: 10.5, color: C.textPrimary, valign: "top", lineSpacingMultiple: 1.08 });
}

function placeholder(slide, x, y, w, h, label) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.bgSurface }, line: { color: C.gold, width: 1, dashType: "dash" } });
  slide.addText("📷", { x, y: y + h / 2 - 0.5, w, h: 0.5, align: "center", fontSize: 22 });
  slide.addText(label, { x: x + 0.2, y: y + h / 2 + 0.05, w: w - 0.4, h: 0.5, align: "center", fontSize: 11, italic: true, color: C.textSecondary, fontFace: FB });
}

function dataTable(slide, x, y, w, header, rows, colW, opts = {}) {
  const fontSize = opts.fontSize || 10;
  const headerRow = header.map((h) => ({
    text: h, options: { bold: true, color: C.bgDeep, fill: { color: C.gold }, fontSize, fontFace: FB, align: "left", valign: "middle" },
  }));
  const bodyRows = rows.map((r, i) =>
    r.map((c) => ({
      text: String(c),
      options: { color: C.textPrimary, fill: { color: i % 2 === 0 ? C.bgSurface : C.bgCard }, fontSize, fontFace: FB, valign: "middle" },
    }))
  );
  slide.addTable([headerRow, ...bodyRows], { x, y, w, colW, border: { type: "solid", color: C.bgDeep, pt: 0.5 }, autoPage: false });
}

function sectionDivider(num, titleText, subtitleText) {
  pageNum++;
  const slide = pptx.addSlide();
  slide.background = { color: C.bgVoid };
  slide.addShape(pptx.ShapeType.rect, { x: 0.9, y: 3.45, w: 2.2, h: 0.035, fill: { color: C.gold }, line: { type: "none" } });
  slide.addText(num, { x: 0.85, y: 2.05, w: 3, h: 1.2, fontFace: FT, fontSize: 60, bold: true, color: C.goldDark });
  slide.addText(titleText, { x: 0.9, y: 3.6, w: 11.5, h: 1, fontFace: FT, fontSize: 34, bold: true, color: C.textPrimary });
  if (subtitleText) slide.addText(subtitleText, { x: 0.9, y: 4.45, w: 10.5, h: 0.8, fontFace: FB, fontSize: 15, italic: true, color: C.textSecondary });
  slide.addText(String(pageNum), { x: 12.2, y: 7.14, w: 0.53, h: 0.3, fontFace: FB, fontSize: 8, color: C.textSecondary, align: "right" });
  return slide;
}

function statRow(slide, y, stats) {
  const n = stats.length;
  const gap = 0.3;
  const w = (12.13 - gap * (n - 1)) / n;
  stats.forEach((s, i) => {
    const x = 0.6 + i * (w + gap);
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 1.5, rectRadius: 0.06, fill: { color: C.bgCard }, line: { color: C.gold, width: 0.75 } });
    slide.addText(s.value, { x, y: y + 0.15, w, h: 0.75, align: "center", fontFace: FT, fontSize: 28, bold: true, color: C.gold });
    slide.addText(s.label, { x: x + 0.1, y: y + 0.92, w: w - 0.2, h: 0.5, align: "center", fontFace: FB, fontSize: 10.5, color: C.textPrimary });
  });
}

/* ═══════════════════════════ 0. PAGE DE GARDE ═══════════════════════════ */
{
  const slide = pptx.addSlide();
  slide.background = { color: C.bgVoid };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 3.55, w: 13.33, h: 0.02, fill: { color: C.gold }, line: { type: "none" } });
  slide.addText("⚔", { x: 0, y: 1.15, w: 13.33, h: 1, align: "center", fontSize: 40, color: C.gold });
  slide.addText("GW2 NEXUS", { x: 0, y: 1.95, w: 13.33, h: 1.1, align: "center", fontFace: FT, fontSize: 54, bold: true, color: C.textPrimary, charSpacing: 4 });
  slide.addText("& GW2NEXUS MOBILE", { x: 0, y: 2.95, w: 13.33, h: 0.6, align: "center", fontFace: FT, fontSize: 22, bold: true, color: C.gold, charSpacing: 3 });
  slide.addText("Plateforme communautaire web et mobile pour Guild Wars 2 — timers d'événements, profil de compte synchronisé, forum et encyclopédie d'objets", {
    x: 1.5, y: 3.75, w: 10.33, h: 0.7, align: "center", fontFace: FB, fontSize: 14, italic: true, color: C.textSecondary,
  });
  const infoY = 5.05;
  const info = [
    ["Auteur", "Evan Pernot"],
    ["Formation", "À compléter — intitulé exact de la formation"],
    ["Année", "2025 – 2026"],
    ["Entreprise / contexte", "À compléter si applicable (projet réalisé en autonomie, historique Git du 11/03/2026 au 02/07/2026)"],
  ];
  info.forEach((row, i) => {
    const y = infoY + i * 0.42;
    slide.addText(row[0], { x: 3.2, y, w: 2.4, h: 0.38, fontFace: FB, fontSize: 11, bold: true, color: C.gold, align: "right" });
    slide.addText(row[1], { x: 5.75, y, w: 5.2, h: 0.38, fontFace: FB, fontSize: 11, color: C.textPrimary, align: "left" });
  });
  pageNum = 1;
  slide.addText("1", { x: 12.2, y: 7.14, w: 0.53, h: 0.3, fontFace: FB, fontSize: 8, color: C.textSecondary, align: "right" });
}

/* ═══════════════════════════ SOMMAIRE ═══════════════════════════ */
{
  const slide = baseSlide("Sommaire");
  slideTitle(slide, "Sommaire");
  const left = [
    "1. Contexte", "2. Présentation générale", "3. GW2 Nexus (web)", "4. GW2Nexus Mobile",
    "5. Fonctionnalités (comparatif)", "6. Architecture globale", "7. Architecture technique",
    "8. Technologies utilisées", "9. Choix techniques (ADR)",
  ];
  const right = [
    "10. Déroulement du projet", "11. Méthodologie", "12. Difficultés rencontrées", "13. Résultats",
    "14. Analyse critique", "15. Compétences mobilisées", "16. Perspectives d'évolution", "17. Conclusion",
    "18. Grilles d'évaluation  ·  19. Annexes",
  ];
  bulletBlock(slide, left, { x: 0.6, y: 1.6, w: 5.85, fontSize: 15 });
  bulletBlock(slide, right, { x: 6.88, y: 1.6, w: 5.85, fontSize: 15 });
}

/* ═══════════════════════════ 1. CONTEXTE ═══════════════════════════ */
sectionDivider("01", "Contexte", "Guild Wars 2, le besoin et les utilisateurs ciblés");

{
  const slide = baseSlide("Contexte");
  slideTitle(slide, "Guild Wars 2 : un univers, une communauté active");
  bulletBlock(slide, [
    "Guild Wars 2 (ArenaNet) est un MMORPG persistant : monde ouvert, méta-événements programmés, personnages multiples par compte.",
    "L'API officielle ArenaNet (api.guildwars2.com/v2) expose les données de compte, personnages, objets et statistiques du jeu.",
    "Autour du jeu s'est construit un écosystème d'outils tiers non officiels : wiki communautaire, tableurs de timers, serveurs Discord.",
    "Ces outils sont dispersés, non liés au vrai compte du joueur, et demandent de jongler entre plusieurs onglets/applications.",
  ]);
}

{
  const slide = baseSlide("Contexte");
  slideTitle(slide, "Le besoin auquel répond le projet");
  bulletBlock(slide, [
    "Constat de départ : aucun outil ne centralise à la fois le suivi des événements en temps réel, les données réelles du compte joueur et un espace d'échange communautaire.",
    "Les joueurs perdent du temps à vérifier plusieurs sources pour une information simple (« le prochain world boss commence quand ? »).",
    "Les outils existants ne se connectent pas au compte GW2 réel : impossible de savoir en un coup d'œil quels bosses ont déjà été vaincus aujourd'hui.",
    "GW2 Nexus répond à ce besoin en connectant nativement l'API officielle ArenaNet à une plateforme communautaire moderne.",
  ]);
}

{
  const slide = baseSlide("Contexte");
  slideTitle(slide, "Utilisateurs cibles & objectifs");
  twoColBullets(
    slide,
    "Profils utilisateurs (personas)",
    [
      "Joueur occasionnel — timers d'événements, calendrier",
      "Joueur investi — profil GW2, synchronisation de compte",
      "Membre de guilde — forum communautaire",
      "Modérateur — outils de modération et de signalement",
      "Administrateur — back-office complet",
    ],
    "Objectifs du projet",
    [
      "Centraliser en un seul endroit ce que les joueurs cherchent au quotidien",
      "Intégrer l'API officielle ArenaNet plutôt que reconstruire les données",
      "Offrir un espace communautaire modéré et sécurisé",
      "Construire une base technique documentée et évolutive",
      "Étendre l'expérience sur mobile (GW2Nexus Mobile)",
    ]
  );
}

/* ═══════════════════════════ 2. PRÉSENTATION GÉNÉRALE ═══════════════════════════ */
sectionDivider("02", "Présentation générale", "Pourquoi ce projet existe et ce qu'il apporte");

{
  const slide = baseSlide("Présentation générale");
  slideTitle(slide, "Pourquoi ce projet existe");
  bulletBlock(slide, [
    "« Fini de jongler entre le wiki, les tableurs et Discord » — positionnement affiché dans le README du projet.",
    "Les alternatives existantes (wiki, tableurs communautaires, bots Discord) ne sont pas liées au compte réel du joueur.",
    "Aucune de ces solutions ne propose en même temps timers + profil + communauté modérée dans une interface unique.",
    "Le projet vise un produit complet, pas un simple prototype : authentification robuste, sécurité des données, modération, documentation.",
  ]);
}

{
  const slide = baseSlide("Présentation générale");
  slideTitle(slide, "Bénéfices apportés");
  dataTable(
    slide, 0.6, 1.5, 12.13,
    ["Besoin observé", "Réponse apportée par GW2 Nexus"],
    [
      ["Suivre les world bosses sans tableur externe", "Timers en direct synchronisés sur l'heure UTC officielle du jeu"],
      ["Savoir si un boss a déjà été vaincu aujourd'hui", "Lecture directe du compte GW2 via clé API chiffrée (AES-256)"],
      ["Échanger avec la communauté en sécurité", "Forum avec catégories, modération, signalement, mentions @utilisateur"],
      ["Retrouver rapidement des informations sur les objets du jeu", "Encyclopédie d'objets avec recherche plein texte (Meilisearch)"],
      ["Garder l'accès aux essentiels en déplacement", "Application mobile Flutter (auth, timers, notifications)"],
    ],
    [4.6, 7.53],
    { fontSize: 12 }
  );
}

/* ═══════════════════════════ 3. GW2 NEXUS (WEB) ═══════════════════════════ */
sectionDivider("03", "GW2 Nexus", "La plateforme web — React 19 / Laravel 12");

{
  const slide = baseSlide("GW2 Nexus — Web");
  slideTitle(slide, "Objectif & fonctionnement général");
  bulletBlock(slide, [
    "Single Page Application React consommant une API REST Laravel versionnée (/api/v1/*), aucune logique métier côté client.",
    "Authentification par token Bearer (Laravel Sanctum) : inscription, connexion, réinitialisation de mot de passe.",
    "Le navigateur ne contacte jamais directement l'API ArenaNet : toutes les requêtes GW2 transitent par le backend, avec cache.",
    "Système de rôles progressif : utilisateur → modérateur → administrateur, avec sanctions (bannissement temporaire/permanent).",
  ]);
  placeholder(slide, 8.8, 5.3, 3.9, 1.5, "Capture d'écran : Tableau de bord / Accueil");
}

{
  const slide = baseSlide("GW2 Nexus — Web");
  slideTitle(slide, "Fonctionnalités principales");
  twoColBullets(
    slide,
    "Compte & profil",
    [
      "Inscription / connexion / déconnexion (Sanctum)",
      "Liaison de la clé API GW2 (chiffrée AES-256)",
      "Personnages, monde, nom de compte synchronisés",
      "Statut journalier des world bosses vaincus",
    ],
    "Communauté & contenu",
    [
      "Timers d'événements et world bosses en direct",
      "Forum : catégories, sujets, réponses, signalements",
      "Mentions @utilisateur et chat codes GW2 dans le forum",
      "Encyclopédie d'objets GW2 (recherche, favoris, commentaires)",
    ]
  );
}

{
  const slide = baseSlide("GW2 Nexus — Web · Zoom fonctionnalité");
  slideTitle(slide, "Zoom : l'encyclopédie d'objets GW2");
  bulletBlock(slide, [
    "Dernier module livré (branche feature/items-encyclopedia) : synchronisation par lots de 200 objets depuis /v2/items et /v2/itemstats.",
    "Indexation Meilisearch (Laravel Scout) pour une recherche instantanée avec filtres (type, rareté, profession, poids d'armure...).",
    "Fiche objet complète : statistiques, méthode d'obtention, favoris (mise à jour optimiste côté React), commentaires modérables.",
    "Décodage des chat codes GW2 ([&...]) côté backend (Gw2ChatCodeService) pour afficher une carte objet cliquable dans le forum.",
    "Résolution des mentions @utilisateur et des chat codes en un seul appel groupé (staleTime 10 min) pour limiter les requêtes.",
  ], { fontSize: 14 });
  placeholder(slide, 9.1, 3.9, 3.6, 2.6, "Capture d'écran : fiche d'un objet");
}

{
  const slide = baseSlide("GW2 Nexus — Web · Zoom fonctionnalité");
  slideTitle(slide, "Zoom : forum communautaire modéré");
  bulletBlock(slide, [
    "Catégories → sujets → réponses, avec épinglage et verrouillage réservés aux modérateurs/administrateurs.",
    "Signalement de contenu (5 motifs : spam, insulte, harcèlement, contenu inapproprié, autre), anti-doublon et anti-auto-signalement.",
    "File de modération dédiée : traitement des signalements avec statut (résolu / rejeté) et traçabilité du modérateur.",
    "Autocomplétion @mention et #objet dans l'éditeur de message, avec rendu enrichi (ForumContent) : mentions en gras, objets en carte cliquable.",
  ], { fontSize: 14 });
  placeholder(slide, 9.1, 3.9, 3.6, 2.6, "Capture d'écran : fil de discussion");
}

{
  const slide = baseSlide("GW2 Nexus — Web");
  slideTitle(slide, "Sécurité");
  bulletBlock(slide, [
    "Authentification API stateless par token Bearer (Sanctum), tokens stockés sous forme de hash SHA-256 côté serveur.",
    "Clé API GW2 chiffrée en base via le cast Eloquent \"encrypted\" (AES-256, dérivé d'APP_KEY) — jamais exposée en JSON (attribut $hidden).",
    "Mots de passe hachés en bcrypt (12 rounds) ; rate limiting sur les endpoints sensibles (login 5/min, mot de passe oublié 3/min, contact 3/10 min).",
    "Middleware BanCheck sur toute requête authentifiée : un compte banni est bloqué immédiatement (403), même avec un token valide.",
    "Rôle stocké en enum sur la table users, retiré du mass assignment ($fillable) pour empêcher toute élévation de privilège via l'API.",
  ]);
}

{
  const slide = baseSlide("GW2 Nexus — Web");
  slideTitle(slide, "Performances");
  bulletBlock(slide, [
    "Cache applicatif sur les appels à l'API ArenaNet (Laravel Cache) : 60 s pour la validation de clé, 300 s pour compte/personnages/world bosses.",
    "Recherche d'objets déportée sur Meilisearch (index dédié) plutôt que des requêtes LIKE coûteuses en MySQL.",
    "Chargement différé des pages React (lazy + Suspense) et virtualisation des listes longues (@tanstack/react-virtual).",
    "Pagination systématique côté API (forum, objets, utilisateurs admin) pour éviter le sur-chargement du frontend.",
  ]);
}

{
  const slide = baseSlide("GW2 Nexus — Web");
  slideTitle(slide, "Avantages & limites");
  twoColBullets(
    slide,
    "Avantages",
    [
      "Données réelles du compte GW2 (pas de ressaisie manuelle)",
      "API REST versionnée, documentée (39 documents dans docs/)",
      "Sécurité prise au sérieux dès la conception (ADR dédiées)",
      "Design system centralisé, accessibilité (RGAA) engagée",
    ],
    "Limites actuelles",
    [
      "Pipeline de déploiement continu (CD) non finalisé",
      "Tests frontend (Vitest) et E2E (Playwright) absents",
      "Cache API en base de données, Redis envisagé pour la montée en charge",
      "Granularité des rôles limitée (enum simple, pas de permissions fines)",
    ]
  );
}

/* ═══════════════════════════ 4. GW2NEXUS MOBILE ═══════════════════════════ */
sectionDivider("04", "GW2Nexus Mobile", "Le client Flutter — authentification, événements, notifications");

{
  const slide = baseSlide("GW2Nexus Mobile");
  slideTitle(slide, "Objectif & fonctionnement");
  bulletBlock(slide, [
    "Application Flutter/Dart connectée à la même API Laravel que le site web (/api/v1/*), sans duplication de logique métier.",
    "Périmètre volontairement restreint et abouti : authentification, consultation des events/world bosses, notifications locales.",
    "Aucune réécriture de logique serveur : le mobile consomme les endpoints déjà exposés et testés pour le web.",
    "pubspec.yaml décrit l'app comme un « Mobile Flutter client for GW2Nexus authentication » — un module encore early-stage, complémentaire du web.",
  ]);
  placeholder(slide, 9.0, 3.3, 3.7, 3.2, "Capture d'écran : écran de connexion mobile");
}

{
  const slide = baseSlide("GW2Nexus Mobile");
  slideTitle(slide, "Navigation");
  bulletBlock(slide, [
    "Barre de navigation Material 3 en bas d'écran avec 3 onglets : Accueil, Événements, Profil (NavigationBar + IndexedStack).",
    "Écran d'accueil : résumé des events actifs/imminents et aperçu des 3 prochains départs.",
    "Écran Événements : liste complète avec filtres (Tous / World Bosses / Bientôt / En cours), countdown live, pull-to-refresh.",
    "Écran Profil : identité du compte, rôle, statut de la clé API GW2, gestion des notifications, déconnexion.",
    "Gestion d'état par Provider (ChangeNotifier) — deux services globaux : AuthService et EventScheduleService.",
  ]);
}

{
  const slide = baseSlide("GW2Nexus Mobile");
  slideTitle(slide, "Synchronisation avec le backend");
  bulletBlock(slide, [
    "Login (POST /api/v1/auth/login), session (GET /api/v1/auth/me), déconnexion (POST /api/v1/auth/logout) — mêmes endpoints que le web.",
    "Option « Se souvenir de moi » : token persisté via flutter_secure_storage (Keychain/Keystore), sinon conservé en mémoire uniquement.",
    "Couche ApiService dédiée (package http) : timeout 20 s, messages d'erreur contextualisés (réseau, 401, 422, 500).",
    "Liste des events/world bosses récupérée via GET /api/v1/events/schedule ; countdown et statut recalculés localement chaque seconde.",
    "URL de l'API configurable au build (--dart-define=API_BASE_URL), valeur par défaut adaptée à l'émulateur Android (10.0.2.2:8000).",
  ], { fontSize: 14 });
}

{
  const slide = baseSlide("GW2Nexus Mobile");
  slideTitle(slide, "Notifications");
  bulletBlock(slide, [
    "Basées sur flutter_local_notifications ; demande de permission déclenchée depuis l'onglet Profil (Android 13+ : POST_NOTIFICATIONS).",
    "Notification de test disponible pour vérifier que les alertes fonctionnent, une fois la permission accordée.",
    "Notification locale unique programmée automatiquement 5 minutes avant le départ du prochain événement suivi.",
    "Déduplication par occurrence d'événement (clé « id événement + horodatage ») pour garantir une seule alerte par départ.",
  ]);
  placeholder(slide, 9.0, 4.4, 3.7, 2.1, "Capture d'écran : notifications & profil");
}

{
  const slide = baseSlide("GW2Nexus Mobile");
  slideTitle(slide, "Avantages & limites");
  twoColBullets(
    slide,
    "Avantages",
    [
      "Réutilise l'API existante : pas de logique métier dupliquée",
      "Stockage sécurisé du token (flutter_secure_storage)",
      "Notifications locales utiles sans backend push dédié",
      "Périmètre restreint mais entièrement fonctionnel",
    ],
    "Limites actuelles",
    [
      "Pas de forum, pas d'encyclopédie d'objets côté mobile",
      "Pas d'interface d'administration/modération sur mobile",
      "Pas d'inscription (login sur compte déjà créé sur le web)",
      "Un seul test (smoke test), pas de tests d'intégration",
    ]
  );
}

/* ═══════════════════════════ 5. TABLEAU FONCTIONNALITÉS ═══════════════════════════ */
sectionDivider("05", "Fonctionnalités", "Comparatif Web / Mobile");

{
  const slide = baseSlide("Fonctionnalités");
  slideTitle(slide, "Comparatif des fonctionnalités", 0.62, 24);
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Fonctionnalité", "Web", "Mobile", "Description"],
    [
      ["Authentification", "✅", "✅", "Login / logout / session, Bearer token Sanctum partagé"],
      ["Inscription", "✅", "❌", "Le mobile suppose un compte déjà créé sur le web"],
      ["Profil & clé API GW2", "✅", "⚠️", "Web : gestion complète ; mobile : consultation du statut uniquement"],
      ["Timers World Boss / Events", "✅", "✅", "Countdown temps réel, statut personnalisé si compte lié"],
      ["Notifications d'événement", "❌", "✅", "Notification locale unique 5 min avant le départ (mobile only)"],
      ["Forum communautaire", "✅", "❌", "Catégories, sujets, réponses, mentions, chat codes"],
      ["Encyclopédie d'objets GW2", "✅", "❌", "Recherche Meilisearch, favoris, commentaires"],
      ["Administration / modération", "✅", "❌", "Gestion utilisateurs, bans, signalements"],
    ],
    [3.3, 1.1, 1.1, 6.63],
    { fontSize: 11 }
  );
}

/* ═══════════════════════════ 6. ARCHITECTURE GLOBALE ═══════════════════════════ */
sectionDivider("06", "Architecture globale", "Vue d'ensemble du système");

{
  const slide = baseSlide("Architecture globale");
  slideTitle(slide, "Vue d'ensemble du système");
  const boxes = [
    { t: "React 19 SPA", d: "Vite · TypeScript · Zustand · TanStack Query", y: 1.55 },
    { t: "Laravel 12 API", d: "Sanctum · Eloquent · Form Requests · Cache", y: 3.1 },
  ];
  boxes.forEach((b) => {
    slide.addShape(pptx.ShapeType.roundRect, { x: 3.5, y: b.y, w: 6.33, h: 1.15, rectRadius: 0.08, fill: { color: C.bgCard }, line: { color: C.gold, width: 1.25 } });
    slide.addText(b.t, { x: 3.7, y: b.y + 0.12, w: 5.9, h: 0.45, fontFace: FT, fontSize: 16, bold: true, color: C.gold });
    slide.addText(b.d, { x: 3.7, y: b.y + 0.58, w: 5.9, h: 0.45, fontFace: FB, fontSize: 11, color: C.textPrimary });
  });
  slide.addText("HTTP/JSON — Bearer Token", { x: 3.5, y: 2.72, w: 6.33, h: 0.3, align: "center", fontFace: FB, fontSize: 10, italic: true, color: C.textSecondary });
  const bottom = [
    { t: "MySQL 8.0", d: "15 tables métier", x: 1.0 },
    { t: "API ArenaNet GW2", d: "Cache 5 min · fallback gracieux", x: 6.6 },
    { t: "Flutter Mobile", d: "Même API REST /api/v1", x: 9.75 },
  ];
  bottom.forEach((b) => {
    slide.addShape(pptx.ShapeType.roundRect, { x: b.x, y: 4.65, w: 3.55, h: 1.05, rectRadius: 0.08, fill: { color: C.bgSurface }, line: { color: C.textSecondary, width: 1 } });
    slide.addText(b.t, { x: b.x + 0.15, y: 4.75, w: 3.25, h: 0.4, fontFace: FT, fontSize: 13, bold: true, color: C.textPrimary });
    slide.addText(b.d, { x: b.x + 0.15, y: 5.15, w: 3.25, h: 0.4, fontFace: FB, fontSize: 9.5, color: C.textSecondary });
  });
  bulletBlock(slide, ["L'API ArenaNet n'est jamais appelée depuis le navigateur ou le mobile : toutes les requêtes transitent par le backend Laravel."], { x: 0.6, y: 6.0, w: 12.13, h: 0.7, fontSize: 12 });
}

{
  const slide = baseSlide("Architecture globale");
  slideTitle(slide, "Flux de requête type");
  twoColBullets(
    slide,
    "Connexion utilisateur",
    [
      "1. POST /auth/login (rate limit 5/min)",
      "2. Auth::attempt + vérification BanCheck",
      "3. Émission d'un token Sanctum (Bearer)",
      "4. Retour user + token, stocké côté client",
    ],
    "Lecture profil GW2",
    [
      "1. Requête auth:sanctum → Gw2ApiService",
      "2. Cache hit (5 min) → réponse immédiate",
      "3. Cache miss → appel /v2/account ArenaNet",
      "4. Résultat mis en cache puis renvoyé au client",
    ]
  );
}

{
  const slide = baseSlide("Architecture globale");
  slideTitle(slide, "Diagrammes d'architecture");
  bulletBlock(slide, [
    "Diagrammes formalisés dans docs/architecture/diagrammes.md (notation Mermaid) : C4 Contexte, C4 Conteneurs, C4 Composants Backend, ERD complet, séquences (authentification, synchronisation GW2), diagramme d'état de la modération forum.",
  ], { fontSize: 13, h: 0.9 });
  placeholder(slide, 0.6, 2.6, 5.85, 4.1, "Diagramme C4 — Contexte & Conteneurs");
  placeholder(slide, 6.68, 2.6, 5.85, 4.1, "Modèle de données (ERD)");
}

/* ═══════════════════════════ 7. ARCHITECTURE TECHNIQUE ═══════════════════════════ */
sectionDivider("07", "Architecture technique", "API, services, modèles, composants, état");

{
  const slide = baseSlide("Architecture technique — Backend");
  slideTitle(slide, "Organisation du backend Laravel");
  dataTable(
    slide, 0.6, 1.5, 12.13,
    ["Couche", "Rôle", "Volumétrie constatée"],
    [
      ["Controllers", "Points d'entrée HTTP, groupés par domaine", "24 contrôleurs (Auth, Profile, Forum, Items, Events, Contact, Admin)"],
      ["Services", "Logique métier réutilisable (GW2, admin, chat codes)", "4 services : Gw2ApiService, AdminUserService, Gw2ChatCodeService, Gw2ItemSyncService"],
      ["Models (Eloquent)", "Accès et relations aux données", "12 modèles (User, ProfilGw2, UserBan, Forum*, Item*)"],
      ["Form Requests", "Validation des entrées avant traitement", "17 requêtes de formulaire dédiées"],
      ["API Resources", "Sérialisation JSON contrôlée (jamais de données sensibles)", "12 resources (ex. UserMentionResource sans email)"],
      ["Migrations", "Schéma de base versionné", "15 migrations, de users à item_comment_reports"],
    ],
    [2.6, 5.5, 4.03],
    { fontSize: 11 }
  );
}

{
  const slide = baseSlide("Architecture technique — Frontend");
  slideTitle(slide, "Pattern hook → API → UI (React)");
  bulletBlock(slide, [
    "Un hook personnalisé par besoin métier (ex. useItemsSearch, useForumThreads) encapsule l'appel API et la mise en cache TanStack Query.",
    "Toutes les URLs sont centralisées dans api/endpoint.ts — règle de code explicite : aucune URL en dur dans les composants.",
    "Zustand réservé à l'état global synchrone (authStore, profileStore) ; TanStack Query gère toutes les données serveur (cache, invalidation, refetch).",
    "Exemple concret : useItemFavorite applique une mise à jour optimiste du cache (onMutate) avec rollback automatique en cas d'échec (onError).",
  ]);
}

{
  const slide = baseSlide("Architecture technique");
  slideTitle(slide, "Zustand vs TanStack Query — règle de séparation");
  dataTable(
    slide, 0.6, 1.55, 12.13,
    ["Type de donnée", "Outil utilisé", "Pourquoi"],
    [
      ["État utilisateur global (session)", "Zustand (persist localStorage)", "Synchrone, disponible partout sans requête"],
      ["Données serveur (forum, profil, objets)", "TanStack Query", "Cache, invalidation, refetch automatique"],
      ["État d'interface local (formulaire, modale)", "useState", "Local au composant, pas de partage global"],
    ],
    [3.8, 3.6, 4.73],
    { fontSize: 12 }
  );
  bulletBlock(slide, [
    "Anti-patterns explicitement documentés (docs/frontend/state-management.md) : ne jamais stocker de données serveur dans Zustand, ne jamais appeler l'API directement dans un composant.",
  ], { x: 0.6, y: 4.4, w: 12.13, h: 1.5, fontSize: 12.5 });
}

{
  const slide = baseSlide("Architecture technique");
  slideTitle(slide, "Sécurité, stockage & gestion des erreurs");
  twoColBullets(
    slide,
    "Authentification & stockage",
    [
      "Sanctum Bearer : token en localStorage (web) ou secure storage (mobile)",
      "Clé API GW2 chiffrée AES-256 via cast Eloquent \"encrypted\"",
      "Cache Laravel (driver database) pour les appels API GW2",
      "Indexation Meilisearch synchronisée avec MySQL (Laravel Scout)",
    ],
    "Gestion des erreurs",
    [
      "Web : intercepteur Axios global (401 → purge du token)",
      "Erreurs métier (403/422/500) gérées localement par hook/composant",
      "Mobile : ApiException typée (réseau, timeout, HTTP, format)",
      "Backend : retour \"null\" gracieux + log si l'API GW2 échoue"
    ]
  );
}

/* ═══════════════════════════ 8. TECHNOLOGIES UTILISÉES ═══════════════════════════ */
sectionDivider("08", "Technologies utilisées", "Stack frontend, backend, mobile et infrastructure");

{
  const slide = baseSlide("Technologies — Frontend & Mobile");
  slideTitle(slide, "Frontend web & mobile", 0.62, 24);
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Technologie", "Utilisation", "Pourquoi ce choix"],
    [
      ["React 19 + TypeScript 5.8", "SPA web", "Écosystème mature, typage statique, communauté large"],
      ["Vite 7", "Build & dev server", "Démarrage et HMR très rapides vs. Webpack"],
      ["Zustand 5", "État global léger", "API minimale, pas de boilerplate Redux"],
      ["TanStack Query v5", "Cache & fetch serveur", "Invalidation/refetch automatiques, réduit le code manuel"],
      ["Tailwind CSS 4 + CSS Modules", "Style", "Design system centralisé, classes scoppées par composant"],
      ["Flutter / Dart", "Application mobile", "Un seul code base pour Android/iOS, hot reload"],
      ["Provider (Flutter)", "État mobile", "Pattern simple adapté au périmètre restreint de l'app"],
    ],
    [3.2, 3.3, 5.63],
    { fontSize: 10.5 }
  );
}

{
  const slide = baseSlide("Technologies — Backend & Infrastructure");
  slideTitle(slide, "Backend & infrastructure", 0.62, 24);
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Technologie", "Utilisation", "Pourquoi ce choix"],
    [
      ["Laravel 12 / PHP 8.4", "API REST", "Écosystème complet (Eloquent, Sanctum, validation, cache)"],
      ["Laravel Sanctum 4.3", "Auth API par token", "Bearer token léger, multi-client (web + mobile), sans CSRF"],
      ["MySQL 8.0", "Base de données relationnelle", "Fiable, bien supporté, relations FK strictes"],
      ["Laravel Scout + Meilisearch", "Recherche full-text objets", "Recherche instantanée avec filtres/facettes, sans surcharger MySQL"],
      ["Docker Compose (5 services)", "Environnement local", "Environnement reproductible : MySQL, phpMyAdmin, Mailpit, API, SPA"],
      ["GitHub Actions", "Intégration continue", "Automatise lint, tests et build à chaque push/PR"],
    ],
    [3.2, 3.3, 5.63],
    { fontSize: 10.5 }
  );
}

/* ═══════════════════════════ 9. CHOIX TECHNIQUES (ADR) ═══════════════════════════ */
sectionDivider("09", "Choix techniques", "Décisions d'architecture documentées (ADR)");

{
  const slide = baseSlide("Choix techniques");
  slideTitle(slide, "Décisions d'architecture (1/2)", 0.62, 24);
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Décision", "Pourquoi", "Alternative écartée"],
    [
      ["Sanctum en mode Bearer Token (pas cookie SPA)", "API consommable par plusieurs clients (web + mobile), pas de CSRF", "Auth par cookie/session — multi-client plus complexe"],
      ["Chiffrement AES-256 de la clé API GW2 (cast Eloquent)", "Chiffrement transparent en écriture/lecture, dérivé d'APP_KEY", "Stockage en clair — risque de fuite critique"],
      ["API versionnée /api/v1/*", "Permet une future v2 sans breaking change", "API non versionnée — migrations risquées"],
      ["Cache Laravel (driver database) sur l'API GW2", "Respecte les limites de débit ArenaNet", "Appels non cachés — risque de rate limit"],
    ],
    [3.9, 4.7, 3.53],
    { fontSize: 10.5 }
  );
}

{
  const slide = baseSlide("Choix techniques");
  slideTitle(slide, "Décisions d'architecture (2/2)", 0.62, 24);
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Décision", "Pourquoi", "Alternative écartée"],
    [
      ["Rôles via enum sur users (pas de table roles)", "Simplicité, pas de jointure pour un besoin encore limité", "Table de permissions dédiée (Spatie) — envisagée pour plus tard"],
      ["Forum : suppression définitive des posts (pas de soft delete)", "La suppression par un modérateur doit être immédiate et invisible", "Soft delete uniforme — masquerait mal le contenu modéré"],
      ["Proxy Vite en développement (/api/* → laravel:8000)", "Évite les problèmes CORS/cookies en environnement local", "CORS ouvert en dev — configuration plus fragile"],
      ["Recherche objets via Meilisearch (Scout)", "Recherche instantanée avec facettes, sans requêtes LIKE coûteuses", "Recherche SQL LIKE — performance dégradée à l'échelle"],
    ],
    [3.9, 4.7, 3.53],
    { fontSize: 10.5 }
  );
}

/* ═══════════════════════════ 10. DÉROULEMENT DU PROJET ═══════════════════════════ */
sectionDivider("10", "Déroulement du projet", "De l'amorçage à l'encyclopédie d'objets");

{
  const slide = baseSlide("Déroulement du projet");
  slideTitle(slide, "Frise chronologique", 0.62, 24);
  const phases = [
    ["11–13 mars 2026", "Amorçage : monorepo Laravel + React, Docker, authentification"],
    ["16 mars – 1 avr. 2026", "Frontend (TS, dashboard admin), events, mise en production VPS"],
    ["2 avril – 1 juin 2026", "Interruption du projet (~2 mois)"],
    ["2 juin 2026", "Audit complet du projet existant"],
    ["4–5 juin 2026", "Reprise : version stabilisée + Forum V1"],
    ["18–22 juin 2026", "Stabilisation Phase 1 (PHP 8.4, CI squelette), World Boss, documentation /docs"],
    ["1 juillet 2026", "Sprint qualité : CI GitHub Actions, accessibilité RGAA, correctifs responsive"],
    ["2 juillet 2026", "Encyclopédie d'objets GW2 + mentions/chat codes forum"],
  ];
  dataTable(slide, 0.6, 1.4, 12.13, ["Période", "Événement"], phases, [3.2, 8.93], { fontSize: 11 });
}

{
  const slide = baseSlide("Déroulement du projet");
  slideTitle(slide, "Phases du cycle de développement");
  bulletBlock(slide, [
    "Analyse des besoins & spécifications — docs/product/vision.md (personas, fonctionnalités, contraintes).",
    "Conception & architecture — ADR documentées, schéma de base de données, diagrammes C4/ERD.",
    "Développement itératif — fonctionnalités livrées par domaine (auth, events, forum, admin, encyclopédie).",
    "Audit & stabilisation — reprise structurée du projet le 2 juin 2026 après une interruption de ~2 mois.",
    "Tests & corrections — suite PHPUnit, corrections tracées dans docs/audit/changelog-corrections.md.",
    "Qualité & accessibilité — mise en place de la CI, conformité RGAA en 3 phases (1er juillet 2026).",
    "Déploiement — environnement VPS OVHCloud, Docker Compose de production.",
  ]);
}

{
  const slide = baseSlide("Déroulement du projet");
  slideTitle(slide, "Chiffres clés du projet");
  statRow(slide, 1.7, [
    { value: "90", label: "commits (toutes branches)" },
    { value: "~3,5 mois", label: "de développement effectif" },
    { value: "440", label: "fichiers versionnés" },
    { value: "5", label: "branches (main, develop, feature/*)" },
  ]);
  statRow(slide, 3.5, [
    { value: "155", label: "fichiers backend (122 .php)" },
    { value: "229", label: "fichiers frontend (137 .ts/.tsx)" },
    { value: "35", label: "documents dans docs/" },
    { value: "15", label: "tables de base de données" },
  ]);
  bulletBlock(slide, [
    "Comptage git ls-files ; le module mobile (Flutter) est présent sur le disque mais pas encore versionné (untracked).",
  ], { x: 0.6, y: 5.5, w: 12.13, h: 0.8, fontSize: 11.5 });
}

/* ═══════════════════════════ 11. MÉTHODOLOGIE ═══════════════════════════ */
sectionDivider("11", "Méthodologie", "Organisation, Git et documentation");

{
  const slide = baseSlide("Méthodologie");
  slideTitle(slide, "Organisation & gestion de projet");
  bulletBlock(slide, [
    "Git flow avec branches dédiées : main, develop, et des branches feature/* par lot fonctionnel (ex. feature/items-encyclopedia, feature/rgaa-accessibilite, feature/us-01-authentification).",
    "Convention de commits sémantiques (feat/fix/docs/chore/style), généralisée à partir de la phase de stabilisation (18 juin 2026).",
    "Secrets exclus du dépôt dès l'amorçage : .env.prod retiré explicitement du tracking Git.",
    "Outils de suivi de tâches (Trello/Notion/ClickUp…) : à compléter — non identifiables depuis le dépôt Git lui-même.",
  ]);
}

{
  const slide = baseSlide("Méthodologie");
  slideTitle(slide, "Documentation comme composant de premier ordre");
  bulletBlock(slide, [
    "39 documents identifiés (docs/architecture/matrice-priorite.md), 21 déjà rédigés à priorité P0/P1 complète, 18 restants classés P2/P3.",
    "Gouvernance documentaire explicite : toute modification du code déclenche une vérification de la documentation associée.",
    "Décisions d'architecture tracées sous forme d'ADR (docs/architecture/decisions-techniques.md) — le \"pourquoi\", pas seulement le \"quoi\".",
    "Workflow de correction formalisé (.claude/instructions-claude.md) : chaque étape est présentée, validée explicitement, puis appliquée et journalisée.",
    "Changelog de corrections dédié (docs/audit/changelog-corrections.md) avec traçabilité complète, y compris des écarts assumés au workflow.",
  ]);
}

/* ═══════════════════════════ 12. DIFFICULTÉS RENCONTRÉES ═══════════════════════════ */
sectionDivider("12", "Difficultés rencontrées", "Problèmes réels, causes, solutions et résultats");

function difficultySlide(title, items) {
  const slide = baseSlide("Difficultés rencontrées");
  slideTitle(slide, title, 0.62, 22);
  const w = 5.9, gap = 0.33, h = 2.55;
  items.forEach((it, i) => {
    const x = 0.6 + (i % 2) * (w + gap);
    const y = 1.5 + Math.floor(i / 2) * (h + 0.25);
    card(slide, x, y, w, h, it.h, it.b, it.accent);
  });
}

difficultySlide("Instabilité technique & infrastructure", [
  { h: "Configuration TypeScript/Vite instable", b: "Problème : 8 correctifs le même jour (1er avril 2026) sur tsconfig.node.json et vite.config.\nCause : configuration stricte mal alignée avec le build de production.\nSolution : normalisation progressive des fichiers de config.\nRésultat : build de production stabilisé.", accent: C.warning },
  { h: "Ports incohérents (frontend, MySQL)", b: "Problème : Vite forçait 5174 mais Docker/CORS/Sanctum pointaient encore vers 5173 ; MySQL exposé sur 3307 mais référencé en 3306 hors Docker.\nCause : évolution des ports non répercutée partout.\nSolution : alignement documenté (5174 = référence).\nRésultat : démarrage local fiable.", accent: C.warning },
  { h: "Incompatibilité PHP 8.3 vs composer.lock", b: "Problème : boucle « MySQL non disponible » trompeuse dans l'entrypoint Docker.\nCause réelle : composer.lock exigeait PHP ≥ 8.4.1, l'image utilisait PHP 8.3 (platform_check.php échouait avant même la connexion MySQL).\nSolution : FROM php:8.3-cli → php:8.4-cli.\nRésultat : diagnostic root-cause documenté, démarrage rétabli.", accent: C.error },
  { h: "Relations Eloquent vers des modèles fantômes", b: "Problème : User.php référençait Discussion, Commentaire, Build — classes inexistantes.\nCause : reprise du projet après ~2 mois, roadmap (guildes/builds) partiellement codée puis abandonnée.\nSolution : relations orphelines retirées lors de l'audit.\nRésultat : risque de crash « Class not found » éliminé.", accent: C.error },
]);

difficultySlide("Sécurité & fiabilité", [
  { h: "Appel direct frontend → API ArenaNet", b: "Problème : le frontend appelait api.guildwars2.com avec le token Sanctum (invalide pour l'API GW2).\nCause : confusion entre deux systèmes d'authentification distincts.\nSolution : ajout d'un endpoint proxy backend GET /profile/world-boss-status.\nRésultat : le frontend n'appelle plus jamais ArenaNet directement.", accent: C.error },
  { h: "Clé de chiffrement invalide dans les tests", b: "Problème : « Unsupported cipher or incorrect key length » sur les tests utilisant le chiffrement.\nCause : un caractère « / » parasite en fin d'APP_KEY dans phpunit.xml.\nSolution : correction de la clé de test.\nRésultat : passage de 22/23 à 23/23 tests réussis.", accent: C.warning },
  { h: "Perte de données lors d'un test de modération", b: "Problème : un test PHPUnit a exécuté contre MySQL local au lieu de SQLite en mémoire.\nCause : Docker écrit aussi dans $_SERVER, non couvert par force=\"true\" sur les balises <env> seules.\nSolution : ajout de balises <server> en complément.\nRésultat : incident et correctif documentés en leçon méthodologique.", accent: C.error },
  { h: "Accessibilité : sidebar admin illisible", b: "Problème : AdminLayout cassé sous 768px (non conforme WCAG 1.4.10 Reflow).\nCause : absence de breakpoint responsive dédié.\nSolution : correctif responsive ciblé pendant l'audit RGAA.\nRésultat : seul problème bloquant confirmé sur 4 phases d'audit accessibilité.", accent: C.info },
]);

/* ═══════════════════════════ 13. RÉSULTATS ═══════════════════════════ */
sectionDivider("13", "Résultats", "Ce qui a été livré");

{
  const slide = baseSlide("Résultats");
  slideTitle(slide, "Fonctionnalités livrées");
  bulletBlock(slide, [
    "Authentification complète (inscription, connexion, réinitialisation de mot de passe, gestion multi-device).",
    "Profil utilisateur avec synchronisation de compte GW2 (clé API chiffrée, personnages, statut world boss).",
    "Timers d'événements et world bosses en temps réel, synchronisés sur l'heure UTC officielle.",
    "Forum communautaire complet : catégories, sujets, réponses, modération, mentions et chat codes GW2.",
    "Encyclopédie d'objets GW2 avec recherche plein texte, favoris et commentaires modérés.",
    "Back-office administrateur : gestion des utilisateurs, bannissements, statistiques, modération des signalements.",
    "Application mobile Flutter fonctionnelle : authentification, événements en direct, notifications locales.",
  ]);
}

{
  const slide = baseSlide("Résultats");
  slideTitle(slide, "Chiffres clés");
  statRow(slide, 1.7, [
    { value: "36+", label: "endpoints API REST" },
    { value: "23 / 73", label: "tests / assertions backend" },
    { value: "15", label: "tables de données métier" },
    { value: "2", label: "clients (web + mobile)" },
  ]);
  bulletBlock(slide, [
    "Pipeline d'intégration continue opérationnel (GitHub Actions) : lint + tests backend, typecheck + lint + build frontend à chaque push/PR.",
    "Conformité accessibilité engagée : 3 phases RGAA menées (labels ARIA, focus trap clavier, audit de contraste WCAG).",
    "Traçabilité complète des corrections appliquées (changelog dédié), démontrant une démarche qualité assumée.",
  ], { x: 0.6, y: 3.75, w: 12.13, h: 2.8, fontSize: 14 });
}

/* ═══════════════════════════ 14. ANALYSE CRITIQUE ═══════════════════════════ */
sectionDivider("14", "Analyse critique", "Points forts, limites et enseignements");

{
  const slide = baseSlide("Analyse critique");
  slideTitle(slide, "Points forts & limites");
  twoColBullets(
    slide,
    "Points forts",
    [
      "Documentation as code réellement appliquée (39 documents)",
      "Sécurité pensée dès la conception (chiffrement, rate limiting)",
      "Architecture découplée claire (SPA + API stateless)",
      "Démarche d'audit et de correction tracée et assumée",
    ],
    "Limites actuelles",
    [
      "Déploiement continu (CD) non finalisé",
      "Couverture de tests inégale (frontend, mobile, encyclopédie)",
      "Documentation mobile manquante (docs/mobile/ référencé, absent)",
      "Granularité des rôles/permissions encore simple",
    ]
  );
}

{
  const slide = baseSlide("Analyse critique");
  slideTitle(slide, "Choix qui auraient pu être différents & enseignements");
  bulletBlock(slide, [
    "Écrire les tests de l'encyclopédie d'objets en même temps que la fonctionnalité, plutôt qu'après coup.",
    "Cadrer plus tôt la portée mobile pour éviter l'écart de périmètre avec le web (forum, encyclopédie absents).",
    "Généraliser plus tôt la convention de commits sémantiques (adoptée seulement à partir de la phase de stabilisation).",
    "Enseignement principal : une interruption de projet (~2 mois) coûte cher — l'audit du 2 juin 2026 a dû redécouvrir un état existant avant de pouvoir avancer.",
    "Enseignement méthodologique : documenter un incident (perte de données de test) au même titre qu'une réussite renforce la fiabilité du projet.",
  ]);
}

/* ═══════════════════════════ 15. COMPÉTENCES MOBILISÉES ═══════════════════════════ */
sectionDivider("15", "Compétences mobilisées", "Techniques et transverses");

{
  const slide = baseSlide("Compétences mobilisées");
  slideTitle(slide, "Compétences techniques");
  twoColBullets(
    slide,
    "Développement",
    [
      "Backend : API REST Laravel, Eloquent, services métier",
      "Frontend : React, TypeScript, hooks, state management",
      "Mobile : Flutter/Dart, Provider, stockage sécurisé",
      "Base de données : conception relationnelle MySQL, migrations",
    ],
    "Qualité & exploitation",
    [
      "Sécurité applicative (chiffrement, auth, rate limiting)",
      "Tests automatisés (PHPUnit), intégration continue",
      "Git & GitHub (branches, historique, revue de code)",
      "Documentation technique & architecture (ADR, diagrammes)",
    ]
  );
}

{
  const slide = baseSlide("Compétences mobilisées");
  slideTitle(slide, "Compétences transverses");
  bulletBlock(slide, [
    "Analyse de besoin et rédaction de spécifications (personas, fonctionnalités priorisées).",
    "Conduite d'un audit technique et priorisation des corrections (méthodique, tracée, réversible).",
    "Accessibilité numérique (RGAA/WCAG) et conception d'interfaces centrées utilisateur.",
    "Communication écrite structurée (documentation as code) et communication orale (cette soutenance).",
    "Autonomie et posture professionnelle : rigueur documentaire, gestion des secrets, discipline de validation.",
  ]);
}

/* ═══════════════════════════ 16. PERSPECTIVES D'ÉVOLUTION ═══════════════════════════ */
sectionDivider("16", "Perspectives d'évolution", "Court, moyen et long terme");

{
  const slide = baseSlide("Perspectives d'évolution");
  slideTitle(slide, "Évolutions par priorité");
  dataTable(
    slide, 0.6, 1.5, 12.13,
    ["Priorité", "Évolution"],
    [
      ["Court terme", "Finaliser le pipeline de déploiement continu (CD) : secrets GitHub, scripts de production manquants"],
      ["Court terme", "Ajouter les tests manquants : Vitest (frontend), tests dédiés à l'encyclopédie d'objets"],
      ["Court terme", "Rédiger docs/mobile/implementation-mobile.md, référencé mais absent du dépôt"],
      ["Moyen terme", "Étendre le mobile : forum, encyclopédie d'objets, notifications push serveur"],
      ["Moyen terme", "Vérification d'email, liaison de compte social (Discord/Google)"],
      ["Moyen terme", "Recherche plein texte et formatage riche (Markdown) sur le forum"],
      ["Long terme", "Gestion de guilde (roster, rangs, recrutement)"],
      ["Long terme", "Calculateur de crafting, suivi des achievements"],
    ],
    [2.6, 9.53],
    { fontSize: 11 }
  );
}

/* ═══════════════════════════ 17. CONCLUSION ═══════════════════════════ */
sectionDivider("17", "Conclusion");

{
  const slide = baseSlide("Conclusion");
  slideTitle(slide, "Conclusion");
  bulletBlock(slide, [
    "GW2 Nexus répond à un besoin réel de la communauté Guild Wars 2 en centralisant timers, profil de compte et espace communautaire.",
    "Le projet couvre l'ensemble d'une chaîne applicative moderne : API sécurisée, SPA React, application mobile Flutter, documentation as code.",
    "Une démarche qualité assumée (audit, corrections tracées, accessibilité, CI) démontre une capacité à faire évoluer un projet existant de façon rigoureuse.",
    "Les prochaines étapes (CD, tests, extension mobile) sont identifiées et priorisées, avec une base technique et documentaire solide pour les mener.",
  ]);
}

/* ═══════════════════════════ 18. GRILLES D'ÉVALUATION ═══════════════════════════ */
sectionDivider("18", "Grilles d'évaluation", "Justification par les éléments du projet");

{
  const slide = baseSlide("Grille — Oral intermédiaire");
  slideTitle(slide, "Compétences transverses (10 minutes)", 0.62, 22);
  dataTable(
    slide, 0.6, 1.35, 12.13,
    ["Critère", "Pond.", "Justification par le projet"],
    [
      ["Git / GitHub collaboratif", "3", "90 commits tracés, branches main/develop/feature/*, secrets exclus du suivi (.env.prod)"],
      ["Outils de gestion de projet", "4", "À compléter — outil (Trello/Notion/ClickUp) non identifiable depuis le dépôt Git"],
      ["Rédiger des spécifications", "5", "docs/product/vision.md (personas, besoins) + 39 documents recensés, 21 rédigés"],
      ["Présenter un projet à l'oral", "5", "Ce diaporama, architecture et choix techniques justifiés point par point"],
      ["Posture professionnelle", "3", "Gouvernance documentaire stricte, workflow de validation, écarts tracés explicitement"],
    ],
    [3.6, 0.9, 7.63],
    { fontSize: 10.5 }
  );
}

{
  const slide = baseSlide("Grille — Oral final");
  slideTitle(slide, "Compétences générales (20 minutes) — 1/2", 0.62, 21);
  dataTable(
    slide, 0.6, 1.35, 12.13,
    ["Critère", "Module", "Pond.", "Justification"],
    [
      ["Concevoir une solution répondant à un besoin métier", "x", "4", "5 personas identifiés (vision.md), réponse au besoin réel de centralisation"],
      ["Développer une application web fonctionnelle avec un framework", "Web front avancé", "8", "React 19 + Laravel 12, SPA découplée, 36+ endpoints REST versionnés"],
      ["Concevoir des interfaces responsives et accessibles (WCAG/ARIA)", "Web front avancé", "2", "3 phases RGAA menées, useFocusTrap, jsx-a11y, correctif WCAG 1.4.10"],
    ],
    [4.6, 2.3, 0.8, 4.43],
    { fontSize: 10 }
  );
}

{
  const slide = baseSlide("Grille — Oral final");
  slideTitle(slide, "Compétences générales (20 minutes) — 2/2", 0.62, 21);
  dataTable(
    slide, 0.6, 1.35, 12.13,
    ["Critère", "Module", "Pond.", "Justification"],
    [
      ["Appliquer les bonnes pratiques de conception logicielle", "Bonne pratique de conception", "3", "Pattern hook→API→UI, séparation Controllers/Services/Resources, ADR documentées"],
      ["Concevoir et interagir avec une BDD relationnelle", "Admin. BDD, NoSQL", "3", "MySQL, 15 tables, migrations versionnées, contraintes FK/uniques, chiffrement"],
      ["Développer une interface mobile Android et/ou iOS", "Développement mobile", "8", "GW2Nexus Mobile (Flutter) : auth, events temps réel, notifications locales"],
      ["Concevoir des interfaces intuitives centrées UX", "Web front avancé + Dév. mobile", "2", "Design system centralisé (theme.module.css), navigation mobile simplifiée"],
    ],
    [4.6, 2.3, 0.8, 4.43],
    { fontSize: 10 }
  );
}

/* ═══════════════════════════ 19. ANNEXES ═══════════════════════════ */
sectionDivider("19", "Annexes", "Arborescence, endpoints, base de données");

{
  const slide = baseSlide("Annexes");
  slideTitle(slide, "Arborescence du projet");
  const tree =
`GW2Nexus/
├── backend/            API Laravel 12 (app/Models, Http/Controllers, Services...)
├── frontend/            SPA React 19 (src/api, components, hooks, pages, store)
├── mobile/               Application Flutter (lib/config, models, screens, services)
├── docker/               Configuration Nginx / PHP annexe
├── docs/                  39 documents (architecture, api, backend, frontend, ...)
├── .claude/               Instructions de collaboration et gouvernance
├── docker-compose.yml     Stack locale (5 services)
└── README.md              Vitrine produit du projet`;
  slide.addText(tree, { x: 0.6, y: 1.55, w: 12.13, h: 4.8, fontFace: "Consolas", fontSize: 13, color: C.textPrimary, valign: "top", fill: { color: C.bgSurface }, lineSpacingMultiple: 1.3 });
}

{
  const slide = baseSlide("Annexes");
  slideTitle(slide, "Endpoints API principaux (extrait)");
  dataTable(
    slide, 0.6, 1.4, 12.13,
    ["Méthode", "Endpoint", "Domaine"],
    [
      ["POST", "/api/v1/auth/login", "Authentification (rate limit 5/min)"],
      ["GET", "/api/v1/auth/me", "Authentification"],
      ["GET / PATCH", "/api/v1/profile", "Profil utilisateur"],
      ["PATCH", "/api/v1/profile/api-key", "Clé API GW2 (chiffrée AES-256)"],
      ["GET", "/api/v1/events/schedule", "Timers d'événements (rate limit 60/min)"],
      ["GET / POST", "/api/v1/forum/categories/{slug}/threads", "Forum"],
      ["POST", "/api/v1/forum/posts/{id}/reports", "Signalement forum"],
      ["GET", "/api/v1/items", "Encyclopédie d'objets (recherche Meilisearch)"],
      ["POST", "/api/v1/items/resolve-codes", "Résolution de chat codes GW2"],
      ["GET", "/api/v1/users/search", "Recherche utilisateurs (mentions @)"],
      ["GET / PATCH", "/api/v1/admin/users/{id}/ban", "Administration — bannissement"],
      ["GET / PATCH", "/api/v1/admin/forum/reports", "Modération forum"],
    ],
    [1.6, 5.1, 5.43],
    { fontSize: 10.5 }
  );
}

{
  const slide = baseSlide("Annexes");
  slideTitle(slide, "Structure de la base de données (15 tables)");
  twoColBullets(
    slide,
    "Compte & sécurité",
    [
      "users — comptes, rôles, clé API GW2 chiffrée",
      "profils_gw2 — données de compte synchronisées",
      "user_bans — historique des sanctions",
      "personal_access_tokens — tokens Sanctum (hash SHA-256)",
    ],
    "Forum & encyclopédie",
    [
      "forum_categories / forum_threads / forum_posts",
      "forum_post_reports — signalements forum",
      "items / item_stat_sets — catalogue d'objets GW2",
      "item_favorites / item_comments / item_comment_reports",
    ]
  );
}

{
  const slide = baseSlide("Annexes");
  slideTitle(slide, "Extraits de code pertinents");
  bulletBlock(slide, [
    "backend/app/Services/Gw2ApiService.php — cache par utilisateur des appels ArenaNet (TTL 60–300 s) avec retour gracieux en cas d'erreur.",
    "frontend/src/hooks/items/useItemFavorite.ts — mise à jour optimiste du cache TanStack Query avec rollback automatique.",
    "frontend/src/components/forum/MentionAutocompleteTextareaComponent — détection des triggers @ et # avec suggestions flottantes.",
    "backend/app/Services/Gw2ChatCodeService.php — décodage binaire des chat codes GW2 ([&...]) au format objet.",
    "mobile/lib/services/event_schedule_service.dart — calcul local du statut des événements et déduplication des notifications.",
  ]);
}

{
  const slide = baseSlide("Annexes");
  slideTitle(slide, "Captures supplémentaires");
  placeholder(slide, 0.6, 1.6, 3.85, 2.5, "Capture : back-office admin");
  placeholder(slide, 4.65, 1.6, 3.85, 2.5, "Capture : encyclopédie d'objets");
  placeholder(slide, 8.7, 1.6, 3.83, 2.5, "Capture : app mobile — événements");
  placeholder(slide, 0.6, 4.3, 3.85, 2.5, "Capture : profil GW2 synchronisé");
  placeholder(slide, 4.65, 4.3, 3.85, 2.5, "Capture : forum — mentions & chat codes");
  placeholder(slide, 8.7, 4.3, 3.83, 2.5, "Capture : app mobile — profil");
}

pptx.writeFile({ fileName: "GW2Nexus-Soutenance.pptx" }).then((fileName) => {
  console.log("OK:", fileName, "| slides:", pageNum);
});
