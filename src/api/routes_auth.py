from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from src.api.models import db, User

auth_api = Blueprint("auth_api", __name__)

@auth_api.route("/register", methods=["OPTIONS"])
def register_options():
    return jsonify({"ok": True}), 200

@auth_api.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    avatar = data.get("avatar")
    shortname = data.get("shortname")

    if not email or not password or not shortname:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    hashed = generate_password_hash(password)

    new_user = User(
        email=email,
        password=hashed,
        avatar=avatar,
        shortname=shortname
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado"}), 201

@auth_api.route("/login", methods=["OPTIONS"])
def login_options():
    return jsonify({"ok": True}), 200

@auth_api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "avatar": user.avatar,
            "shortname": user.shortname
        }
    }), 200

@auth_api.route("/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "shortname": user.shortname,
        "avatar": user.avatar
    }), 200
