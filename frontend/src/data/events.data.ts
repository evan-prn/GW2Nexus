// =============================================================
// data/events.data.ts
// Horaires statiques des événements GW2
//
// Source officielle : https://wiki.guildwars2.com/wiki/Event_timers
// Les créneaux sont en minutes depuis minuit UTC.
// Mise à jour : 2025 — à ajuster si ArenaNet modifie les horaires.
// =============================================================

import type { EventExpansionGroup } from '../types/events.types';

// ─────────────────────────────────────────────────────────────
// Utilitaires internes
// ─────────────────────────────────────────────────────────────

/**
 * Convertit "HH:MM" (UTC) en minutes depuis minuit.
 * Exemple : hm("07:30") → 450
 */
const hm = (hhMm: string): number => {
  const [h, m] = hhMm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Génère 12 créneaux espacés de 2h à partir d'une heure de départ.
 * Utilisé pour les méta-événements dont le cycle est fixe de 2h.
 *
 * Exemple : cycle2h("01:00", 15) → slots à 01:00, 03:00, 05:00...
 */
const cycle2h = (startHHMM: string, durationMin: number, preEventMin = 5) => {
  const base = hm(startHHMM);
  return Array.from({ length: 12 }, (_, i) => ({
    startMinutes: (base + i * 120) % 1440,
    durationMinutes: durationMin,
    preEventMinutes: preEventMin,
  }));
};

// ─────────────────────────────────────────────────────────────
// WORLD BOSSES — Tyrie Centrale, horaires fixes
// Source : https://wiki.guildwars2.com/wiki/World_boss
// ─────────────────────────────────────────────────────────────

const WORLD_BOSSES_GROUP: EventExpansionGroup = {
  id: 'world_bosses',
  label: 'World Bosses',
  zones: [
    // ── Bosses à cycle fixe 2h ─────────────────────────────────
    {
      id: 'plaines-metrica',
      name: 'Plaines de Métrica',
      color: '#e74c3c',
      icon: '🔥',
      events: [
        {
          id: 'feu-elementaire',
          name: 'Feu Élémentaire Primordial',
          zone: 'Plaines de Métrica',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'fire_elemental',
          slots: cycle2h('00:00', 12, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Fire_Elemental',
          rewards: [
            { name: 'Coffre du Feu Élémentaire', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Composants d\'alchimie', icon: '🧪' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Capacité Inquest [&BCcAAAA=]" dans les Plaines de Métrica. Dirigez-vous vers le laboratoire Inquest au nord-ouest.' },
            { step: 2, title: 'Éteindre les torches', description: 'Avant l\'invocation, interrompez les 4 torches initiatrices autour du laboratoire. Détruisez les dispositifs Inquest pour retarder l\'arrivée du boss.', tip: 'Chaque joueur peut prendre une torche, coordinationnez-vous !' },
            { step: 3, title: 'Combattre l\'élémentaire', description: 'Une fois invoqué, attaquez le Feu Élémentaire. Évitez de rester dans les zones de feu au sol et éliminez les petits élémentaires en priorité.' },
            { step: 4, title: 'Phase finale', description: 'Continuez le DPS jusqu\'à la mort du boss. Ne restez pas immobile — le feu au sol inflige des dégâts importants.', tip: 'Les classes avec mobilité (Voleur, Gardien céleste) gèrent mieux cette phase.' },
          ],
        },
      ],
    },
    {
      id: 'foret-caledonie',
      name: 'Forêt de Calédonie',
      color: '#27ae60',
      icon: '🐛',
      events: [
        {
          id: 'vers-jungle',
          name: 'Grand Vers des Jungles Méandreuses',
          zone: 'Forêt de Calédonie',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'great_jungle_wurm',
          slots: cycle2h('00:15', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Great_Jungle_Wurm',
          rewards: [
            { name: 'Coffre du Grand Vers', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Matériaux de jungle', icon: '🌿' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Tribu Darkwound [&BCQBAAA=]" dans la Forêt de Calédonie. Le vers apparaît au centre de la carte.' },
            { step: 2, title: 'Attaquer le vers', description: 'Concentrez vos attaques sur la tête du vers lorsqu\'elle émerge du sol. Evitez les zones d\'empoisonnement.' },
            { step: 3, title: 'Éliminer les adds', description: 'Des champignons et insectes venimeux apparaissent en cours de combat. Éliminez-les rapidement pour protéger vos alliés.', tip: 'Restez en groupe serré pour profiter des soins AoE.' },
            { step: 4, title: 'Phase finale', description: 'Continuez d\'attaquer la tête lors de chaque émergence. Le boss finit par mourir après plusieurs cycles.' },
          ],
        },
      ],
    },
    {
      id: 'hautes-plaines',
      name: 'Hautes Plaines Brûlées',
      color: '#e67e22',
      icon: '🔥',
      events: [
        {
          id: 'megadestructeur',
          name: 'Le Mégadestructeur',
          zone: 'Hautes Plaines Brûlées',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'megadestroyer',
          slots: cycle2h('00:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Megadestroyer',
          rewards: [
            { name: 'Coffre du Mégadestructeur', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Éclats de lave', icon: '🌋' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Maelstrom du Mont [&BNcCAAA=]" dans les Hautes Plaines Brûlées (Mont Maelstrom). Le boss apparaît au sommet du volcan.' },
            { step: 2, title: 'Affaiblir le blindage', description: 'Attaquez les petits destructeurs de lave pour charger les canons à magma. Ces canons sont indispensables pour percer l\'armure du Mégadestructeur.', tip: 'Il faut impérativement utiliser les canons — les armes normales ne suffisent pas seules.' },
            { step: 3, title: 'Tirer avec les canons', description: 'Utilisez les canons à magma pour infliger des dégâts massifs. Maintenez les canons opérationnels en repoussant les adds.' },
            { step: 4, title: 'Phase finale — Tête exposée', description: 'Lorsque l\'armure est brisée, concentrez tout votre DPS sur la tête du Mégadestructeur. Évitez les projections de lave.', tip: 'Les compétences qui renversent le boss (Knock Back) sont très utiles en phase finale.' },
          ],
        },
      ],
    },
    {
      id: 'flancs-cretebrisee',
      name: 'Flancs Crêtebrisée',
      color: '#8e44ad',
      icon: '🐉',
      events: [
        {
          id: 'dragon-pierre',
          name: 'Le Dragon de Pierre',
          zone: 'Flancs Crêtebrisée',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'shatterer',
          slots: cycle2h('00:30', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Shatterer',
          rewards: [
            { name: 'Coffre du Dragon de Pierre', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Cristaux de dragon', icon: '💎' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Crête Brisée [&BOYBAAA=]" dans les Flancs Crêtebrisée. Le Dragon de Pierre apparaît dans la plaine.' },
            { step: 2, title: 'Briser l\'armure en 3 phases', description: 'Le Dragon possède une armure cristalline. Attaquez-la pour la faire craquer en 3 phases successives. Restez mobiles — il charge et souffle régulièrement.' },
            { step: 3, title: 'Viser la gemme dans la gorge', description: 'Lorsque l\'armure cède, une gemme dans la gorge du dragon est exposée. Concentrez tous vos dégâts dessus.', tip: 'Utilisez des armes à longue portée (arc, fusil) pour rester hors de portée du souffle.' },
            { step: 4, title: 'Phase finale', description: 'Continuez le cycle : briser l\'armure → viser la gemme. Évitez le souffle de glace en vous déplaçant sur les côtés.' },
          ],
        },
      ],
    },
    {
      id: 'rive-aux-epaves-wb',
      name: 'Rive aux Épaves',
      color: '#3498db',
      icon: '👥',
      events: [
        {
          id: 'behemoth-ombres',
          name: 'Béhémoth des Ombres',
          zone: 'Rive aux Épaves',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'shadow_behemoth',
          slots: cycle2h('01:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Shadow_Behemoth',
          rewards: [
            { name: 'Coffre du Béhémoth des Ombres', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Essences d\'ombre', icon: '🌑' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Village de Shaemoor [&BEABAAA=]" dans la Rive aux Épaves (Queensdale). Le Béhémoth apparaît au marécage central.' },
            { step: 2, title: 'Détruire les portails', description: 'Avant l\'apparition du boss, des portails d\'ombres s\'ouvrent dans la zone. Interrompez les rituels en tuant les fantômes près de chaque portail.', tip: 'Si les 4 portails ne sont pas fermés à temps, le boss est encore plus résistant.' },
            { step: 3, title: 'Attaquer le Béhémoth', description: 'Une fois les portails fermés, le Béhémoth des Ombres émerge. Concentrez votre DPS sur lui.' },
            { step: 4, title: 'Éviter les bombes d\'ombre', description: 'Le boss lance régulièrement des bombes d\'ombre qui créent des zones de dégâts. Déplacez-vous continuellement.', tip: 'Restez à portée de soins des gardiens et necros — les dégâts peuvent être intenses.' },
          ],
        },
      ],
    },
    {
      id: 'hautes-terres-harathi',
      name: 'Hautes Terres de Harathi',
      color: '#f39c12',
      icon: '🐴',
      events: [
        {
          id: 'ulgoth-modniir',
          name: 'Ulgoth le Modniir',
          zone: 'Hautes Terres de Harathi',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'modniir_ulgoth',
          slots: cycle2h('01:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Ulgoth_the_Modniir',
          rewards: [
            { name: 'Coffre d\'Ulgoth', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Dépouilles centaures', icon: '🏹' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Camp de Taminn [&BAQBAAA=]" dans les Hautes Terres de Harathi. L\'événement se déroule au Grand Camp centaure.' },
            { step: 2, title: 'Défendre les villages', description: 'Avant l\'arrivée d\'Ulgoth, des vagues de centaures attaquent les villages alentours. Défendez-les pour préparer le terrain.', tip: 'Plus vous défendez de villages, plus les renforts alliés pour le boss seront nombreux.' },
            { step: 3, title: 'Repousser l\'assaut principal', description: 'Un assaut centaure massif précède Ulgoth. Tenez les lignes de défense jusqu\'à son apparition.' },
            { step: 4, title: 'Tuer Ulgoth', description: 'Ulgoth arrive à cheval. DPS massif — il n\'a pas de mécanique complexe mais possède beaucoup de points de vie.' },
          ],
        },
      ],
    },
    {
      id: 'pays-kessex',
      name: 'Pays de Kessex',
      color: '#16a085',
      icon: '⚙️',
      events: [
        {
          id: 'golem-mark-ii',
          name: 'Golem Mark II',
          zone: 'Pays de Kessex',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'golem_mark_ii',
          slots: cycle2h('01:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Golem_Mark_II',
          rewards: [
            { name: 'Coffre du Golem Mark II', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Composants mécaniques', icon: '⚙️' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Camp de Garenhoff [&BIUBAAA=]" dans le Pays de Kessex. Le Golem se trouve dans la base Inquest à l\'est.' },
            { step: 2, title: 'Attendre l\'activation', description: 'Des ingénieurs Inquest activent le Golem Mark II. Ne l\'attaquez pas avant — vous perdriez du temps de buff.' },
            { step: 3, title: 'Détruire le générateur de bouclier', description: 'Le Golem possède un bouclier protecteur. Attaquez en priorité le générateur de bouclier au sol avant de vous concentrer sur le boss.', tip: 'Utiliser des compétences de type "Élite" sur le générateur accélère grandement la phase.' },
            { step: 4, title: 'DPS final', description: 'Bouclier éliminé, concentrez tout sur le Golem. Évitez les AoE laser et les charges.', tip: 'Restez sur les côtés — le laser frontal inflige de très lourds dégâts.' },
          ],
        },
      ],
    },
    {
      id: 'cote-maree-sanglante-wb',
      name: 'Côte de la Marée Sanglante',
      color: '#c0392b',
      icon: '🏴‍☠️',
      events: [
        {
          id: 'capitaine-covington',
          name: 'Capitaine Taidha Covington',
          zone: 'Côte de la Marée Sanglante',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'admiral_taidha_covington',
          slots: cycle2h('01:45', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Admiral_Taidha_Covington',
          rewards: [
            { name: 'Coffre de la Capitaine', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Butin de pirates', icon: '💰' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Fort Cadence [&BJQBAAA=]" sur la Côte de la Marée Sanglante. Le fort pirate est au nord-est.' },
            { step: 2, title: 'Première vague — Assaut du fort', description: 'Attaquez le fort en éliminant les gardes à l\'extérieur. L\'entrée principale est protégée par des canons et des archers.' },
            { step: 3, title: 'Deuxième vague — Lieutenants', description: 'À l\'intérieur, tuez les 3 lieutenants de la Capitaine pour déverrouiller l\'accès à elle. Ils se trouvent dans 3 ailes différentes.', tip: 'Divisez-vous en 3 groupes pour aller plus vite.' },
            { step: 4, title: 'Tuer la Capitaine', description: 'Rejoignez la salle principale et concentrez tout votre DPS sur la Capitaine Covington. Évitez ses coups spéciaux à l\'épée.' },
          ],
        },
      ],
    },
    {
      id: 'plaines-wayfarer',
      name: 'Plaines de Wayfarer',
      color: '#2980b9',
      icon: '🧊',
      events: [
        {
          id: 'chamane-svanir',
          name: 'Chamane en Chef des Svanirs',
          zone: 'Plaines de Wayfarer',
          category: 'world_boss',
          isTwoHourCycle: true,
          gw2ApiId: 'svanir_shaman_chief',
          slots: cycle2h('02:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Svanir_Shaman_Chief',
          rewards: [
            { name: 'Coffre du Chamane Svanir', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Cristaux de glace', icon: '🔷' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Village de Dolyak [&BAAAAAA=]" dans les Plaines de Wayfarer. Le camp Svanir est au nord.' },
            { step: 2, title: 'Repousser l\'assaut initial', description: 'Des Svanirs attaquent le village en vagues. Défendez jusqu\'à l\'arrivée du Chamane en Chef.' },
            { step: 3, title: 'Attaquer le Chamane', description: 'Le Chamane en Chef apparaît avec un bouclier de glace. Attaquez-le directement — son bouclier se brise avec suffisamment de dégâts.' },
            { step: 4, title: 'Éliminer les adds gelés', description: 'Il invoque régulièrement des golems de glace. Tâchez d\'en éliminer quelques-uns pour alléger la pression sur vos soigneurs.', tip: 'Les compétences de feu brisent les golems de glace plus rapidement.' },
          ],
        },
      ],
    },
    // ── Bosses à schedule spécifique ─────────────────────────────
    {
      id: 'cote-givremer',
      name: 'Côte de Givremer',
      color: '#7fb3d3',
      icon: '❄️',
      events: [
        {
          id: 'griffe-jormag',
          name: 'La Griffe de Jormag',
          zone: 'Côte de Givremer',
          category: 'world_boss',
          isTwoHourCycle: false,
          gw2ApiId: 'claw_of_jormag',
          // Horaires fixes : toutes les ~2h30 (cycle 150 min, UTC)
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('02:30'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('05:00'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('07:30'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('10:00'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('12:30'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('15:00'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('17:30'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('20:00'), durationMinutes: 20, preEventMinutes: 10 },
            { startMinutes: hm('22:30'), durationMinutes: 20, preEventMinutes: 10 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Claw_of_Jormag',
          rewards: [
            { name: 'Coffre de la Griffe de Jormag', icon: '📦' },
            { name: 'Équipement exotique (chance)', icon: '⚔️' },
            { name: 'Écailles du Dragon Ancien', icon: '🐉' },
            { name: 'Matériaux corrompus', icon: '💜' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Camp de Refuge [&BOcBAAA=]" sur la Côte de Givremer. La Griffe apparaît dans la vallée glacée au nord.' },
            { step: 2, title: 'Se positionner sur les canons', description: 'Dispersez-vous sur les 5 points de canon répartis autour de la zone. Ces canons sont indispensables pour briser la carapace de glace.', tip: 'Chaque canon doit être occupé en permanence — rejoignez un canon libre en arrivant.' },
            { step: 3, title: 'Briser la carapace avec les canons', description: 'Utilisez les canons pour viser les zones brillantes sur la carapace de la Griffe. Quand la carapace cède, la tête se retrouve exposée.' },
            { step: 4, title: 'DPS massif sur la tête', description: 'Quand la tête est exposée, tous les joueurs convergent pour un burst de dégâts maximum. C\'est la fenêtre de DPS principale.', tip: 'Élites et compétences d\'animation lente (Berserker, Archiviste) sont idéales ici.' },
            { step: 5, title: 'Éviter le souffle de glace', description: 'La Griffe souffle une ligne glacée frontale. Déplacez-vous sur les côtés dès que vous voyez l\'animation de charge.' },
          ],
        },
      ],
    },
    {
      id: 'marecage-eclair',
      name: 'Marécage de l\'Éclair',
      color: '#4a90d9',
      icon: '🌊',
      events: [
        {
          id: 'tequatl',
          name: 'Tequatl le Sans-Soleil',
          zone: 'Marécage de l\'Éclair',
          category: 'world_boss',
          isTwoHourCycle: false,
          gw2ApiId: 'tequatl',
          // Horaires fixes Tequatl (UTC) — source : wiki GW2
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('03:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('07:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('11:30'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('19:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Tequatl_the_Sunless',
          rewards: [
            { name: 'Trésor de Tequatl', icon: '📦' },
            { name: 'Chance précurseur légendaire', icon: '⭐' },
            { name: 'Équipement exotique', icon: '⚔️' },
            { name: 'Écailles de dragon', icon: '🐉' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez le waypoint "Embarcadère de Fangfury [&BGQEAAA=]" dans le Marécage de l\'Éclair. Arrivez 10 min avant — la carte se remplit vite !' },
            { step: 2, title: 'S\'organiser sur les tourelles', description: 'Les 6 tourelles de la plage DOIVENT être défendues en permanence. Rejoignez un groupe de défense de tourelle (annoncé en chat carte).', tip: 'Si une tourelle tombe, Tequatl regagne de la vie — restez sur votre poste !' },
            { step: 3, title: 'Attaquer la main de Tequatl', description: 'Pendant que les défenseurs tiennent les tourelles, les attaquants DPS la patte/main de Tequatl dans l\'eau.' },
            { step: 4, title: 'Phase Megabomb', description: 'Tequatl plonge et une Megabomb apparaît. Tous les joueurs doivent se concentrer dessus et la détruire avant l\'explosion !' },
            { step: 5, title: 'Phases répétées', description: 'Répétez le cycle : défendre les tourelles → DPS → Megabomb. Après 3 cycles réussis, Tequatl est vaincu.', tip: 'Rejoignez un serveur organisé via LFG (Jeu > LFG > Événements mondiaux) pour maximiser vos chances.' },
          ],
        },
      ],
    },
    {
      id: 'champs-gendarran',
      name: 'Champs de Gendarran',
      color: '#c9619a',
      icon: '🐛',
      events: [
        {
          id: 'triple-terreur',
          name: 'Triple Terreur',
          zone: 'Champs de Gendarran',
          category: 'world_boss',
          isTwoHourCycle: false,
          gw2ApiId: 'triple_trouble',
          // Horaires fixes Triple Terreur (UTC) — source : wiki GW2
          slots: [
            { startMinutes: hm('01:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('12:30'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('17:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Triple_Trouble',
          rewards: [
            { name: 'Coffre de Triple Terreur', icon: '📦' },
            { name: 'Équipement exotique', icon: '⚔️' },
            { name: 'Cœurs de vers de wurm', icon: '💚' },
          ],
          guide: [
            { step: 1, title: 'Se rendre sur place', description: 'Rejoignez les Champs de Gendarran. Triple Terreur implique 3 wurms simultanément en 3 endroits différents de la carte.' },
            { step: 2, title: 'S\'organiser en 3 groupes', description: 'La carte se divise en 3 groupes : Cobalt (nord), Amber (centre), Crimson (sud). Rejoignez un groupe en suivant les annonces dans le chat.', tip: 'Commande utile : tapez /map pour voir l\'annonce de coordination.' },
            { step: 3, title: 'Interrompre les wurms', description: 'Chaque wurm doit être interrompu lors de son animation de pondaison d\'œufs. Utilisez des compétences d\'interruption (Stun, Knockback) synchronisées.', tip: 'Si un wurm pond des œufs, des adds apparaissent et compliquent l\'événement.' },
            { step: 4, title: 'Synchroniser les morts', description: 'LES 3 WURMS DOIVENT MOURIR SIMULTANÉMENT. Communiquez via /map pour synchroniser les derniers DPS. Un wurm tué seul se régénère.', tip: 'Rejoignez un serveur organisé via LFG — la coordination Discord est souvent nécessaire.' },
            { step: 5, title: 'Phase finale', description: 'Quand les 3 groupes sont prêts, le signal est donné. Finissez tous en même temps pour l\'événement complet et les meilleures récompenses.' },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// HEART OF THORNS — Méta-événements HoT
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const HOT_GROUP: EventExpansionGroup = {
  id: 'hot',
  label: 'Heart of Thorns',
  zones: [
    {
      id: 'oree-emeraude',
      name: "Orée d'Émeraude",
      color: '#6ab04c',
      icon: '🌿',
      events: [
        {
          id: 'oree-meta',
          name: "Méta de l'Orée d'Émeraude",
          zone: "Orée d'Émeraude",
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 90, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Verdant_Brink_meta_event_chain',
        },
      ],
    },
    {
      id: 'bassin-aurique',
      name: 'Bassin Aurique',
      color: '#f0c040',
      icon: '🏆',
      events: [
        {
          id: 'auric-basin-meta',
          name: 'Octovine',
          zone: 'Bassin Aurique',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('00:45', 20, 15),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Auric_Basin_meta_event_chain',
        },
      ],
    },
    {
      id: 'profondeurs-verdoyantes',
      name: 'Profondeurs Verdoyantes',
      color: '#9b59b6',
      icon: '🕳️',
      events: [
        {
          id: 'chak-gerent',
          name: 'Chak Gérent',
          zone: 'Profondeurs Verdoyantes',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('00:30', 20, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Chak_Gerent',
        },
      ],
    },
    {
      id: 'repli-dragon',
      name: 'Repli du Dragon',
      color: '#e74c3c',
      icon: '🐉',
      events: [
        {
          id: 'liberation-soleil-dragon',
          name: 'Libération du Soleil Dragon',
          zone: 'Repli du Dragon',
          category: 'hot',
          isTwoHourCycle: true,
          slots: cycle2h('01:30', 20, 5),
          wikiUrl: "https://wiki.guildwars2.com/wiki/Dragon%27s_Stand_meta_event_chain",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// PATH OF FIRE — Méta-événements PoF
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const POF_GROUP: EventExpansionGroup = {
  id: 'pof',
  label: 'Path of Fire',
  zones: [
    {
      id: 'deserts-cristal',
      name: 'Déserts de Cristal',
      color: '#e8a030',
      icon: '🏜️',
      events: [
        {
          id: 'palawadan',
          name: 'Palawadan, Joyau du Désert',
          zone: 'Déserts de Cristal',
          category: 'pof',
          isTwoHourCycle: false,
          // Horaires fixes toutes les 2h à xx:00 (UTC)
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('02:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('06:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('10:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('12:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('14:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('18:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 5 },
            { startMinutes: hm('22:00'), durationMinutes: 30, preEventMinutes: 5 },
          ],
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Palawadan,_Jewel_of_the_Desert',
        },
      ],
    },
    {
      id: 'domaine-vabbi',
      name: 'Domaine de Vabbi',
      color: '#e8a030',
      icon: '🕌',
      events: [
        {
          id: 'grand-court-sekhara',
          name: 'La Grande Cour de Sekhara',
          zone: 'Domaine de Vabbi',
          category: 'pof',
          isTwoHourCycle: true,
          slots: cycle2h('00:30', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Grand_Court_of_Sekhara',
        },
      ],
    },
    {
      id: 'bassin-elon',
      name: "Bassin d'Elon",
      color: '#e8a030',
      icon: '🌊',
      events: [
        {
          id: 'boucher-abomination',
          name: "Abomination du Boucher",
          zone: "Bassin d'Elon",
          category: 'pof',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 20, 5),
          wikiUrl: "https://wiki.guildwars2.com/wiki/Elon_Riverlands",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// END OF DRAGONS — Méta-événements EoD
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const EOD_GROUP: EventExpansionGroup = {
  id: 'eod',
  label: 'End of Dragons',
  zones: [
    {
      id: 'fin-du-dragon',
      name: "Fin du Dragon",
      color: '#4a90d9',
      icon: '🐲',
      events: [
        {
          id: 'temple-moisson',
          name: 'Temple de la Moisson',
          zone: "Fin du Dragon",
          category: 'eod',
          isTwoHourCycle: false,
          // Horaires fixes toutes les 2h à xx:00 (UTC)
          slots: [
            { startMinutes: hm('00:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('02:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('04:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('06:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('08:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('10:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('12:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('14:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('16:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('18:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('20:00'), durationMinutes: 30, preEventMinutes: 10 },
            { startMinutes: hm('22:00'), durationMinutes: 30, preEventMinutes: 10 },
          ],
          wikiUrl: "https://wiki.guildwars2.com/wiki/Dragon%27s_End",
        },
      ],
    },
    {
      id: 'nouvelle-kaineng',
      name: 'Nouvelle Kaineng',
      color: '#4a90d9',
      icon: '🏙️',
      events: [
        {
          id: 'kaineng-surpeuplee',
          name: 'Surpopulation de Kaineng',
          zone: 'Nouvelle Kaineng',
          category: 'eod',
          isTwoHourCycle: true,
          slots: cycle2h('00:45', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/New_Kaineng_City',
        },
      ],
    },
    {
      id: 'echos-ecarlates',
      name: 'Échos Écarlates',
      color: '#4a90d9',
      icon: '🎋',
      events: [
        {
          id: 'arborstone',
          name: 'Méta Arborstone',
          zone: 'Échos Écarlates',
          category: 'eod',
          isTwoHourCycle: true,
          slots: cycle2h('01:15', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Seitung_Province',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// SECRETS OF THE OBSCURE — Méta-événements SotO
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// ─────────────────────────────────────────────────────────────

const SOTO_GROUP: EventExpansionGroup = {
  id: 'soto',
  label: 'Secrets of the Obscure',
  zones: [
    {
      id: 'skywatch-archipelago',
      name: 'Archipel de Skywatch',
      color: '#8e44ad',
      icon: '☁️',
      events: [
        {
          id: 'skywatch-meta',
          name: "Méta de l'Archipel de Skywatch",
          zone: 'Archipel de Skywatch',
          category: 'soto',
          isTwoHourCycle: true,
          slots: cycle2h('00:00', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Skywatch_Archipelago',
        },
      ],
    },
    {
      id: 'amnytas',
      name: 'Amnytas',
      color: '#8e44ad',
      icon: '🌌',
      events: [
        {
          id: 'amnytas-meta',
          name: "Méta d'Amnytas",
          zone: 'Amnytas',
          category: 'soto',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 30, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Amnytas',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// JANTHIR WILDS — Méta-événements JW
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// Note : syntri-meta démarre à xx:40 (confirmé wiki GW2)
// ─────────────────────────────────────────────────────────────

const JW_GROUP: EventExpansionGroup = {
  id: 'jw',
  label: 'Janthir Wilds',
  zones: [
    {
      id: 'rive-aux-epaves',
      name: 'Rive aux Épaves',
      color: '#c9619a',
      icon: '⚓',
      events: [
        {
          id: 'bagarre-cerf-marteau',
          name: 'Bagarre des Cerf-Marteau !',
          zone: 'Rive aux Épaves',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:40', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'bois-etoile',
      name: 'Bois Étoilé',
      color: '#c9619a',
      icon: '🌳',
      events: [
        {
          id: 'secrets-du-bois',
          name: 'Secrets du Bois',
          zone: 'Bois Étoilé',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:00', 15, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'bava-nisos',
      name: 'Bava Nisos',
      color: '#4a90d9',
      icon: '🏝️',
      events: [
        {
          id: 'voyage-titanesque',
          name: 'Un Voyage Titanesque',
          zone: 'Bava Nisos',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('01:20', 25, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Janthir_Wilds',
        },
      ],
    },
    {
      id: 'convergences-mont-balrior',
      name: 'Convergences : Mont Balrior',
      color: '#4a90d9',
      icon: '⛰️',
      events: [
        {
          id: 'convergences-balrior',
          name: 'Convergences',
          zone: 'Convergences : Mont Balrior',
          category: 'jw',
          isTwoHourCycle: true,
          slots: cycle2h('02:00', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Convergences',
        },
      ],
    },
    {
      id: 'syntri-de-janthir',
      name: 'Syntri de Janthir',
      color: '#4a90d9',
      icon: '🌐',
      events: [
        {
          id: 'syntri-meta',
          name: 'Méta de Syntri',
          zone: 'Syntri de Janthir',
          category: 'jw',
          isTwoHourCycle: true,
          // Départ xx:40 — confirmé wiki GW2 (Of Mists and Monsters)
          slots: cycle2h('00:40', 30, 10),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Of_Mists_and_Monsters',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// VISIONS OF ETERNITY — Méta-événements VoE
// Source : https://wiki.guildwars2.com/wiki/Event_timers
// Hammerhart Rumble + Secrets of the Weald : cycle 2h, départ xx:40
// Confirmé : wiki GW2 + gw2tldr.com live timer
// ─────────────────────────────────────────────────────────────

const VOE_GROUP: EventExpansionGroup = {
  id: 'voe',
  label: 'Visions of Eternity',
  zones: [
    {
      id: 'shipwreck-strand',
      name: 'Rive aux Épaves de Castora',
      color: '#3d8bbf',
      icon: '⚓',
      events: [
        {
          id: 'hammerhart-rumble',
          name: 'Bagarre des Hammerhart !',
          zone: 'Rive aux Épaves de Castora',
          category: 'voe',
          isTwoHourCycle: true,
          // Départ xx:40 — confirmé wiki GW2 + gw2tldr live timer
          slots: cycle2h('00:40', 20, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Hammerhart_Rumble!',
        },
      ],
    },
    {
      id: 'starlit-weald',
      name: 'Forêt Étoilée',
      color: '#6a5acd',
      icon: '🌟',
      events: [
        {
          id: 'secrets-of-the-weald',
          name: 'Secrets de la Forêt',
          zone: 'Forêt Étoilée',
          category: 'voe',
          isTwoHourCycle: true,
          // Départ xx:40 — même fenêtre que Hammerhart Rumble
          slots: cycle2h('00:40', 25, 5),
          wikiUrl: 'https://wiki.guildwars2.com/wiki/Secrets_of_the_Weald',
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Export principal — ordre d'affichage dans l'UI
// Ordre chronologique des extensions GW2
// ─────────────────────────────────────────────────────────────

export const EVENT_GROUPS: EventExpansionGroup[] = [
  WORLD_BOSSES_GROUP, // Core Tyria
  HOT_GROUP,          // Heart of Thorns (2015)
  POF_GROUP,          // Path of Fire (2017)
  EOD_GROUP,          // End of Dragons (2022)
  SOTO_GROUP,         // Secrets of the Obscure (2023)
  JW_GROUP,           // Janthir Wilds (2024)
  VOE_GROUP,          // Visions of Eternity (2025)
];

/** IDs des groupes pour les filtres de l'UI */
export const EXPANSION_FILTER_IDS = EVENT_GROUPS.map((g) => g.id);