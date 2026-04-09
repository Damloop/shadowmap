from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ============================
# USER
# ============================


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    shortname = db.Column(db.String(7), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    avatar = db.Column(db.Integer, nullable=True)

    recovery_token = db.Column(db.String(200), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "shortname": self.shortname,
            "email": self.email,
            "avatar": self.avatar,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ============================
# PLACE
# ============================


class Place(db.Model):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "description": self.description,
            "category": self.category,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class POI(db.Model):
    __tablename__ = "pois"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ============================
# FAVORITE
# ============================


class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey(
        "places.id"), nullable=False)

    user = db.relationship("User", backref="favorites", lazy=True)
    place = db.relationship("Place", backref="favorited_by", lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "place_id": self.place_id,
            "place": self.place.serialize() if self.place else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# ============================
# ROUTE
# ============================


class Route(db.Model):
    __tablename__ = "routes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.String(500), nullable=True)
    color = db.Column(db.String(20), nullable=False)

    is_shared = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    points = db.relationship(
        "RoutePoint",
        backref="route",
        cascade="all, delete-orphan",
        lazy=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "rating": self.rating,
            "notes": self.notes,
            "color": self.color,
            "is_shared": self.is_shared,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "points": [p.serialize() for p in self.points]
        }

# ============================
# ROUTE POINT
# ============================


class RoutePoint(db.Model):
    __tablename__ = "route_points"

    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey(
        "routes.id"), nullable=False)

    order = db.Column(db.Integer, nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "order": self.order,
            "lat": self.lat,
            "lng": self.lng
        }

# ============================
# PREMIUM ROUTE
# ============================


class PremiumRoute(db.Model):
    __tablename__ = "premium_routes"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(1000), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="premium_routes", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
