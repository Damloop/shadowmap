from flask import Blueprint, jsonify

premium = Blueprint("premium", __name__)

@premium.route("/premium", methods=["GET"])
def premium_info():
    return jsonify({"premium": True}), 200
