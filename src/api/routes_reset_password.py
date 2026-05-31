from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash

from src.api.models import db, User

reset_bp = Blueprint("reset_bp", __name__)


# ============================================================
# RESET PASSWORD
# ============================================================
@reset_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json() or {}

    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        return jsonify({"msg": "Token y nueva contraseña son obligatorios"}), 400

    user = User.query.filter_by(recovery_token=token).first()

    if not user:
        return jsonify({"msg": "Token inválido o expirado"}), 400

    # Actualizar contraseña
    user.password = generate_password_hash(new_password)

    # Invalidar token
    user.recovery_token = None

    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada correctamente"}), 200
