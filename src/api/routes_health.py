# src/api/routes_health.py

from flask import Blueprint, jsonify

health_api = Blueprint("health_api", __name__)

# ============================
# HEALTH CHECK
# ============================
@health_api.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200