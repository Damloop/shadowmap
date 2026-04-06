# src/api/routes_pois.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.api.models import db, POI

pois_api = Blueprint("pois_api", __name__)

@pois_api.route("/pois", methods=["POST"])
@jwt_required()
def create_poi():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    lat = data.get("lat")
    lng = data.get("lng")

    if not name:
        return jsonify({"message": "El nombre es obligatorio"}), 400
    if lat is None or lng is None:
        return jsonify({"message": "Lat y lng son obligatorios"}), 400

    new_poi = POI(
        name=name,
        description=description,
        lat=lat,
        lng=lng
    )

    db.session.add(new_poi)
    db.session.commit()

    return jsonify({
        "message": "POI creado correctamente",
        "poi": new_poi.serialize()
    }), 201


@pois_api.route("/pois", methods=["GET"])
def get_all_pois():
    pois = POI.query.all()
    return jsonify([p.serialize() for p in pois]), 200


@pois_api.route("/pois/<int:poi_id>", methods=["GET"])
def get_one_poi(poi_id):
    poi = POI.query.get(poi_id)

    if not poi:
        return jsonify({"message": "POI no encontrado"}), 404

    return jsonify(poi.serialize()), 200


@pois_api.route("/pois/<int:poi_id>", methods=["PUT"])
@jwt_required()
def update_poi(poi_id):
    poi = POI.query.get(poi_id)

    if not poi:
        return jsonify({"message": "POI no encontrado"}), 404

    data = request.get_json()

    poi.name = data.get("name", poi.name)
    poi.description = data.get("description", poi.description)
    poi.lat = data.get("lat", poi.lat)
    poi.lng = data.get("lng", poi.lng)

    db.session.commit()

    return jsonify({
        "message": "POI actualizado correctamente",
        "poi": poi.serialize()
    }), 200


@pois_api.route("/pois/<int:poi_id>", methods=["DELETE"])
@jwt_required()
def delete_poi(poi_id):
    poi = POI.query.get(poi_id)

    if not poi:
        return jsonify({"message": "POI no encontrado"}), 404

    db.session.delete(poi)
    db.session.commit()

    return jsonify({"message": "POI eliminado correctamente"}), 200
