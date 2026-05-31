from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ============================================================
# USER
# ============================================================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_premium = db.Column(db.Boolean, default=False)
    recovery_token = db.Column(db.String(200), nullable=True)

    routes = db.relationship("Route", backref="user", lazy=True)
    premium_routes = db.relationship("PremiumRoute", backref="user", lazy=True)
    pois = db.relationship("POI", backref="user", lazy=True)
    places = db.relationship("Place", backref="user", lazy=True)
    favorites = db.relationship("Favorite", backref="user", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_premium": self.is_premium
        }


# ============================================================
# POI
# ============================================================
class POI(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(250))
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "lat": self.lat,
            "lng": self.lng
        }


# ============================================================
# PLACE
# ============================================================
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(250))
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "description": self.description,
            "lat": self.lat,
            "lng": self.lng
        }


# ============================================================
# FAVORITE
# ============================================================
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey("place.id"), nullable=False)

    place = db.relationship("Place")

    def serialize(self):
        return {
            "id": self.id,
            "place": self.place.serialize()
        }


# ============================================================
# ROUTE
# ============================================================
class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer)
    notes = db.Column(db.String(250))
    color = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_shared = db.Column(db.Boolean, default=False)

    points = db.relationship("RoutePoint", backref="route", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "rating": self.rating,
            "notes": self.notes,
            "color": self.color,
            "created_at": self.created_at.isoformat(),
            "is_shared": self.is_shared,
            "points": [p.serialize() for p in self.points]
        }


# ============================================================
# ROUTE POINT
# ============================================================
class RoutePoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey("route.id"), nullable=False)

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


# ============================================================
# PREMIUM ROUTE
# ============================================================
class PremiumRoute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(250))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description
        }
