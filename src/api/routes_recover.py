# src/api/routes_recover.py

from flask import Blueprint, request, jsonify
from src.api.models import db, User
from src.api.extensions import mail
import secrets
import os

recover_bp = Blueprint("recover_bp", __name__)

@recover_bp.route("/recover", methods=["POST"])
def recover():
    data = request.get_json() or {}
    email = data.get("email")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": True}), 200

    token = secrets.token_urlsafe(32)
    user.recovery_token = token
    db.session.commit()

    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password/{token}"

    html = f"""
    <h1 style='font-family: UnifrakturMaguntia, serif; color:#c9a8ff; text-shadow:0 0 12px rgba(150,80,255,0.7); text-align:center;'>
        SHADOWMAP — Recuperación
    </h1>

    <p style='color:#ddd;'>Hemos recibido una solicitud para restaurar tu acceso.</p>

    <p style='color:#c9a8ff; font-size:18px; font-weight:bold;'>
        Haz clic en el siguiente enlace para crear una nueva contraseña:
    </p>

    <a href='{reset_link}' style='padding:12px 20px; background:#5a2de0; color:white; border-radius:8px; text-decoration:none;'>
        Restaurar contraseña
    </a>

    <p style='color:#777; margin-top:20px;'>Si no solicitaste este cambio, ignora este mensaje.</p>
    """

    mail.send({
        "to": email,
        "subject": "Recuperación de contraseña - ShadowMap",
        "html": html
    })

    return jsonify({"success": True}), 200