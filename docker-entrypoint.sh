#!/bin/bash
set -e

cd /var/www/html/backend

# Configure Apache to listen on Render's dynamic PORT (defaults to 10000 or 80)
PORT="${PORT:-10000}"
echo "Configuring Apache to listen exclusively on port ${PORT}..."
echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# 1. Ensure static health check files exist in public directory
echo "OK" > /var/www/html/backend/public/health
echo "OK" > /var/www/html/backend/public/up
chmod 644 /var/www/html/backend/public/health /var/www/html/backend/public/up

# 2. Ensure .env file exists
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
    else
        touch .env
    fi
fi

# 3. Ensure a valid APP_KEY exists
DEFAULT_KEY="base64:wlWvcaADEomFbuBoQSMuzWUD20tpdFm8+5FksUPAltg="

if [ -n "$APP_KEY" ]; then
    echo "Using provided APP_KEY..."
    if grep -q "^APP_KEY=" .env; then
        sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" .env
    else
        echo "APP_KEY=${APP_KEY}" >> .env
    fi
else
    CURRENT_KEY=$(grep "^APP_KEY=" .env | cut -d '=' -f2-)
    if [ -z "$CURRENT_KEY" ]; then
        echo "Generating fresh APP_KEY..."
        php artisan key:generate --force 2>/dev/null || echo "APP_KEY=${DEFAULT_KEY}" >> .env
    fi
fi

# Extract and export final APP_KEY
FINAL_KEY=$(grep "^APP_KEY=" .env | cut -d '=' -f2-)
export APP_KEY="${FINAL_KEY:-$DEFAULT_KEY}"

# Inject critical environment variables into Apache envvars
echo "export APP_KEY='${APP_KEY}'" >> /etc/apache2/envvars
echo "export APP_ENV='${APP_ENV:-production}'" >> /etc/apache2/envvars
echo "export APP_DEBUG='${APP_DEBUG:-false}'" >> /etc/apache2/envvars
echo "export DB_CONNECTION='${DB_CONNECTION:-sqlite}'" >> /etc/apache2/envvars
if [ -n "$DATABASE_URL" ]; then
    echo "export DATABASE_URL='${DATABASE_URL}'" >> /etc/apache2/envvars
fi

# 4. Prepare SQLite if DB_CONNECTION is sqlite (default)
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    mkdir -p /var/www/html/backend/database
    if [ ! -f /var/www/html/backend/database/database.sqlite ]; then
        echo "Creating database.sqlite file..."
        touch /var/www/html/backend/database/database.sqlite
    fi
    chmod 777 /var/www/html/backend/database
    chmod 666 /var/www/html/backend/database/database.sqlite
    chown -R www-data:www-data /var/www/html/backend/database
fi

# 5. Ensure storage directory structure and permissions
mkdir -p storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs \
         bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache .env public
chmod -R 777 storage bootstrap/cache
chmod 664 .env

# 6. Clear old cached configs
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# 7. Run database migrations and seeders safely
echo "Running migrations..."
php artisan migrate --force || echo "Migration notice: continuing..."

echo "Running seeders..."
php artisan db:seed --force || echo "Seeding notice: continuing..."

# 8. Optimize Laravel caching with current environment
echo "Optimizing configuration cache..."
php artisan config:cache || true
php artisan view:cache || true

echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
