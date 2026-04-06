# src/api/routes_places.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.api.models import db, Place

places_api = Blueprint("places_api", __name__)

# -----------------------------------
# CREATE PLACE
# -----------------------------------
@places_api.route("/places", methods=["POST"])
@jwt_required()
def create_place():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")

    if not name:
        return jsonify({"message": "El nombre es obligatorio"}), 400

    new_place = Place(
        name=name,
        description=description
    )

    db.session.add(new_place)
    db.session.commit()

    return jsonify({
        "message": "Lugar creado correctamente",
        "place": new_place.serialize()
    }), 201


# -----------------------------------
# GET ALL PLACES
# -----------------------------------
@places_api.route("/places", methods=["GET"])
def get_places():
    places = Place.query.all()
    return jsonify([p.serialize() for p in places]), 200


# -----------------------------------
# GET ONE PLACE
# -----------------------------------
@places_api.route("/places/<int:place_id>", methods=["GET"])
def get_place(place_id):
    place = Place.query.get(place_id)

    if not place:
        return jsonify({"message": "Lugar no encontrado"}), 404

    return jsonify(place.serialize()), 200


# -----------------------------------
# UPDATE PLACE
# -----------------------------------
@places_api.route("/places/<int:place_id>", methods=["PUT"])
@jwt_required()
def update_place(place_id):
    place = Place.query.get(place_id)

    if not place:
        return jsonify({"message": "Lugar no encontrado"}), 404

    data = request.get_json()

    place.name = data.get("name", place.name)
    place.description = data.get("description", place.description)

    db.session.commit()

    return jsonify({
        "message": "Lugar actualizado correctamente",
        "place": place.serialize()
    }), 200


# -----------------------------------
# DELETE PLACE
# -----------------------------------
@places_api.route("/places/<int:place_id>", methods=["DELETE"])
@jwt_required()
def delete_place(place_id):
    place = Place.query.get(place_id)

    if not place:
        return jsonify({"message": "Lugar no encontrado"}), 404

    db.session.delete(place)
    db.session.commit()

    return jsonify({"message": "Lugar eliminado correctamente"}), 200
    