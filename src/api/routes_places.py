from flask import Blueprint, jsonify

places = Blueprint('places', __name__)

@places.route('/places', methods=['GET'])
def get_places():
    return jsonify({"message": "Endpoint /places funcionando"}), 200
