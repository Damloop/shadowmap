# src/api/routes_places.py

from flask import Blueprint, jsonify

# No importamos Place porque NO existe en models.py
# from src.api.models import db, Place

places_api = Blueprint("places_api", __name__)

# ============================
# MÓDULO DESACTIVADO TEMPORALMENTE
# ============================

@places_api.route("/places", methods=["GET"])
def places_disabled():
    return jsonify({
        "message": "El módulo de Places está desactivado temporalmente (falta el modelo Place)."
    }), 200
