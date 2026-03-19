#!/bin/sh
# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — docker-entrypoint.sh
# Script d'initialisation du container Laravel
#
# Exécuté à chaque démarrage du container avant la commande principale.
# Gère : migrations, cache, puis délègue à la CMD du Dockerfile.
# ═══════════════════════════════════════════════════════════════════

set -e  # Arrête le script immédiatement si une commande échoue

echo "────────────────────────────────────────────────────"
echo " GW2Nexus — Initialisation du container Laravel"
echo "────────────────────────────────────────────────────"

# ─── Attente MySQL ───────────────────────────────────────────────────
# Le healthcheck MySQL dans docker-compose.yml garantit normalement
# que MySQL est prêt avant ce script. Cette boucle est une sécurité
# supplémentaire pour les cas où MySQL tarde à accepter des connexions
# malgré le healthcheck (ex: init du schéma au premier démarrage).
echo "→ Vérification de la connexion MySQL..."

until php artisan db:show --no-ansi > /dev/null 2>&1; do
    echo "  MySQL non disponible — nouvel essai dans 2s..."
    sleep 2
done

echo "  MySQL disponible ✓"

# ─── Migrations ─────────────────────────────────────────────────────
# --force : requis en dehors de l'environnement local (APP_ENV=production)
#           En dev (APP_ENV=local), Laravel demande confirmation sans --force.
#           On l'ajoute systématiquement pour que le container démarre sans interaction.
echo "→ Exécution des migrations..."
php artisan migrate --force
echo "  Migrations terminées ✓"

# ─── Cache de configuration ──────────────────────────────────────────
# En dev, on vide le cache de config pour s'assurer que les changements
# dans backend/.env sont pris en compte sans rebuild du container.
# En production, on utiliserait config:cache à la place.
echo "→ Vidage du cache de configuration..."
php artisan config:clear
php artisan route:clear
echo "  Cache vidé ✓"

echo "────────────────────────────────────────────────────"
echo " Démarrage du serveur Laravel..."
echo "────────────────────────────────────────────────────"

# ─── Délégation à la CMD ────────────────────────────────────────────
# exec remplace le process shell par la commande passée en argument.
# Cela garantit que les signaux (SIGTERM, SIGINT) sont bien transmis
# au process PHP et que Docker peut arrêter le container proprement.
# "$@" correspond à la CMD du Dockerfile :
#   php artisan serve --host=0.0.0.0 --port=8000
exec "$@"