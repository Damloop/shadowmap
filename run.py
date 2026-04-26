# run.py

import os
from dotenv import load_dotenv

# Cargar variables de entorno desde .env en la raíz
load_dotenv()

from src.api.app import create_app

app = create_app()

# ❌ ELIMINADO: db.create_all()
# Flask-Migrate ya gestiona la base de datos correctamente.

if __name__ == "__main__":
    print("📨 SendGrid habilitado. Emails reales activos.")
    app.run(host="0.0.0.0", port=3001, debug=True)
