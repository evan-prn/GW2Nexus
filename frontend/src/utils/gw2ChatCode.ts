// Détection légère (sans décodage) des codes de chat GW2 `[&...]`.
// Le décodage binaire réel vit uniquement côté backend (Gw2ChatCodeService) —
// voir le plan d'architecture : une seule implémentation, pas de duplication.

const CHAT_CODE_PATTERN = /^\[&[-A-Za-z0-9+/=]+\]$/;
const CHAT_CODE_GLOBAL_PATTERN = /\[&[-A-Za-z0-9+/=]+\]/g;

export function looksLikeChatCode(value: string): boolean {
  return CHAT_CODE_PATTERN.test(value.trim());
}

/** Extrait tous les codes `[&...]` présents dans un texte (contenu de forum). */
export function extractChatCodes(text: string): string[] {
  return text.match(CHAT_CODE_GLOBAL_PATTERN) ?? [];
}

export { CHAT_CODE_GLOBAL_PATTERN };
