from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from src.api.models import db, User

api = Blueprint("api", __name__)

@api.route("/register", methods=["POST"])
def register():
    data = request.get_json()

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
