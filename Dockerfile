# Production Dockerfile for Laravel Hotel Booking on Render
FROM php:8.2-apache

# Install system dependencies & libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libsqlite3-dev \
    sqlite3 \
    libzip-dev \
    ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configure Apache DocumentRoot to point to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/backend/public
ENV APP_KEY=base64:wlWvcaADEomFbuBoQSMuzWUD20tpdFm8+5FksUPAltg=
ENV APP_ENV=production
ENV DB_CONNECTION=sqlite

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && echo "PassEnv APP_ENV APP_KEY APP_DEBUG DB_CONNECTION DATABASE_URL PORT" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Copy full application code
COPY . /var/www/html/

# Copy frontend into backend/public so that Apache can serve it directly
RUN cp -r /var/www/html/frontend/*.html \
          /var/www/html/frontend/*.css \
          /var/www/html/frontend/*.js \
          /var/www/html/frontend/assets \
          /var/www/html/backend/public/ 2>/dev/null || true

# Prepare .env before composer install
WORKDIR /var/www/html/backend
RUN cp .env.example .env 2>/dev/null || true

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Set file permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html/backend/storage \
    /var/www/html/backend/bootstrap/cache \
    /var/www/html/backend/database \
    /var/www/html/backend/.env \
    && chmod -R 775 /var/www/html/backend/storage \
    /var/www/html/backend/bootstrap/cache \
    /var/www/html/backend/database \
    /var/www/html/backend/.env

# Make entrypoint executable
RUN chmod +x /var/www/html/docker-entrypoint.sh

WORKDIR /var/www/html/backend

EXPOSE 80 10000

ENTRYPOINT ["/var/www/html/docker-entrypoint.sh"]
