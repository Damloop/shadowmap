from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.api.models import db, PremiumRoute, User

premium_api = Blueprint("premium_api", __name__)


# ============================================================
# VALIDAR PREMIUM
# ============================================================
def require_premium(user_id):
    user = User.query.get(user_id)
    return user and user.is_premium


# ============================================================
# CREATE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium/routes", methods=["POST"])
@jwt_required()
def create_premium_route():
    user_id = get_jwt_identity()

    if not require_premium(user_id):
        return jsonify({"message": "Requiere cuenta premium"}), 403

    data = request.get_json() or {}

    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"message": "title es obligatorio"}), 400

    route = PremiumRoute(
        user_id=user_id,
        title=title,
        description=description
    )

    db.session.add(route)
    db.session.commit()

    return jsonify({
        "message": "Ruta premium creada",
        "route": route.serialize()
    }), 201


# ============================================================
# GET USER PREMIUM ROUTES
# ============================================================
@premium_api.route("/premium/routes", methods=["GET"])
@jwt_required()
def get_premium_routes():
    user_id = get_jwt_identity()

    if not require_premium(user_id):
        return jsonify({"message": "Requiere cuenta premium"}), 403

    routes = PremiumRoute.query.filter_by(user_id=user_id).all()
    return jsonify([r.serialize() for r in routes]), 200


# ============================================================
# DELETE PREMIUM ROUTE
# ============================================================
@premium_api.route("/premium/routes/<int:route_id>", methods=["DELETE"])
@jwt_required()
def delete_premium_route(route_id):
    user_id = get_jwt_identity()

    if not require_premium(user_id):
        return jsonify({"message": "Requiere cuenta premium"}), 403

    route = PremiumRoute.query.filter_by(id=route_id, user_id=user_id).first()

    if not route:
        return jsonify({"message": "Ruta premium no encontrada"}), 404

    db.session.delete(route)
    db.session.commit()

    return jsonify({"message": "Ruta premium eliminada"}), 200
