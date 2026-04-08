import secrets

# ============================================================
#  GENERADOR DE TOKEN DE RECUPERACIÓN
# ============================================================

def generate_recovery_token(user_id):
    """
    Genera un token único basado en user_id + random hex.
    """
    return f"{user_id}-{secrets.token_hex(16)}"


# ============================================================
#  EMAIL DE RECUPERACIÓN (SIMULADO)
# ============================================================

def send_recovery_email(email, token):
    """
    Placeholder seguro.
    Cuando actives Flask-Mail, este método enviará emails reales.
    """
    link = f"https://shadowmap.app/reset-password/{token}"

    print("====================================")
    print(" EMAIL DE RECUPERACIÓN (SIMULADO) ")
    print("====================================")
    print(f"Para: {email}")
    print(f"Token: {token}")
    print(f"Enlace: {link}")
    print("====================================")
    print("Habilita Flask-Mail para envío real.")
    print("====================================")

    return True


# ============================================================
#  EMAIL GENÉRICO (SIMULADO) — NECESARIO PARA routes_recover
# ============================================================

def send_email(to, subject, body):
    """
    Envío de email simulado (dummy).
    Compatible con routes_recover.py.
    """
    print("====================================")
    print(" EMAIL SIMULADO ")
    print("====================================")
    print(f"Para: {to}")
    print(f"Asunto: {subject}")
    print(f"Cuerpo:\n{body}")
    print("====================================")
    return True
