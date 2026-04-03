// src/front/views/register.jsx
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        verify: ""
    });

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (form.password !== form.verify) {
            alert("Las claves no coinciden");
            return;
        }

        const ok = await actions.register(form.name, form.email, form.password);

        if (ok) navigate("/login");
        else alert("Error creando usuario");
    };

    return (
        <div className="register-container">

            {/* PANEL IZQUIERDO */}
            <div className="left-panel">
                <h1 className="shadow-title">ShadowMap</h1>

                <h2 className="section-title">NEW ENTITY ACQUISITION</h2>
                <p className="description">
                    Enter the Shadow Archive.<br />
                    Your presence here is an anomaly.
                    We require formal indexing to synchronize your spectral coordinates
                    with the central map.
                </p>

                <div className="system-info">
                    <p>SIGNAL STRENGTH: OPTIMAL</p>
                    <p>ENCRYPTION: END-TO-END SPECTRAL</p>
                    <p>© 2024 SHADOWMAP GLOBAL SURVEILLANCE.</p>
                </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="right-panel">
                <form className="register-box" onSubmit={handleSubmit}>
                    <label>NAME / ALIAS</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label>SECURE EMAIL</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>CIPHER KEY</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <label>VERIFY KEY</label>
                    <input
                        type="password"
                        name="verify"
                        value={form.verify}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="register-btn">
                        INITIATE ENTRY →
                    </button>

                    <p className="login-link">
                        ALREADY INDEXED?{" "}
                        <span onClick={() => navigate("/login")}>LOG IN</span>
                    </p>

                    <p className="terms">
                        BY INITIATING, YOU AGREE TO THE VEL PROTOCOLS AND ARCHIVAL TERMS.
                    </p>
                </form>
            </div>

        </div>
    );
};

export default Register;
