# settings_docker.py - Configuración para Docker
import os
from .settings import *

# Configuración para Docker
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1', 
    'backend',
    '0.0.0.0',
    '*'  # Solo para desarrollo, quitar en producción
]

# Base de datos - mantener SQLite para simplicidad
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Para producción con PostgreSQL (descomenta si usas postgres)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('POSTGRES_DB', 'quote_build'),
#         'USER': os.environ.get('POSTGRES_USER', 'quote_user'),
#         'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'quote_pass'),
#         'HOST': os.environ.get('POSTGRES_HOST', 'postgres'),
#         'PORT': os.environ.get('POSTGRES_PORT', '5432'),
#     }
# }

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://frontend:80",
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings for production
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'