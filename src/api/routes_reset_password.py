# src/api/routes_reset_password.py

from flask import Blueprint, request, jsonify
from src.api.models import db, User
from werkzeug.security import generate_password_hash

reset_bp = Blueprint("reset_bp", __name__)

@reset_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    """
    ShadowMap — Identity Re-Stabilization
    Valida el token y actualiza la contraseña.
    """
    data = request.get_json() or {}
    new_password = data.get("password")

    if not new_password:
        return jsonify({"msg": "Password required"}), 400

    # Buscar usuario por token
    user = User.query.filter_by(recovery_token=token).first()

    if not user:
        return jsonify({"msg": "Invalid or expired token"}), 400

    # Actualizar contraseña (HASH)
    user.password = generate_password_hash(new_password)
    user.recovery_token = None  # invalidar token
    db.session.commit()

    return jsonify({"msg": "Password updated"}), 200
