# src/api/extensions.py

# Sistema de email desactivado (dummy)
class DummyMail:
    def init_app(self, app):
        print("⚠️ Email desactivado (modo dummy). No se enviarán correos reales.")

    def send(self, message):
        print("=== EMAIL SIMULADO ===")
        print(f"Para: {message.get('to')}")
        print(f"Asunto: {message.get('subject')}")
        print(f"Cuerpo:\n{message.get('body')}")
        print("======================")

mail = DummyMail()
