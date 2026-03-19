# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Dockerfile Frontend (React + Vite)
# Node 20 Alpine — Dev server avec Hot Module Replacement
#
# Ordre critique :
#   1. USER node avant WORKDIR
#   2. WORKDIR créé par 'node' → /app lui appartient
#   3. npm ci s'exécute en tant que 'node' → node_modules accessible
# ═══════════════════════════════════════════════════════════════════

FROM node:20-alpine

LABEL maintainer="GW2Nexus Team"
LABEL description="Frontend React/TypeScript/Vite — Dev server with HMR"

# ─── Utilisateur non-root ───────────────────────────────────────────
# Doit être déclaré AVANT WORKDIR.
# Ainsi, le répertoire /app est créé par 'node' et lui appartient.
# Si USER vient après WORKDIR, /app est créé par root → EACCES sur npm ci.
USER node

# ─── Répertoire de travail ──────────────────────────────────────────
# Créé automatiquement par Docker avec le propriétaire de l'utilisateur
# courant au moment de l'instruction — ici 'node' (uid 1000).
WORKDIR /app

# ─── Dépendances npm ────────────────────────────────────────────────
# --chown=node:node : garantit que les fichiers copiés appartiennent
# à 'node' même si le daemon Docker copie en root en interne.
COPY --chown=node:node package.json package-lock.json ./

# npm ci s'exécute en tant que 'node' — /app lui appartient → OK
RUN npm ci

# ─── Code source ────────────────────────────────────────────────────
# Copié après npm ci pour préserver le cache Docker des dépendances.
# En dev, surchargé par le volume mount docker-compose.yml (./frontend:/app).
COPY --chown=node:node . .

# ─── Port ───────────────────────────────────────────────────────────
EXPOSE 5173

# ─── Démarrage ──────────────────────────────────────────────────────
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]