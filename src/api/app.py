from flask import Flask
from flask_cors import CORS
from .models import db
from .routes_health import health


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializar base de datos
    db.init_app(app)

    # Registrar blueprints
    app.register_blueprint(health)

    return app


app = create_app()

# Crear tablas si no existen
with app.app_context():
    db.create_all()
