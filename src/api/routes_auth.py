# src/api/routes_auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.api.models import db, User

auth_api = Blueprint("auth_api", __name__)

# -----------------------------
# REGISTER
# -----------------------------
@auth_api.route("/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    avatar = data.get("avatar")

    if not email or not password:
        return jsonify({"message": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message": "El usuario ya existe"}), 400

    hashed = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed,
        avatar=avatar
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado correctamente"}), 201


# -----------------------------
# LOGIN
# -----------------------------
@auth_api.route("/login", methods=["POST"])
def login_user():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    # No revelar cuál falla (seguridad)
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Email o contraseña inválidos"}), 401

    # Crear token JWT
    token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login correcto",
        "token": token,
        "user": user.serialize()
    }), 200


# -----------------------------
# AUTH / ME
# -----------------------------
@auth_api.route("/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    """
    Devuelve los datos del usuario autenticado.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200
