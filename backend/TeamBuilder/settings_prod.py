"""
Production settings for TeamBuilder project.
"""

import os
from .settings import *
import dj_database_url

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', '0') == '1'

# Set allowed hosts - use exact domain names
ALLOWED_HOSTS = ['backend-nfdh.onrender.com', 'localhost', '127.0.0.1']

# CSRF settings for secure operations
CSRF_TRUSTED_ORIGINS = ['https://frontend-3w7h.onrender.com', 'https://backend-nfdh.onrender.com']

# CORS settings - temporarily set to allow all origins for testing
CORS_ALLOW_ALL_ORIGINS = True

# More specific CORS settings (will use these after confirming CORS_ALLOW_ALL_ORIGINS works)
CORS_ALLOWED_ORIGINS = [
    "https://frontend-3w7h.onrender.com",
    "http://localhost:5173",  # Vite's default port
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Database
# Using SQLite with a persistent disk mount

# Get DATABASE_URL from environment or use default
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///persistentdb/db.sqlite3')

# Parse the DATABASE_URL
if DATABASE_URL.startswith('sqlite:///'):
    # Ensure the directory exists
    db_dir = os.path.join(BASE_DIR, 'persistentdb')
    os.makedirs(db_dir, exist_ok=True)
    
    # Configure database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, DATABASE_URL.replace('sqlite:///', '')),
            'ATOMIC_REQUESTS': True,
        }
    }
else:
    # Parse other database URLs
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }

# Static files settings
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True 