from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User

auth = Blueprint('auth', __name__)

# REGISTER
@auth.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email y password requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "usuario ya existe"}), 400

    hashed = generate_password_hash(password)
    new_user = User(email=email, password=hashed)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "usuario creado"}), 201


# LOGIN
@auth.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "credenciales inválidas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# ME (ruta protegida)
@auth.route('/api/auth/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.serialize()), 200
