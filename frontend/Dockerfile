# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Dockerfile Frontend (React + Vite)
# Node 20 Alpine — Dev avec Hot Reload natif Vite
# ═══════════════════════════════════════════════════════════════════

FROM node:20-alpine

# ─── Métadonnées ────────────────────────────────────────────────────
LABEL maintainer="GW2Nexus Team"
LABEL description="Frontend React/TypeScript/Vite — Dev server with HMR"

# ─── Dépendances système minimales ──────────────────────────────────
# git : requis par certains packages npm (ex: husky, semantic-release)
RUN apk add --no-cache git

WORKDIR /app

# ─── Installation des dépendances ───────────────────────────────────
# On copie uniquement package.json en premier pour profiter du cache
# Docker : si package.json n'a pas changé, cette couche est réutilisée
COPY package.json package-lock.json* ./

# ci = installation stricte depuis package-lock.json (plus rapide et reproductible)
RUN npm ci

# ─── Code source ────────────────────────────────────────────────────
# Copié après npm ci pour maximiser le cache Docker
# En dev, ce COPY est surtout utile pour le premier build —
# le volume mount dans docker-compose prend ensuite le relais
COPY . .

# ─── Port Vite dev server ────────────────────────────────────────────
EXPOSE 5173

# ─── Démarrage ──────────────────────────────────────────────────────
# --host 0.0.0.0 : écoute sur toutes les interfaces (requis dans Docker)
# --port 5173    : port explicite
# HMR fonctionne via le volume mount défini dans docker-compose.yml
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]