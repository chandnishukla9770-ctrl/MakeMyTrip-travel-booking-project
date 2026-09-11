"""
WSGI config for makemytrip project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makemytrip.settings')

application = get_wsgi_application()

if os.getenv('DATABASE_PATH'):
    call_command('migrate', interactive=False, verbosity=0)
    call_command('loaddata', 'catalog.json', verbosity=0)
