from flask import Blueprint

api = Blueprint('api', __name__)

# Aquí se importan los submódulos para registrar rutas
from . import routes_auth
from . import routes_health
from . import routes_places
from . import routes_premium
from . import routes_pois
