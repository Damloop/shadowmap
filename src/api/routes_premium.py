# src/api/routes_premium.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.api.models import db, PremiumRoute, User

premium_api = Blueprint("premium_api", __name__)

# ============================================================
# ACTIVAR PREMIUM (para el botón "Activar Premium")
# ============================================================
@premium_api.route("/premium", methods=["POST"])
@jwt_required()
def activate_premium():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.is_premium = True
    db.session.commit()

    return jsonify({
        "msg": "Premium activado",
        "is_premium": True
    }), 200


# ============================================================
# CREATE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium-routes", methods=["POST"])
@jwt_required()
def create_premium_route():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"message": "El título es obligatorio"}), 400

    new_route = PremiumRoute(
        user_id=user_id,
        title=title,
        description=description
    )

    db.session.add(new_route)
    db.session.commit()

    return jsonify({
        "message": "Ruta premium creada correctamente",
        "route": new_route.serialize()
    }), 201


# ============================================================
# GET ALL PREMIUM ROUTES
# ============================================================
@premium_api.route("/premium-routes", methods=["GET"])
def get_premium_routes():
    routes = PremiumRoute.query.all()
    return jsonify([r.serialize() for r in routes]), 200


# ============================================================
# GET ONE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium-routes/<int:route_id>", methods=["GET"])
def get_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    return jsonify(route.serialize()), 200


# ============================================================
# UPDATE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium-routes/<int:route_id>", methods=["PUT"])
@jwt_required()
def update_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    data = request.get_json()

    route.title = data.get("title", route.title)
    route.description = data.get("description", route.description)

    db.session.commit()

    return jsonify({
        "message": "Ruta premium actualizada correctamente",
        "route": route.serialize()
    }), 200


# ============================================================
# DELETE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium-routes/<int:route_id>", methods=["DELETE"])
@jwt_required()
def delete_premium_route(route_id):
    route = PremiumRoute.query.get(route_id)

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    db.session.delete(route)
    db.session.commit()

    return jsonify({"message": "Ruta premium eliminada correctamente"}), 200
