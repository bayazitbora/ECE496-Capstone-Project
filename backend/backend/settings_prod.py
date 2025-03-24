from .settings import *
import os

DEBUG = os.environ.get('DJANGO_DEBUG', '0') == '1'

# Use SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Security settings
ALLOWED_HOSTS = ['localhost', '.onrender.com']  # Allow Render domains and localhost
CSRF_TRUSTED_ORIGINS = ['https://*.onrender.com']  # Allow HTTPS requests from Render domains

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Secret key from environment
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# If using production, enable additional security
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True 