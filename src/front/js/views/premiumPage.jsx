import React from "react";

const PremiumPage = () => {
    return (
        <div
            style={{
                padding: "40px",
                color: "white",
                textAlign: "center",
                minHeight: "100vh",
                background: "#030308"
            }}
        >
            <h1
                style={{
                    color: "#ffd700",
                    textShadow: "0 0 12px #ffd700",
                    letterSpacing: "3px",
                    marginBottom: "20px"
                }}
            >
                ZONA PREMIUM
            </h1>

            <p style={{ opacity: 0.8, fontSize: "18px" }}>
                Bienvenido a la sección exclusiva de ShadowMap.
            </p>

            <p style={{ opacity: 0.6 }}>
                Aquí aparecerán funciones avanzadas, misiones especiales y contenido oculto.
            </p>
        </div>
    );
};

export default PremiumPage;
