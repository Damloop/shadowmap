# src/api/utils.py

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# ============================================================
#  EMAIL REAL CON SENDGRID
# ============================================================

def send_email(to, subject, html):
    """
    Envía un email real usando SendGrid.
    """
    api_key = os.getenv("SENDGRID_API_KEY")
    sender = os.getenv("SENDGRID_FROM_EMAIL")

    if not api_key or not sender:
        print("❌ ERROR: Falta SENDGRID_API_KEY o SENDGRID_FROM_EMAIL en .env")
        return False

    try:
        sg = SendGridAPIClient(api_key)

        message = Mail(
            from_email=sender,
            to_emails=to,
            subject=subject,
            html_content=html
        )

        response = sg.send(message)

        print("📨 Email enviado:", response.status_code)
        return True

    except Exception as e:
        print("❌ Error enviando email:", str(e))
        return False
