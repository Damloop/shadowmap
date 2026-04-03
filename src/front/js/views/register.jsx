import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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

        const success = await actions.register(form);

        if (success) {
            navigate("/login");
        } else {
            alert("Error al registrar usuario");
        }
    };

    return (
        <div>
            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Contraseña</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Crear cuenta</button>
            </form>
        </div>
    );
};

export default Register;
