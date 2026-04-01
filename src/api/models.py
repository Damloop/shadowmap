from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# -------------------------
# MODELO USER (LOGIN/REGISTRO)
# -------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }

# -------------------------
# MODELO POI (MAPA)
# -------------------------
class POI(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lat": self.lat,
            "lng": self.lng,
            "type": self.type
        }
