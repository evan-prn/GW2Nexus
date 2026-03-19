# ═══════════════════════════════════════════════════════════════════
# GW2Nexus — Dockerfile Backend (Laravel 11)
# PHP 8.3 CLI — Extensions complètes pour Laravel + GW2 API
# ═══════════════════════════════════════════════════════════════════

FROM php:8.3-cli

# ─── Métadonnées ────────────────────────────────────────────────────
LABEL maintainer="GW2Nexus Team"
LABEL description="Backend Laravel 11 — API REST + Sanctum"

# ─── Dépendances système ─────────────────────────────────────────────
# git            : requis par Composer pour les packages installés depuis GitHub
# zip / unzip    : requis par Composer pour extraire les archives de packages
# libzip-dev     : bibliothèque C pour l'extension PHP zip
# libpng-dev     : bibliothèque C pour l'extension PHP gd (traitement d'images avatars)
# libonig-dev    : bibliothèque C pour l'extension PHP mbstring (chaînes UTF-8)
# libxml2-dev    : bibliothèque C pour l'extension PHP xml (requis par certains packages)
# libicu-dev     : bibliothèque C pour l'extension PHP intl (localisation, tri Unicode)
# libcurl4-openssl-dev : bibliothèque C pour l'extension PHP curl
#                        requis pour Guzzle / Laravel HTTP Client (appels API GW2)
# curl (binaire) : utilisé dans le healthcheck docker-compose (CMD curl -f ...)
#
# Toutes les bibliothèques sont installées en une seule commande RUN
# pour minimiser le nombre de couches Docker et la taille de l'image finale.
# apt-get clean + rm -rf supprime les listes apt après installation.
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
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
        intl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ─── Composer ───────────────────────────────────────────────────────
# Copié depuis l'image officielle Composer 2 via multi-stage build.
# Plus propre et léger qu'une installation manuelle (curl + bash).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ─── Dépendances PHP ─────────────────────────────────────────────────
# On copie uniquement composer.json et composer.lock en premier.
# Si ces fichiers n'ont pas changé, Docker réutilise la couche en cache
# et saute le composer install — le build est beaucoup plus rapide.
COPY composer.json composer.lock ./

# --no-scripts          : n'exécute pas les scripts Composer (post-install-cmd etc.)
#                         car le code source n'est pas encore copié à ce stade
# --no-interaction      : mode non-interactif (pas de prompts) adapté à Docker
# --prefer-dist         : télécharge les archives zip plutôt que de cloner via git
#                         (plus rapide, moins de dépendances réseau)
# --optimize-autoloader : génère un autoloader optimisé (classmap complet)
#                         améliore les performances de résolution de classes
RUN composer install \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ─── Code source ─────────────────────────────────────────────────────
# Copié après composer install pour maximiser le cache Docker.
# En dev, le volume mount dans docker-compose.yml prend le relais.
COPY . .

# ─── Permissions Laravel ─────────────────────────────────────────────
# storage/     : Laravel y écrit les logs, sessions, cache fichier et fichiers uploadés
# bootstrap/cache/ : Laravel y met en cache la configuration et les routes compilées
#
# chown avant chmod : on attribue d'abord la propriété à www-data,
# puis on définit les permissions (775 = rwxrwxr-x)
# 775 : propriétaire et groupe peuvent lire/écrire/exécuter, autres peuvent lire
# On n'utilise pas 777 — inutile et dangereux même en dev
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# ─── Script d'entrée ─────────────────────────────────────────────────
# Le script entrypoint gère le démarrage du container :
#   - php artisan migrate --force  (applique les migrations en attente)
#   - php artisan config:cache     (optionnel en dev)
#   - exec "$@"                    (démarre la commande passée en CMD)
RUN chmod +x docker-entrypoint.sh

# ─── Utilisateur non-root ───────────────────────────────────────────
# On bascule vers www-data après toutes les opérations root.
# www-data (uid 33) est l'utilisateur standard pour les process web PHP.
# Note : le docker-compose.yml surcharge cet utilisateur avec
#        user: "${UID:-1000}:${GID:-1000}" pour aligner les permissions
#        sur les fichiers du volume mount en dev.
USER www-data

# ─── Port Laravel dev server ─────────────────────────────────────────
EXPOSE 8000

# ─── Démarrage ──────────────────────────────────────────────────────
# ENTRYPOINT : toujours exécuté — gère l'initialisation du container
# CMD        : commande par défaut passée à l'entrypoint via exec "$@"
#              peut être surchargée au runtime :
#              docker compose exec laravel php artisan tinker
#              docker compose run laravel php artisan migrate:fresh --seed
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
