<?php

namespace App\Services;

/**
 * Décodeur de codes de chat Guild Wars 2 (`[&base64]`).
 *
 * Le format binaire n'est pas documenté officiellement par ArenaNet. La
 * structure Item ci-dessous est vérifiée par comparaison directe avec le
 * `chat_link` renvoyé par /v2/items (byte 0 = 0x02, byte 1 = quantité,
 * bytes 2-5 = id objet en little-endian uint32).
 *
 * Les octets de type pour les autres ressources (compétences, recettes,
 * skins, cartes...) ne sont PAS documentés officiellement et n'ont pas pu
 * être vérifiés ici — les tables communautaires trouvées se sont révélées
 * incohérentes sur ce premier octet. Plutôt que d'afficher une étiquette
 * potentiellement fausse, on ne reconnaît que le type Item pour l'instant :
 * un code d'un autre type renvoie simplement "non reconnu". C'est le point
 * d'extension pour les futures encyclopédies — il suffira d'ajouter l'octet
 * vérifié de chaque nouveau type ici.
 */
class Gw2ChatCodeService
{
    private const TYPE_ITEM = 0x02;

    /** @var array<int, string> */
    private const KNOWN_TYPES = [
        0x02 => 'Item',
    ];

    /**
     * @return array{type: string, gw2Id: int|null}|null null si le code est illisible/inconnu.
     */
    public function decode(string $code): ?array
    {
        $code = trim($code);

        if (! preg_match('/^\[&([A-Za-z0-9+\/=]+)\]$/', $code, $matches)) {
            return null;
        }

        $bytes = base64_decode($matches[1], true);

        if ($bytes === false || strlen($bytes) < 2) {
            return null;
        }

        $typeByte = ord($bytes[0]);
        $type = self::KNOWN_TYPES[$typeByte] ?? null;

        if ($type === null) {
            return null;
        }

        if ($typeByte === self::TYPE_ITEM) {
            // [0]=type [1]=quantité [2..5]=id objet (uint32 little-endian)
            if (strlen($bytes) < 6) {
                return null;
            }

            $unpacked = unpack('Vid', substr($bytes, 2, 4));

            return ['type' => $type, 'gw2Id' => $unpacked['id'] ?? null];
        }

        return ['type' => $type, 'gw2Id' => null];
    }

    /**
     * Détection légère (sans décodage) — utilisée côté frontend pour
     * l'UX instantanée avant d'appeler l'endpoint de résolution.
     */
    public function looksLikeChatCode(string $value): bool
    {
        return (bool) preg_match('/^\[&[A-Za-z0-9+\/=]+\]$/', trim($value));
    }
}
