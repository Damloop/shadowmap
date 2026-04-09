# run.py

from src.api.app import create_app
from src.api.models import db

app = create_app()

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
