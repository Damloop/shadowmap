from flask import Blueprint, request, jsonify
from src.api.models import db, User
from src.api.extensions import mail
import uuid

recover_bp = Blueprint("recover_bp", __name__)


# ============================================================
# REQUEST PASSWORD RECOVERY
# ============================================================
@recover_bp.route("/recover", methods=["POST"])
def recover_password():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"msg": "Email requerido"}), 400

    user = User.query.filter_by(email=email).first()

    # Respuesta genérica para evitar revelar si existe o no
    if not user:
        return jsonify({"msg": "Si el email existe, se enviará un enlace"}), 200

    # Generar token único
    token = str(uuid.uuid4())
    user.recovery_token = token
    db.session.commit()

    # Enviar email real
    reset_url = f"{request.host_url}reset-password/{token}"

    mail.send({
        "to": user.email,
        "subject": "Recuperación de contraseña — ShadowMap",
        "html": f"""
            <h2>Recuperación de contraseña</h2>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="{reset_url}">{reset_url}</a>
        """
    })

    return jsonify({"msg": "Si el email existe, se enviará un enlace"}), 200
