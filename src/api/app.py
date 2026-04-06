# src/api/app.py

from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from src.api.models import db
from src.api.routes import api
import src.api.routes_auth
from src.api.routes_pois import pois_api
from src.api.routes_routes import routes_api

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = "super-secret-key"

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(pois_api, url_prefix="/api")
    app.register_blueprint(routes_api, url_prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
