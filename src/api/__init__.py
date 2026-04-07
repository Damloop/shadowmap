from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    # ============================
    # CONFIGURACIÓN
    # ============================
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowmap.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # cámbiala en producción

    # ============================
    # EXTENSIONES
    # ============================
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # ============================
    # REGISTRO DE BLUEPRINTS
    # ============================
    from src.api.routes_auth import auth_api
    from src.api.routes_places import places_api
    from src.api.routes_favorites import favorites_api
    from src.api.routes_routes import routes_api
    from src.api.routes_premium import premium_api
    from src.api.routes_health import health_api

    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(places_api, url_prefix="/api")
    app.register_blueprint(favorites_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")
    app.register_blueprint(premium_api, url_prefix="/api")
    app.register_blueprint(health_api, url_prefix="/api")

    return app

def create_app():
    app = Flask(__name__)

    # Configuración básica
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowmap.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # cámbiala en producción

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Registrar blueprints
    from src.api.routes import api
    app.register_blueprint(api, url_prefix="/api")

    return app
