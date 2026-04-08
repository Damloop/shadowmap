from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from src.api.models import db, Favorite, Place

favorites_api = Blueprint("favorites_api", __name__)

# -----------------------------------
# ADD FAVORITE
# -----------------------------------
@favorites_api.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()

    place_id = data.get("place_id")

    if not place_id:
        return jsonify({"message": "place_id es obligatorio"}), 400

    place = Place.query.get(place_id)
    if not place:
        return jsonify({"message": "Lugar no encontrado"}), 404

    existing = Favorite.query.filter_by(
        user_id=user_id, place_id=place_id
    ).first()

    if existing:
        return jsonify({"message": "Ya está en favoritos"}), 409

    fav = Favorite(user_id=user_id, place_id=place_id)
    db.session.add(fav)
    db.session.commit()

    return jsonify({
        "message": "Añadido a favoritos",
        "favorite": fav.serialize()
    }), 201


# -----------------------------------
# GET USER FAVORITES
# -----------------------------------
@favorites_api.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favorites]), 200


# -----------------------------------
# DELETE FAVORITE
# -----------------------------------
@favorites_api.route("/favorites/<int:fav_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(fav_id):
    user_id = get_jwt_identity()

    fav = Favorite.query.filter_by(id=fav_id, user_id=user_id).first()

    if not fav:
        return jsonify({"message": "Favorito no encontrado"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"message": "Eliminado de favoritos"}), 200
