// Couleurs officielles des raretés GW2 (wiki officiel / palette in-game).

export const RARITY_COLORS: Record<string, string> = {
  Junk: '#AAAAAA',
  Basic: '#D3D3D3',
  Fine: '#62A4DA',
  Masterwork: '#1A9306',
  Rare: '#FCD00B',
  Exotic: '#FFA405',
  Ascended: '#FB3E8D',
  Legendary: '#4C139D',
};

export const RARITY_LABELS_FR: Record<string, string> = {
  Junk: 'Rebut',
  Basic: 'Basique',
  Fine: 'Fin',
  Masterwork: 'Maître',
  Rare: 'Rare',
  Exotic: 'Exotique',
  Ascended: 'Élevé',
  Legendary: 'Légendaire',
};

export const RARITY_ORDER = [
  'Junk', 'Basic', 'Fine', 'Masterwork', 'Rare', 'Exotic', 'Ascended', 'Legendary',
];

export function getRarityColor(rarity: string): string {
  return RARITY_COLORS[rarity] ?? '#9CA3AF';
}

export function getRarityLabel(rarity: string): string {
  return RARITY_LABELS_FR[rarity] ?? rarity;
}
