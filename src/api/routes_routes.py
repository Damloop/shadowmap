from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.api.models import db, Route, RoutePoint

routes_api = Blueprint("routes_api", __name__)


# ============================================================
# CREATE ROUTE
# ============================================================
@routes_api.route("/routes", methods=["POST"])
@jwt_required()
def create_route():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    name = data.get("name")
    color = data.get("color")
    points = data.get("points", [])

    if not name or not color:
        return jsonify({"message": "name y color son obligatorios"}), 400

    if not isinstance(points, list) or len(points) == 0:
        return jsonify({"message": "La ruta debe tener al menos 1 punto"}), 400

    route = Route(
        user_id=user_id,
        name=name,
        color=color,
        rating=data.get("rating"),
        notes=data.get("notes"),
        is_shared=False
    )

    db.session.add(route)
    db.session.commit()

    # Crear puntos
    for i, p in enumerate(points):
        rp = RoutePoint(
            route_id=route.id,
            order=i,
            lat=p.get("lat"),
            lng=p.get("lng")
        )
        db.session.add(rp)

    db.session.commit()

    return jsonify({
        "message": "Ruta creada correctamente",
        "route": route.serialize()
    }), 201


# ============================================================
# GET USER ROUTES
# ============================================================
@routes_api.route("/routes", methods=["GET"])
@jwt_required()
def get_routes():
    user_id = get_jwt_identity()
    routes = Route.query.filter_by(user_id=user_id).all()
    return jsonify([r.serialize() for r in routes]), 200


# ============================================================
# GET SINGLE ROUTE
# ============================================================
@routes_api.route("/routes/<int:route_id>", methods=["GET"])
@jwt_required()
def get_route(route_id):
    user_id = get_jwt_identity()

    route = Route.query.filter_by(id=route_id, user_id=user_id).first()
    if not route:
        return jsonify({"message": "Ruta no encontrada"}), 404

    return jsonify(route.serialize()), 200


# ============================================================
# DELETE ROUTE
# ============================================================
@routes_api.route("/routes/<int:route_id>", methods=["DELETE"])
@jwt_required()
def delete_route(route_id):
    user_id = get_jwt_identity()

    route = Route.query.filter_by(id=route_id, user_id=user_id).first()
    if not route:
        return jsonify({"message": "Ruta no encontrada"}), 404

    db.session.delete(route)
    db.session.commit()

    return jsonify({"message": "Ruta eliminada"}), 200


# ============================================================
# SHARE ROUTE
# ============================================================
@routes_api.route("/routes/<int:route_id>/share", methods=["POST"])
@jwt_required()
def share_route(route_id):
    user_id = get_jwt_identity()

    route = Route.query.filter_by(id=route_id, user_id=user_id).first()
    if not route:
        return jsonify({"message": "Ruta no encontrada"}), 404

    route.is_shared = True
    db.session.commit()

    return jsonify({"message": "Ruta compartida"}), 200
