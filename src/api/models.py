from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # nullable=True por si es solo Google
    password = db.Column(db.String(200), nullable=True)
    is_premium = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<User {self.email}>"


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    activity_level = db.Column(db.Integer, default=1)  # 1–5
    is_verified = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Place {self.name}>"


class PremiumRoute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    points = db.Column(db.JSON)  # lista de puntos de la ruta

    def __repr__(self):
        return f"<PremiumRoute {self.title}>"
