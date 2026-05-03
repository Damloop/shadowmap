# src/api/extensions.py

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


class Mailer:
    def init_app(self, app):
        print("📨 SendGrid habilitado. Emails reales activos.")

    def send(self, message):
        """
        message = {
            "to": "email",
            "subject": "texto",
            "html": "<p>contenido</p>"
        }
        """
        api_key = os.getenv("SENDGRID_API_KEY")
        sender = os.getenv("SENDGRID_FROM_EMAIL")

        if not api_key or not sender:
            print("❌ ERROR: Falta SENDGRID_API_KEY o SENDGRID_FROM_EMAIL en .env")
            return False

        try:
            sg = SendGridAPIClient(api_key)

            email = Mail(
                from_email=sender,
                to_emails=message["to"],
                subject=message["subject"],
                html_content=message["html"]
            )

            response = sg.send(email)
            print("📨 Email enviado:", response.status_code)
            return True

        except Exception as e:
            print("❌ Error enviando email:", str(e))
            return False


mail = Mailer()