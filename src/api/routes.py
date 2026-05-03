# src/api/routes.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from src.api.models import db, User

api = Blueprint("api", __name__)

# ============================
# REGISTER
# ============================
@api.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    shortname = data.get("shortname")
    email = data.get("email")
    password = data.get("password")
    avatar = data.get("avatar")

    if not shortname or not email or not password or not avatar:
        return jsonify({"msg": "Faltan datos"}), 400

    # ¿Existe ya?
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"msg": "Ese correo ya está registrado"}), 400

    # Crear usuario
    user = User(
        shortname=shortname,
        email=email,
        password=generate_password_hash(password),
        avatar=avatar
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado correctamente"}), 201


# ============================
# LOGIN
# ============================
@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    return jsonify({
        "token": "fake-token",
        "user": user.serialize()
    }), 200