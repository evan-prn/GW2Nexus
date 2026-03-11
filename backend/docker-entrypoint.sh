#!/bin/sh
set -e

echo "Setting up Laravel..."

if [ ! -f .env ]; then
  cp .env.example .env
fi

php artisan key:generate --force --no-interaction

echo "Waiting for MySQL..."
until php -r "new PDO('mysql:host='.(getenv('DB_HOST') ?: 'mysql').';dbname='.(getenv('DB_DATABASE') ?: 'app'), getenv('DB_USERNAME') ?: 'app', getenv('DB_PASSWORD') ?: 'password');" 2>/dev/null; do
  echo "  Retrying in 3s..."
  sleep 3
done
echo "MySQL ready!"

php artisan migrate --force --no-interaction || true

php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Starting Laravel on http://0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000
