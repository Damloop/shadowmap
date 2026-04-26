import React, { useState, useEffect } from "react";
import "../../styles/premium.css";

import PremiumLevel from "../component/PremiumLevel.jsx";

const PremiumPage = () => {
    const [isPremium, setIsPremium] = useState(
        sessionStorage.getItem("isPremium") === "true"
    );

    const activatePremium = () => {
        sessionStorage.setItem("isPremium", "true");
        sessionStorage.setItem("premiumLevel", "1");
        setIsPremium(true);
    };

    return (
        <div className="premium-wrapper">

            <div className="premium-header">
                <h1 className="premium-title">ShadowMap Premium</h1>
                <p className="premium-subtitle">
                    Herramientas avanzadas para usuarios que buscan más control,
                    más información y una experiencia optimizada.
                </p>
            </div>

            {!isPremium && (
                <button className="premium-button" onClick={activatePremium}>
                    Activar Premium
                </button>
            )}

            {isPremium && <PremiumLevel />}
        </div>
    );
};

export default PremiumPage;
