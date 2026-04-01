from flask import Blueprint, jsonify
from api.models import db, POI

pois = Blueprint('pois', __name__)

@pois.route('/pois', methods=['GET'])
def get_pois():
    pois_list = POI.query.all()
    return jsonify([poi.serialize() for poi in pois_list]), 200
