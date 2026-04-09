# src/api/__init__.py

from flask import Flask
from flask_cors import CORS
from src.api.models import db
from src.api.extensions import mail

def create_app():
    app = Flask(__name__)

    # CORS para permitir tu frontend
    CORS(app, resources={r"/*": {
        "origins": "*",
        "supports_credentials": True
    }})

    # Configuración DB (usa tu string real)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowmap.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    mail.init_app(app)

    # Registrar rutas
    from src.api.routes import api
    app.register_blueprint(api, url_prefix="/api")

    return app

__all__ = ["create_app", "db", "mail"]
