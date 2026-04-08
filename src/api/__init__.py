# src/api/__init__.py

# Este archivo solo define el paquete.
# NO debe crear una app Flask.
# NO debe registrar blueprints.
# NO debe configurar CORS.
# Todo eso ocurre en src/api/app.py

# Mantén solo esto:
from src.api.models import db
from src.api.extensions import mail

__all__ = ["db", "mail"]
