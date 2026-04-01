#!/bin/sh
# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — docker-entrypoint.sh PRODUCTION
# Emplacement : backend/docker-entrypoint.prod.sh
#
# Différences vs entrypoint dev :
#   ✗ config:clear / route:clear  (on ne vide pas le cache en prod)
#   ✓ config:cache                (cache compilé = meilleures perfs)
#   ✓ route:cache                 (idem)
#   ✓ view:cache                  (idem)
# ═══════════════════════════════════════════════════════════════════
set -e

echo "────────────────────────────────────────────────────"
echo " GW2Nexus — Initialisation container Laravel (PROD)"
echo "────────────────────────────────────────────────────"

# ─── Attente MySQL ───────────────────────────────────────────────
echo "→ Vérification de la connexion MySQL..."
until php artisan db:show --no-ansi > /dev/null 2>&1; do
    echo "  MySQL non disponible — nouvel essai dans 2s..."
    sleep 2
done
echo "  MySQL disponible ✓"

# ─── Migrations ─────────────────────────────────────────────────
echo "→ Exécution des migrations..."
php artisan migrate --force
echo "  Migrations terminées ✓"

# ─── Cache de production ─────────────────────────────────────────
# En prod, on compile le cache pour améliorer les performances.
# Contrairement au dev, on ne vide pas — on reconstruit.
echo "→ Compilation du cache Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "  Cache compilé ✓"

echo "────────────────────────────────────────────────────"
echo " Démarrage du serveur Laravel..."
echo "────────────────────────────────────────────────────"

exec "$@"