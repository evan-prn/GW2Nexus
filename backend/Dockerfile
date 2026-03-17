# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Dockerfile Backend (Laravel 11)
# PHP 8.3 CLI — Extensions complètes pour Laravel + GW2 API
# ═══════════════════════════════════════════════════════════════════

FROM php:8.3-cli

# ─── Métadonnées ────────────────────────────────────────────────────
LABEL maintainer="GW2Nexus Team"
LABEL description="Backend Laravel 11 — API REST + Sanctum"

# ─── Dépendances système ─────────────────────────────────────────────
# git, curl, zip/unzip : requis par Composer
# libzip-dev           : extension PHP zip
# libpng-dev           : extension PHP gd (images avatars)
# libonig-dev          : extension PHP mbstring (chaînes multi-octets)
# libxml2-dev          : extension PHP xml (requis par certains packages)
# default-mysql-client : mysqladmin pour les health checks et debug
# libcurl4-openssl-dev : requis pour Guzzle / Laravel HTTP Client (appels API GW2)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    libcurl4-openssl-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        exif \
        bcmath \
        gd \
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ─── Composer ───────────────────────────────────────────────────────
# Copie depuis l'image officielle Composer (plus léger qu'une install manuelle)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ─── Dépendances PHP ─────────────────────────────────────────────────
# On copie uniquement composer.json/lock en premier pour le cache Docker
COPY composer.json composer.lock* ./

# --no-scripts       : évite d'exécuter les scripts Composer avant que le code soit là
# --no-interaction   : mode non-interactif pour Docker
# --prefer-dist      : télécharge les archives zip (plus rapide que git clone)
# --optimize-autoloader : génère un autoloader optimisé
RUN composer install \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ─── Code source ─────────────────────────────────────────────────────
# Copié après composer install pour maximiser le cache Docker
# En dev, le volume mount dans docker-compose.yml prend le relais
COPY . .

# ─── Permissions Laravel ─────────────────────────────────────────────
# storage/ et bootstrap/cache/ doivent être accessibles en écriture
# par le process PHP pour les logs, sessions, cache et fichiers uploadés
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# ─── Entrypoint ──────────────────────────────────────────────────────
# Le script entrypoint gère : migrations, cache config, démarrage serveur
RUN chmod +x docker-entrypoint.sh

# ─── Port Laravel dev server ─────────────────────────────────────────
EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]