# --- FIX IMPORTANTE PARA CODESPACES ---
# Esto DEBE ir en la línea 1, antes de cualquier import
from flask_migrate import Migrate
from flask_cors import CORS
from flask import Flask
from flask_jwt_extended import JWTManager
import os
import sys

# Asegurar que src/ está en el path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# --- IMPORTS DEL PROYECTO ---
from src.api.models import db
from src.api.routes_auth import auth
from src.api.routes_health import health
from src.api.routes_places import places
from src.api.routes_premium import premium
from src.api.routes_pois import pois

# --- CONFIGURACIÓN DE LA APP ---
app = Flask(__name__)

# Base de datos SQLite local
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Clave JWT
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # cámbiala si quieres

# --- INICIALIZAR EXTENSIONES ---
db.init_app(app)
Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# --- BLUEPRINTS ---
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(health, url_prefix="/api")
app.register_blueprint(places, url_prefix="/api")
app.register_blueprint(premium, url_prefix="/api")
app.register_blueprint(pois, url_prefix="/api")

# --- MAIN ---
if __name__ == "__main__":
    # IMPORTANTE: sin debug=True para evitar el bug del doble proceso en Codespaces
    app.run(host="0.0.0.0", port=3001)
