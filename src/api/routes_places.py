from flask import Blueprint, jsonify
from src.api.models import db, Place

places = Blueprint("places", __name__)


@places.route("/places", methods=["GET"])
def get_places():
    all_places = Place.query.all()
    return jsonify([p.serialize() for p in all_places]), 200
