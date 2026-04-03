# src/api/routes_pois.py

from flask import Blueprint, jsonify, request
from src.api.models import db, POI

pois = Blueprint("pois", __name__)

# ============================
# GET /api/pois → Lista de POIs
# ============================
@pois.route("/pois", methods=["GET"])
def get_pois():
    all_pois = POI.query.all()
    return jsonify([p.serialize() for p in all_pois]), 200


# =====================================
# GET /api/pois/<id> → Detalle de un POI
# =====================================
@pois.route("/pois/<int:poi_id>", methods=["GET"])
def get_poi(poi_id):
    poi = POI.query.get(poi_id)
    if not poi:
        return jsonify({"error": "POI not found"}), 404
    return jsonify(poi.serialize()), 200


# ================================
# POST /api/pois → Crear un nuevo POI
# ================================
@pois.route("/pois", methods=["POST"])
def create_poi():
    data = request.json

    required = ["name", "lat", "lng", "type"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_poi = POI(
        name=data["name"],
        lat=data["lat"],
        lng=data["lng"],
        type=data["type"],
        description=data.get("description", "")
    )

    db.session.add(new_poi)
    db.session.commit()

    return jsonify(new_poi.serialize()), 201


# ==========================================
# PUT /api/pois/<id> → Actualizar un POI
# ==========================================
@pois.route("/pois/<int:poi_id>", methods=["PUT"])
def update_poi(poi_id):
    poi = POI.query.get(poi_id)
    if not poi:
        return jsonify({"error": "POI not found"}), 404

    data = request.json

    poi.name = data.get("name", poi.name)
    poi.lat = data.get("lat", poi.lat)
    poi.lng = data.get("lng", poi.lng)
    poi.type = data.get("type", poi.type)
    poi.description = data.get("description", poi.description)

    db.session.commit()

    return jsonify(poi.serialize()), 200


# ==========================================
# DELETE /api/pois/<id> → Eliminar un POI
# ==========================================
@pois.route("/pois/<int:poi_id>", methods=["DELETE"])
def delete_poi(poi_id):
    poi = POI.query.get(poi_id)
    if not poi:
        return jsonify({"error": "POI not found"}), 404

    db.session.delete(poi)
    db.session.commit()

    return jsonify({"message": "POI deleted"}), 200
