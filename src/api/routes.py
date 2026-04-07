from flask import Blueprint, jsonify
from src.api import routes_auth  # Importa las rutas de autenticación

api = Blueprint("api", __name__)

# -----------------------------
# HEALTH CHECK
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
            "/register",
            "/login",
            "/auth/me",
            "/health"
        ]
    }), 200
