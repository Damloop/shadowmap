from flask import request, jsonify
from api.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.routes import api   # si tu proyecto usa Blueprint api

# ============================
# REGISTRO
# ============================
@api.route("/register", methods=["POST"])
def register():
    data = request.json

    required = ["name", "email", "password"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Comprobar si ya existe
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        name=data["name"],
        email=data["email"],
        password=generate_password_hash(data["password"])
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


# ============================
# LOGIN
# ============================
@api.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(email=data.get("email")).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Invalid password"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({ "token": token }), 200


# ============================
# USUARIO AUTENTICADO
# ============================
@api.route("/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.serialize()), 200
