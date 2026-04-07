# src/api/routes_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime
from src.api.models import db, Route, RoutePoint

routes_api = Blueprint("routes_api", __name__)

# ============================
# CREATE ROUTE
# ============================
@routes_api.route("/routes", methods=["POST"])
@jwt_required()
def create_route():
    data = request.get_json()

    name = data.get("name")
    rating = data.get("rating")
    notes = data.get("notes")
    color = data.get("color")
    points = data.get("points", [])

    if not name:
        return jsonify({"message": "El nombre es obligatorio"}), 400
    if not color:
        return jsonify({"message": "El color es obligatorio"}), 400
    if not isinstance(points, list) or len(points) < 2:
        return jsonify({"message": "La ruta necesita al menos 2 puntos"}), 400

    route = Route(
        name=name,
        rating=rating,
        notes=notes,
        color=color,
        created_at=datetime.utcnow(),
        is_shared=False
    )
    db.session.add(route)
    db.session.flush()  # Necesario para obtener route.id antes del commit

    for idx, p in enumerate(points):
        rp = RoutePoint(
            route_id=route.id,
            order=idx,
            lat=p.get("lat"),
            lng=p.get("lng")
        )
        db.session.add(rp)

    db.session.commit()

    return jsonify({
        "message": "Ruta creada correctamente",
        "route": route.serialize()
    }), 201


# ============================
# GET ALL ROUTES (PRIVATE)
# ============================
@routes_api.route("/routes", methods=["GET"])
@jwt_required()
def get_routes():
    routes = Route.query.order_by(Route.created_at.desc()).all()
    return jsonify([r.serialize() for r in routes]), 200


# ============================
# GET SHARED ROUTES (PUBLIC)
# ============================
@routes_api.route("/routes/shared", methods=["GET"])
def get_shared_routes():
    routes = Route.query.filter_by(is_shared=True).order_by(Route.created_at.desc()).all()
    return jsonify([r.serialize() for r in routes]), 200


# ============================
# SHARE ROUTE
# ============================
@routes_api.route("/routes/<int:route_id>/share", methods=["POST"])
@jwt_required()
def share_route(route_id):
    route = Route.query.get(route_id)
    if not route:
        return jsonify({"message": "Ruta no encontrada"}), 404

    route.is_shared = True
    db.session.commit()

    return jsonify({
        "message": "Ruta compartida correctamente",
        "route": route.serialize()
    }), 200
