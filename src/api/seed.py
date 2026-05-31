from src.api.app import create_app
from src.api.models import db, POI, User

app = create_app()

with app.app_context():

    # Obtener un usuario existente (el primero)
    user = User.query.first()

    if not user:
        print("❌ No hay usuarios en la base de datos. Crea uno antes de ejecutar el seed.")
        exit()

    pois = [
        POI(
            user_id=user.id,
            name="Puerta del Sol",
            description="Centro de Madrid",
            lat=40.4168,
            lng=-3.7038
        ),
        POI(
            user_id=user.id,
            name="Plaza Mayor",
            description="Plaza histórica",
            lat=40.4155,
            lng=-3.7074
        ),
        POI(
            user_id=user.id,
            name="Templo de Debod",
            description="Templo egipcio",
            lat=40.4240,
            lng=-3.7179
        ),
    ]

    db.session.add_all(pois)
    db.session.commit()

    print("✅ POIs insertados correctamente.")
