#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Script de déploiement VPS OVH
# Emplacement : scripts/deploy.sh
# Exécuté sur le VPS par GitHub Actions via SSH
# ═══════════════════════════════════════════════════════════════════
set -e

APP_DIR="/var/www/gw2nexus"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 GW2Nexus — Déploiement production VPS OVH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$APP_DIR"

# ── 1. Récupération du code ──────────────────────────────────────
echo ""
echo "📥 [1/4] Pull branche main..."
git pull origin main

# ── 2. Build des images ──────────────────────────────────────────
echo ""
echo "🐳 [2/4] Build des images Docker production..."
docker compose -f docker-compose.prod.yml build --no-cache

# ── 3. Redémarrage des services ──────────────────────────────────
echo ""
echo "🔄 [3/4] Redémarrage des conteneurs..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

# ── 4. Vérification ─────────────────────────────────────────────
echo ""
echo "✅ [4/4] Vérification des services..."
sleep 5
docker compose -f docker-compose.prod.yml ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Déploiement terminé !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"