from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class POI(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    type = db.Column(db.String(50))
    description = db.Column(db.String(250))

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "type": self.type,
            "description": self.description
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))

    def serialize(self):
        return {"id": self.id, "name": self.name}
