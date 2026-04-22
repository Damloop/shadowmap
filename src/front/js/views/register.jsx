// src/front/js/views/register.jsx

import React, { useState } from "react";
import { API_URL } from "../../api/config";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    avatar: ""
  });

  const [created, setCreated] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (resp.ok) {
        setCreated(true);
      } else {
        const error = await resp.json().catch(() => null);
        console.error("Error en register:", error);
      }
    } catch (error) {
      console.error("Error en register:", error);
    }
  };

  return (
    <div className="register-container">
      <h1>Crear cuenta</h1>

      {created ? (
        <div className="alert alert-success">
          Cuenta creada. Revisa tu correo.
        </div>
      ) : (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Nombre"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="avatar"
            placeholder="Avatar (opcional)"
            value={form.avatar}
            onChange={handleChange}
          />

          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
  );
};

export default Register;
