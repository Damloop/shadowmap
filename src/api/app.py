# --- FIX IMPORTANTE PARA CODESPACES ---
# Esto DEBE ir en la línea 1, antes de cualquier import
from api.routes_pois import pois
from api.routes_premium import premium
from api.routes_places import places
from api.routes_health import health
from api.routes_auth import auth
from api.models import db
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))


# --- CONFIGURACIÓN DE LA APP ---
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# --- INICIALIZAR DB ---
db.init_app(app)
Migrate(app, db)

# --- CORS ---
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
