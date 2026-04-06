from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from src.api.models import db, User, POI, Place
from src.api.routes import api

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = "super-secret-key"

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    app.register_blueprint(api, url_prefix="/api")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
