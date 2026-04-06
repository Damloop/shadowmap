# src/api/models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class POI(db.Model):
    __tablename__ = "pois"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "lat": self.lat,
            "lng": self.lng
        }


class Route(db.Model):
    __tablename__ = "routes"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    color = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    is_shared = db.Column(db.Boolean, default=False)

    points = db.relationship("RoutePoint", backref="route", cascade="all, delete-orphan")

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
