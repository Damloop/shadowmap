from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .models import db
from .routes_health import health
from .routes_auth import auth

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuración DB
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Clave JWT
    app.config['JWT_SECRET_KEY'] = "super-secret-key"

    # Inicializar extensiones
    db.init_app(app)
    JWTManager(app)

    # Registrar blueprints
    app.register_blueprint(health)
    app.register_blueprint(auth)

    return app

app = create_app()

# Crear tablas si no existen
with app.app_context():
    db.create_all()
