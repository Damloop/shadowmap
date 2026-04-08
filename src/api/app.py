# src/api/app.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

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

    # Email opcional
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = None
    app.config["MAIL_PASSWORD"] = None

    # ============================
    # CORS (ANTES DE BLUEPRINTS)
    # ============================
    CORS(app, resources={r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
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
    from src.api.routes import api
    from src.api.routes_auth import auth_api
    from src.api.routes_routes import routes_api
    from src.api.routes_recover import recover_bp
    from src.api.routes_reset_password import reset_bp
    from src.api.routes_premium import premium_api
    from src.api.routes_places import places_api
    from src.api.routes_pois import pois_api
    from src.api.routes_health import health_api
    from src.api.routes_favorites import favorites_api

    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")
    app.register_blueprint(recover_bp, url_prefix="/api")
    app.register_blueprint(reset_bp, url_prefix="/api")
    app.register_blueprint(premium_api, url_prefix="/api")
    app.register_blueprint(places_api, url_prefix="/api")
    app.register_blueprint(pois_api, url_prefix="/api")
    app.register_blueprint(health_api, url_prefix="/api")
    app.register_blueprint(favorites_api, url_prefix="/api")

    # ============================
    # CORS GLOBAL (SOLUCIÓN FINAL)
    # ============================
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    return app
