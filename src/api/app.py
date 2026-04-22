# src/api/app.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from dotenv import load_dotenv
import os

# Cargar variables de entorno (.env)
load_dotenv()

from src.api.extensions import mail
from src.api.models import db

migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    # ============================
    # CONFIGURACIÓN
    # ============================
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowmap.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    # ============================
    # CORS — CONFIGURACIÓN COMPLETA
    # ============================
    CORS(app, resources={r"/api/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "supports_credentials": True
    }})

    # ============================
    # EXTENSIONES
    # ============================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # ============================
    # BLUEPRINTS
    # ============================
    from src.api.routes_auth import auth_api
    from src.api.routes_routes import routes_api
    from src.api.routes_recover import recover_bp
    from src.api.routes_reset_password import reset_bp
    from src.api.routes_premium import premium_api
    from src.api.routes_places import places_api
    from src.api.routes_pois import pois_api
    from src.api.routes_health import health_api
    from src.api.routes_favorites import favorites_api

    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")
    app.register_blueprint(recover_bp, url_prefix="/api")
    app.register_blueprint(reset_bp, url_prefix="/api")
    app.register_blueprint(premium_api, url_prefix="/api")
    app.register_blueprint(places_api, url_prefix="/api")
    app.register_blueprint(pois_api, url_prefix="/api")
    app.register_blueprint(health_api, url_prefix="/api")
    app.register_blueprint(favorites_api, url_prefix="/api")

    return app


# ============================
# RUN SERVER (NECESARIO)
# ============================
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=3001, debug=True)
