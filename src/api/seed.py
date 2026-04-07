from app import app
from models import db, POI

with app.app_context():
    pois = [
        POI(name="Puerta del Sol", description="Centro de Madrid",
            lat=40.4168, lng=-3.7038),
        POI(name="Plaza Mayor", description="Plaza histórica",
            lat=40.4155, lng=-3.7074),
        POI(name="Templo de Debod", description="Templo egipcio",
            lat=40.4240, lng=-3.7179),
    ]

    db.session.add_all(pois)
    db.session.commit()

    print("POIs insertados correctamente.")
