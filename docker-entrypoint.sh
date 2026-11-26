#!/bin/bash
set -e

cd /var/www/html/backend

# Configure Apache to listen on Render's dynamic PORT (defaults to 10000 or 80)
PORT="${PORT:-10000}"
echo "Configuring Apache to listen on port ${PORT}..."
sed -i "s/Listen [0-9]*/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Prepare SQLite if DB_CONNECTION is sqlite (default)
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    if [ ! -f /var/www/html/backend/database/database.sqlite ]; then
        echo "Creating database.sqlite file..."
        touch /var/www/html/backend/database/database.sqlite
    fi
    chown www-data:www-data /var/www/html/backend/database/database.sqlite
    chmod 664 /var/www/html/backend/database/database.sqlite
fi

# Ensure storage directory structure
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database

# Generate App Key if not set
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is not set. Generating application key..."
    php artisan key:generate --force
fi

# Run database migrations and seeders
echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force

# Optimize Laravel caching
echo "Optimizing configuration cache..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
