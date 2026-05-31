from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.api.models import db, POI

pois_api = Blueprint("pois_api", __name__)


# ============================================================
# CREATE POI
# ============================================================
@pois_api.route("/pois", methods=["POST"])
@jwt_required()
def create_poi():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name or lat is None or lng is None:
        return jsonify({"message": "name, lat y lng son obligatorios"}), 400

    poi = POI(
        user_id=user_id,
        name=name,
        description=description,
        lat=lat,
        lng=lng
    )

    db.session.add(poi)
    db.session.commit()

    return jsonify({
        "message": "POI creado correctamente",
        "poi": poi.serialize()
    }), 201


# ============================================================
# GET USER POIS
# ============================================================
@pois_api.route("/pois", methods=["GET"])
@jwt_required()
def get_pois():
    user_id = get_jwt_identity()
    pois = POI.query.filter_by(user_id=user_id).all()
    return jsonify([p.serialize() for p in pois]), 200


# ============================================================
# DELETE POI
# ============================================================
@pois_api.route("/pois/<int:poi_id>", methods=["DELETE"])
@jwt_required()
def delete_poi(poi_id):
    user_id = get_jwt_identity()

    poi = POI.query.filter_by(id=poi_id, user_id=user_id).first()

    if not poi:
        return jsonify({"message": "POI no encontrado"}), 404

    db.session.delete(poi)
    db.session.commit()

    return jsonify({"message": "POI eliminado"}), 200
