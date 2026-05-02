# run.py

import os
from dotenv import load_dotenv

load_dotenv()

os.environ["FLASK_APP"] = "src/api/app.py"

from src.api.app import create_app

app = create_app()

if __name__ == "__main__":
    print("📨 SendGrid habilitado. Emails reales activos.")
    app.run(host="0.0.0.0", port=3001, debug=True)
