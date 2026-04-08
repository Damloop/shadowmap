# src/api/routes.py

from flask import Blueprint, jsonify

# Importar todos los blueprints del proyecto
from src.api.routes_auth import auth_api
from src.api.routes_places import places_api
from src.api.routes_favorites import favorites_api
from src.api.routes_routes import routes_api
from src.api.routes_premium import premium_api
from src.api.routes_health import health_api
from src.api.routes_recover import recover_bp
from src.api.routes_reset_password import reset_bp
from src.api.routes_pois import pois_api

# Blueprint raíz
api = Blueprint("api", __name__)

# Registrar blueprints
api.register_blueprint(auth_api)
api.register_blueprint(places_api)
api.register_blueprint(favorites_api)
api.register_blueprint(routes_api)
api.register_blueprint(premium_api)
api.register_blueprint(health_api)
api.register_blueprint(recover_bp)
api.register_blueprint(reset_bp)
api.register_blueprint(pois_api)

# -----------------------------
# HEALTH CHECK ROOT
# -----------------------------
@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200

# -----------------------------
# ROOT (opcional pero recomendado)
# -----------------------------
@api.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "ShadowMap API funcionando",
        "endpoints": [
            "/api/register",
            "/api/login",
            "/api/profile",
            "/api/places",
            "/api/favorites",
            "/api/routes",
            "/api/premium-routes",
            "/api/pois",
            "/api/recover",
            "/api/reset-password/<token>",
            "/api/health"
        ]
    }), 200
