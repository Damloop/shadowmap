# src/api/routes_recover.py

from flask import Blueprint, request, jsonify
from src.api.models import db, User
from src.api.utils import send_email
import secrets
import os

recover_bp = Blueprint("recover_bp", __name__)


@recover_bp.route("/recover", methods=["POST"])
def recover():
    """
    ShadowMap — Recovery Beacon
    Genera un token de recuperación y envía un email con el enlace.
    """
    data = request.get_json() or {}
    email = data.get("email")

    user = User.query.filter_by(email=email).first()

    # Seguridad: no revelar si existe
    if not user:
        return jsonify({"success": True}), 200

    # Token seguro
    token = secrets.token_urlsafe(32)

    # Guardar token (el modelo debe tener recovery_token)
    user.recovery_token = token
    db.session.commit()

    # Enlace al frontend
    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password/{token}"

    # Email ShadowMap
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

    send_email(
        to=email,
        subject="Recuperación de contraseña - ShadowMap",
        body=html,
        html=True
    )

    return jsonify({"success": True}), 200

def send_email(to, subject, body):
    """
    Envío de email simulado (dummy).
    """
    print("====================================")
    print(" EMAIL SIMULADO ")
    print("====================================")
    print(f"Para: {to}")
    print(f"Asunto: {subject}")
    print(f"Cuerpo:\n{body}")
    print("====================================")
    return True
