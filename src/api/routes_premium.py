# src/api/routes_premium.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.api.models import db, PremiumRoute

premium_api = Blueprint("premium_api", __name__)

# -----------------------------------
# CREATE PREMIUM ROUTE
# -----------------------------------
@premium_api.route("/premium-routes", methods=["POST"])
@jwt_required()
def create_premium_route():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    difficulty = data.get("difficulty")
    price = data.get("price")

    if not name:
        return jsonify({"message": "El nombre es obligatorio"}), 400

    new_route = PremiumRoute(
        name=name,
        description=description,
        difficulty=difficulty,
        price=price
    )

    db.session.add(new_route)
    db.session.commit()

    return jsonify({
        "message": "Ruta premium creada correctamente",
        "route": new_route.serialize()
    }), 201


# -----------------------------------
# GET ALL PREMIUM ROUTES
# -----------------------------------
@premium_api.route("/premium-routes", methods=["GET"])
def get_premium_routes():
    routes = PremiumRoute.query.all()
    return jsonify([r.serialize() for r in routes]), 200


# -----------------------------------
# GET ONE PREMIUM ROUTE
# -----------------------------------
@premium_api.route("/premium-routes/<int:route_id>", methods=["GET"])
def get_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    return jsonify(route.serialize()), 200


# -----------------------------------
# UPDATE PREMIUM ROUTE
# -----------------------------------
@premium_api.route("/premium-routes/<int:route_id>", methods=["PUT"])
@jwt_required()
def update_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    data = request.get_json()

    route.name = data.get("name", route.name)
    route.description = data.get("description", route.description)
    route.difficulty = data.get("difficulty", route.difficulty)
    route.price = data.get("price", route.price)

    db.session.commit()

    return jsonify({
        "message": "Ruta premium actualizada correctamente",
        "route": route.serialize()
    }), 200


# -----------------------------------
# DELETE PREMIUM ROUTE
# -----------------------------------
@premium_api.route("/premium-routes/<int:route_id>", methods=["DELETE"])
@jwt_required()
def delete_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    db.session.delete(route)
    db.session.commit()

    return jsonify({"message": "Ruta premium eliminada correctamente"}), 200
