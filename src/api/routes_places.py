from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.api.models import db, Place

places_api = Blueprint("places_api", __name__)


# ============================================================
# CREATE PLACE
# ============================================================
@places_api.route("/places", methods=["POST"])
@jwt_required()
def create_place():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    name = data.get("name")
    description = data.get("description")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name or lat is None or lng is None:
        return jsonify({"message": "name, lat y lng son obligatorios"}), 400

    place = Place(
        user_id=user_id,
        name=name,
        description=description,
        lat=lat,
        lng=lng
    )

    db.session.add(place)
    db.session.commit()

    return jsonify({
        "message": "Lugar creado correctamente",
        "place": place.serialize()
    }), 201


# ============================================================
# GET USER PLACES
# ============================================================
@places_api.route("/places", methods=["GET"])
@jwt_required()
def get_places():
    user_id = get_jwt_identity()
    places = Place.query.filter_by(user_id=user_id).all()
    return jsonify([p.serialize() for p in places]), 200


# ============================================================
# DELETE PLACE
# ============================================================
@places_api.route("/places/<int:place_id>", methods=["DELETE"])
@jwt_required()
def delete_place(place_id):
    user_id = get_jwt_identity()

    place = Place.query.filter_by(id=place_id, user_id=user_id).first()

    if not place:
        return jsonify({"message": "Lugar no encontrado"}), 404

    db.session.delete(place)
    db.session.commit()

    return jsonify({"message": "Lugar eliminado"}), 200
