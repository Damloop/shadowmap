// src/front/js/views/login.jsx
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const success = await actions.login(form.email, form.password);

        if (success) {
            navigate("/profile");
        } else {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="login-container">
            <h1 className="title">SHADOWMAP</h1>
            <p className="subtitle">VERIFIED PARANORMAL INTERFACE</p>

            <div className="login-box">
                <h2 className="auth-title">AUTHORIZATION REQUIRED</h2>

                <form onSubmit={handleSubmit}>
                    <label>CREDENTIAL EMAIL</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="operator@shadowmap"
                        className="login-input"
                        required
                    />

                    <label>SECRET PHRASE</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="login-input"
                        required
                    />

                    <button type="submit" className="login-btn">
                        EXECUTE LOGIN →
                    </button>
                </form>

                <button className="google-btn">
                    CONTINUE WITH GOOGLE
                </button>

                <a href="/register" className="login-link">
                    CREATE ACCOUNT
                </a>

                {/* ✔ AHORA FUNCIONA PERFECTAMENTE */}
                <a href="/recover" className="login-link">
                    RECOVER PASSWORD
                </a>
            </div>
        </div>
    );
};

export default Login;
