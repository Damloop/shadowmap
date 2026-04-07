from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from src.api.models import db

# ============================
# IMPORTAR BLUEPRINTS
# ============================
from src.api.routes_auth import auth_api
from src.api.routes_places import places_api
from src.api.routes_favorites import favorites_api
from src.api.routes_routes import routes_api
from src.api.routes_premium import premium_api
from src.api.routes_health import health_api
from src.api.routes_recover import recover_bp
from src.api.routes_reset_password import reset_bp

# ============================
# FACTORY PATTERN
# ============================


def create_app():
    app = Flask(__name__)

    # ----------------------------
    # CONFIGURACIÓN
    # ----------------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # cámbiala en producción

    # ----------------------------
    # EXTENSIONES
    # ----------------------------
    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # ----------------------------
    # REGISTRO DE BLUEPRINTS
    # ----------------------------
    app.register_blueprint(auth_api, url_prefix="/api")
    app.register_blueprint(places_api, url_prefix="/api")
    app.register_blueprint(favorites_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")
    app.register_blueprint(premium_api, url_prefix="/api")
    app.register_blueprint(health_api, url_prefix="/api")
    app.register_blueprint(recover_bp, url_prefix="/api")
    app.register_blueprint(reset_bp, url_prefix="/api")

    return app


# ============================
# ENTRYPOINT
# ============================
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
