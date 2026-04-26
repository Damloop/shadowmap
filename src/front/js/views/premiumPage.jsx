import React, { useState, useEffect } from "react";
import "../../styles/premium.css";

import PremiumModal from "../component/PremiumModal.jsx";
import PremiumDashboard from "../component/PremiumDashboard.jsx";
import PremiumComparison from "../component/PremiumComparison.jsx";
import PremiumLevel from "../component/PremiumLevel.jsx";

const PremiumPage = () => {
    const [isPremium, setIsPremium] = useState(
        sessionStorage.getItem("isPremium") === "true"
    );

    const [level, setLevel] = useState(
        parseInt(sessionStorage.getItem("premiumLevel") || "1")
    );

    const [showModal, setShowModal] = useState(false);

    // Actualiza el nivel cada vez que se recarga la página
    useEffect(() => {
        const storedLevel = parseInt(sessionStorage.getItem("premiumLevel") || "1");
        setLevel(storedLevel);
    }, [isPremium]);

    const activatePremium = () => {
        setShowModal(true);
    };

    const confirmPremium = () => {
        sessionStorage.setItem("isPremium", "true");
        setIsPremium(true);
        setShowModal(false);
    };

    return (
        <div className="premium-wrapper">

            {/* CABECERA */}
            <div className="premium-header">
                <h1 className="premium-title">ShadowMap Premium</h1>
                <p className="premium-subtitle">
                    Herramientas avanzadas para usuarios que buscan más control,
                    más información y una experiencia optimizada.
                </p>
            </div>

            {/* SI NO ES PREMIUM → COMPARADOR + BOTÓN */}
            {!isPremium && (
                <>
                    <PremiumComparison />

                    <button className="premium-button" onClick={activatePremium}>
                        Activar Premium
                    </button>
                </>
            )}

            {/* SI ES PREMIUM → DASHBOARD + NIVELES */}
            {isPremium && (
                <>
                    <PremiumDashboard level={level} />
                    <PremiumLevel />
                </>
            )}

            {/* MODAL */}
            {showModal && (
                <PremiumModal
                    onConfirm={confirmPremium}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default PremiumPage;
