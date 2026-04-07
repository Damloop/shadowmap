from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ============================
# USER MODEL
# ============================

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    recovery_token = db.Column(db.String(255), nullable=True)

    favorites = db.relationship(
        "Favorite", back_populates="user", cascade="all, delete-orphan"
    )
    premium_routes = db.relationship(
        "PremiumRoute", back_populates="user", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }


# ============================
# PLACE MODEL
# ============================

class Place(db.Model):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    favorites = db.relationship(
        "Favorite", back_populates="place", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }


# ============================
# FAVORITE MODEL
# ============================

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey("places.id"), nullable=False)

    user = db.relationship("User", back_populates="favorites")
    place = db.relationship("Place", back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "place_id": self.place_id
        }


# ============================
# POI MODEL
# ============================

class POI(db.Model):
    __tablename__ = "pois"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "description": self.description
        }


# ============================
# ROUTE MODEL
# ============================

class Route(db.Model):
    __tablename__ = "routes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_shared = db.Column(db.Boolean, default=False)

    points = db.relationship(
        "RoutePoint", backref="route", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "rating": self.rating,
            "notes": self.notes,
            "color": self.color,
            "created_at": self.created_at.isoformat(),
            "is_shared": self.is_shared,
            "points": [p.serialize() for p in self.points]
        }


# ============================
# ROUTE POINT MODEL
# ============================

class RoutePoint(db.Model):
    __tablename__ = "route_points"

    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey("routes.id"), nullable=False)
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
# PREMIUM ROUTE MODEL
# ============================

class PremiumRoute(db.Model):
    __tablename__ = "premium_routes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="premium_routes")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "created_at": self.created_at.isoformat()
        }
