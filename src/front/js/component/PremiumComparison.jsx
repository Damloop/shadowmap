import React from "react";
import "../../styles/premium.css";

const PremiumModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="premium-modal-overlay">
            <div className="premium-modal">

                <h2 style={{ color: "#ffd700", marginBottom: "10px" }}>
                    Activar ShadowMap Premium
                </h2>

                <p style={{ opacity: 0.8, marginBottom: "20px" }}>
                    Al activar Premium obtendrás acceso a funciones avanzadas,
                    mejoras progresivas y un sistema de niveles único.
                    <br />
                    <br />
                    <strong>No se realizará ningún cobro real.</strong>
                </p>

                <div className="premium-modal-buttons">
                    <button className="modal-confirm" onClick={onConfirm}>
                        Activar Premium
                    </button>

                    <button className="modal-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PremiumModal;
