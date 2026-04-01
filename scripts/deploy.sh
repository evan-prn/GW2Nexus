#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Script de déploiement VPS OVH
# Emplacement : scripts/deploy.sh
# Exécuté sur le VPS par GitHub Actions via SSH
#
# Usage manuel : bash /var/www/gw2nexus/scripts/deploy.sh
# ═══════════════════════════════════════════════════════════════════

# ─── Arrêt immédiat si une commande échoue ───────────────────────
# Évite de continuer un déploiement partiel silencieusement
set -e

APP_DIR="/var/www/gw2nexus"
COMPOSE="docker compose -f docker-compose.prod.yml"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 GW2Nexus — Déploiement production VPS OVH"
echo "  📅 $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$APP_DIR"

# ── 1. Récupération du code ──────────────────────────────────────
echo ""
echo "📥 [1/5] Pull branche main..."
git fetch origin
git reset --hard origin/main
echo "  Commit déployé : $(git log -1 --format='%h — %s')"

# ── 2. Build des images ──────────────────────────────────────────
echo ""
echo "🐳 [2/5] Build des images Docker production..."
# Sans --no-cache : Docker réutilise les couches inchangées (beaucoup plus rapide).
# Le cache est invalidé automatiquement si le Dockerfile ou les fichiers copiés changent.
# Utiliser --no-cache uniquement si un build est corrompu (manuellement).
$COMPOSE build

# ── 3. Redémarrage des services ──────────────────────────────────
echo ""
echo "🔄 [3/5] Redémarrage des conteneurs..."
# --force-recreate : recrée les conteneurs même si la config n'a pas changé
# Garantit que la nouvelle image est bien utilisée
$COMPOSE up -d --force-recreate

# ── 4. Attente que Laravel soit healthy ──────────────────────────
echo ""
echo "⏳ [4/5] Attente que Laravel soit opérationnel..."
# Laravel met jusqu'à 40s (migrations + config:cache + route:cache + view:cache)
# On attend que le healthcheck passe plutôt qu'un sleep fixe
TIMEOUT=90      # Secondes max avant d'abandonner
ELAPSED=0
INTERVAL=5

until [ "$(docker inspect --format='{{.State.Health.Status}}' gw2nexus_laravel 2>/dev/null)" = "healthy" ]; do
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo ""
        echo "  ❌ Timeout — Laravel n'est pas healthy après ${TIMEOUT}s"
        echo "  Logs Laravel :"
        $COMPOSE logs --tail=30 laravel
        exit 1
    fi
    echo "  En attente... (${ELAPSED}s / ${TIMEOUT}s)"
    sleep "$INTERVAL"
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo "  Laravel healthy ✓ (${ELAPSED}s)"

# ── 5. Vérification finale ───────────────────────────────────────
echo ""
echo "✅ [5/5] État des services..."
$COMPOSE ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Déploiement terminé avec succès !"
echo "  📅 $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"