// src/front/views/login.jsx
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
                <h2 className="auth-title">Authorization Required</h2>
                {/* <p className="clearance">LEVEL 4 CLEARANCE NECESSARY</p> */}

                <form onSubmit={handleSubmit}>
                    <label>CREDENTIAL EMAIL</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="operator@veiled-archive.org"
                        required
                    />

                    <label>SECRET PHRASE</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••••"
                        required
                    />

                    <button type="submit" className="login-btn">
                        EXECUTE LOGIN →
                    </button>
                </form>

                <button className="google-btn">
                    CONTINUE WITH GOOGLE
                </button>

                <div className="links">
                    <span onClick={() => navigate("/register")}>CREATE ACCOUNT</span>
                    <span>RECOVER PASSWORD</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
