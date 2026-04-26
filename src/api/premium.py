from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User

premium = Blueprint('premium', __name__)

@premium.route('/premium', methods=['POST'])
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
