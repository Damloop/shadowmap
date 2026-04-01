from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from api.models import db
from api.routes_auth import auth
from api.routes_health import health
from api.routes_places import places
from api.routes_premium import premium
from api.routes_pois import pois

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
Migrate(app, db)
CORS(app)

# Registrar blueprints
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(health, url_prefix="/api")
app.register_blueprint(places, url_prefix="/api")
app.register_blueprint(premium, url_prefix="/api")
app.register_blueprint(pois, url_prefix="/api")

@app.route('/')
def home():
    return "Backend funcionando"
