import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from src.api.models import db
from src.api.extensions import mail

# Blueprints
from src.api.routes_auth import auth_api
from src.api.routes_places import places_api
from src.api.routes_pois import pois_api
from src.api.routes_premium import premium_api
from src.api.routes_routes import routes_api
from src.api.routes_favorites import favorites_api
from src.api.routes_recover import recover_bp
from src.api.routes_reset_password import reset_bp
from src.api.routes_health import health_api


def create_app():
    app = Flask(__name__)

    # CONFIG
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # EXTENSIONS
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    mail.init_app(app)

    # CORS GLOBAL (SOLUCIÓN FINAL)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    # BLUEPRINTS
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(places_api, url_prefix="/api")
    app.register_blueprint(pois_api, url_prefix="/api")
    app.register_blueprint(premium_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")
    app.register_blueprint(favorites_api, url_prefix="/api")
    app.register_blueprint(recover_bp, url_prefix="/api")
    app.register_blueprint(reset_bp, url_prefix="/api")
    app.register_blueprint(health_api, url_prefix="/api")

    # ERRORS
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app
