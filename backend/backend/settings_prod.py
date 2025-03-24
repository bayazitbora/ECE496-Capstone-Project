from .settings import *
import os

DEBUG = False

# Use SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/app/backend/db.sqlite3',
    }
}

# Security settings
ALLOWED_HOSTS = ['.onrender.com', 'localhost']  # Allows Render.com domains
CSRF_TRUSTED_ORIGINS = ['https://*.onrender.com']  # Allows Render.com domains

# Static and media files
STATIC_ROOT = '/app/backend/static'
MEDIA_ROOT = '/app/backend/media'

# Security middleware
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# Secret key from environment
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY') 