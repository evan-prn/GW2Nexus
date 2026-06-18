// frontend/src/api/gw2Images.ts
// Récupération des images GW2 via l'API MediaWiki du wiki officiel.
// Utilise `pageimages` (titre d'article) — plus fiable que deviner les filenames.
// CORS supporté avec origin=*

const WIKI_API = 'https://wiki.guildwars2.com/api.php';

// ─────────────────────────────────────────────────────────────
// Mapping event.id → titre de l'article wiki du boss
// ─────────────────────────────────────────────────────────────
export const WORLD_BOSS_WIKI_ARTICLES: Record<string, string> = {
  'feu-elementaire':     'Fire Elemental',
  'vers-jungle':         'Great Jungle Wurm',
  'megadestructeur':     'Megadestroyer',
  'dragon-pierre':       'The Shatterer',
  'ulgoth-modniir':      'Ulgoth the Modniir',
  'capitaine-covington': 'Admiral Taidha Covington',
  'chamane-svanir':      'Svanir Shaman Chief',
  'behemoth-ombres':     'Shadow Behemoth',
  'tequatl':             'Tequatl the Sunless',
  'golem-mark-ii':       'Golem Mark II',
  'triple-terreur':      'Triple Trouble',
  'griffe-jormag':       'Claw of Jormag',
};

// ─────────────────────────────────────────────────────────────
// Mapping emoji de récompense → titre d'article wiki de l'item
// ─────────────────────────────────────────────────────────────
export const REWARD_WIKI_ARTICLES: Record<string, string> = {
  '📦': 'Magnificent Chest',
  '🧪': 'Thermocatalytic Reagent',
  '🌿': 'Powerful Venom Sac',
  '🌋': 'Destroyer Fragment',
  '💎': 'Crystal Lodestone',
  '🌑': 'Charged Lodestone',
  '🏹': 'Large Fang',
  '⚙️': 'Intricate Totem',
  '🔷': 'Glacial Lodestone',
  '🐉': 'Vicious Talon',
  '💜': 'Corrupted Lodestone',
  '⭐': 'Dusk',
  '💚': 'Powerful Blood',
};

// URLs render API directes (confirmées, pas d'appel API nécessaire)
export const REWARD_DIRECT_URLS: Record<string, string> = {
  '💰': 'https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png',
};

// Item IDs GW2 à récupérer via /v2/items pour leurs icônes
export const REWARD_ITEM_IDS: Record<string, number> = {
  '⚔️': 30703, // arme exotique (confirmé fonctionnel)
};

// ─────────────────────────────────────────────────────────────
// Helper : résout l'URL d'icône d'une récompense
// ─────────────────────────────────────────────────────────────
export function resolveRewardIcon(
  emoji: string,
  wikiImages:  Record<string, string> | undefined,
  itemIcons:   Record<number, string> | undefined,
): string | undefined {
  if (REWARD_DIRECT_URLS[emoji]) return REWARD_DIRECT_URLS[emoji];
  const itemId  = REWARD_ITEM_IDS[emoji];
  if (itemId && itemIcons?.[itemId]) return itemIcons[itemId];
  const article = REWARD_WIKI_ARTICLES[emoji];
  if (article && wikiImages?.[article]) return wikiImages[article];
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// API wiki : `pageimages` par titre d'article
// Retourne Record<articleTitle, thumbnailUrl>
// ─────────────────────────────────────────────────────────────
export async function fetchWikiPageImages(
  articleTitles: string[],
): Promise<Record<string, string>> {
  if (!articleTitles.length) return {};

  const params = new URLSearchParams({
    action:      'query',
    titles:      articleTitles.join('|'),
    prop:        'pageimages',
    piprop:      'thumbnail',
    pithumbsize: '256',
    format:      'json',
    origin:      '*',
  });

  const res = await fetch(`${WIKI_API}?${params}`);
  if (!res.ok) throw new Error(`Wiki API ${res.status}`);
  const data = await res.json();
  const pages: Record<string, unknown> = data?.query?.pages ?? {};

  const result: Record<string, string> = {};
  for (const page of Object.values(pages) as Array<Record<string, unknown>>) {
    const thumbnail = page.thumbnail as { source: string } | undefined;
    const title     = page.title as string | undefined;
    if (thumbnail?.source && title) {
      result[title] = thumbnail.source;
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────
// API GW2 items : récupère les icônes render pour des item IDs
// Retourne Record<itemId, iconUrl>
// ─────────────────────────────────────────────────────────────
export async function fetchGw2ItemIcons(
  itemIds: number[],
): Promise<Record<number, string>> {
  if (!itemIds.length) return {};

  const res = await fetch(
    `https://api.guildwars2.com/v2/items?ids=${itemIds.join(',')}`,
  );
  if (!res.ok) throw new Error(`GW2 items API ${res.status}`);
  const items: Array<{ id: number; icon: string }> = await res.json();
  return Object.fromEntries(items.map((i) => [i.id, i.icon]));
}
