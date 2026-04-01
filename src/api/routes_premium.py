from flask import Blueprint, jsonify

premium = Blueprint('premium', __name__)

@premium.route('/premium', methods=['GET'])
def get_premium():
    return jsonify({"message": "Endpoint /premium funcionando"}), 200
