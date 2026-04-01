from flask import Blueprint, request, jsonify
from api.models import db, User
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)
SECRET_KEY = "super-secret-key"   # cámbiala si quieres

# -------------------------
# REGISTRO
# -------------------------
@auth.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y password requeridos"}), 400

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "El usuario ya existe"}), 400

    hashed = generate_password_hash(password)
    new_user = User(email=email, password=hashed)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado correctamente"}), 201


# -------------------------
# LOGIN
# -------------------------
@auth.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    token = jwt.encode({
        "user_id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token}), 200


# -------------------------
# VALIDAR TOKEN
# -------------------------
def token_required(f):
    def wrapper(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].replace("Bearer ", "")

        if not token:
            return jsonify({"error": "Token requerido"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user = User.query.get(data["user_id"])
        except:
            return jsonify({"error": "Token inválido o expirado"}), 401

        return f(user, *args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper


# -------------------------
# RUTA PROTEGIDA
# -------------------------
@auth.route('/auth/me', methods=['GET'])
@token_required
def me(user):
    return jsonify({
        "id": user.id,
        "email": user.email
    }), 200


# -------------------------
# ROOT DEL AUTH
# -------------------------
@auth.route('/auth', methods=['GET'])
def auth_root():
    return jsonify({"message": "Auth funcionando"}), 200
