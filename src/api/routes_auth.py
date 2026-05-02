from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.api.models import db, User

auth_api = Blueprint("auth_api", __name__)

# ============================
# REGISTER
# ============================
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


# ============================
# LOGIN
# ============================
@auth_api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# ============================
# ME
# ============================
@auth_api.route("/me", methods=["GET"])
@jwt_required()
def me():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        return jsonify({"user": user.serialize()}), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500
