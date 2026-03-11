FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev \
    libxml2-dev default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-scripts --no-interaction --prefer-dist --optimize-autoloader 2>/dev/null || \
    composer update --no-scripts --no-interaction --prefer-dist --optimize-autoloader

RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
