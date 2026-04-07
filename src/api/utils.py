# src/api/utils.py

import secrets
from flask_mail import Message
from src.api.extensions import mail

def generate_recovery_token(user_id):
    return f"{user_id}-{secrets.token_hex(16)}"

def send_recovery_email(email, token):
    link = f"https://solid-goldfish-xj5599r4x942vrp4-3000.app.github.dev/reset-password/{token}"

    msg = Message(
        subject="ShadowMap — Restore Access",
        recipients=[email],
        body=f"""
Your access to ShadowMap requires re-stabilization.

Follow this link to restore your identity:
{link}

If you did not request this, ignore this message.
"""
    )

    mail.send(msg)
