from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

from src.api.models import db, User

auth_api = Blueprint("auth_api", __name__)


# ============================================================
# SIGNUP
# ============================================================
@auth_api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son obligatorios"}), 400

    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"msg": "El email ya está registrado"}), 409

    user = User(
        email=email,
        password=generate_password_hash(password),
        is_premium=False
    )

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)

    return jsonify({
        "msg": "Usuario creado correctamente",
        "token": token,
        "user": user.serialize()
    }), 201


# ============================================================
# LOGIN
# ============================================================
@auth_api.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y password son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "msg": "Login correcto",
        "token": token,
        "user": user.serialize()   # incluye is_premium
    }), 200
