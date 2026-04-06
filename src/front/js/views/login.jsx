import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.jsx";
import "../../styles/login.css";

const Login = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await actions.login(email, password);
    if (!ok) setError("Credenciales incorrectas");
  };

  return (
    <div className="sm-page">
      <div className="sm-card">

        <h1 className="sm-title">ShadowMap</h1>
        <p className="sm-card-subtitle">Acceso restringido</p>

        {error && <div className="sm-error">{error}</div>}

        <form className="sm-form" onSubmit={handleLogin}>
          <div>
            <label className="sm-label">Email</label>
            <input
              type="email"
              className="sm-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="sm-label">Contraseña</label>
            <input
              type="password"
              className="sm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="sm-btn" type="submit">
            Entrar
          </button>
        </form>

        <div className="sm-faint-divider"></div>

        <a href="/register" className="sm-link-muted">
          Crear cuenta
        </a>
      </div>
    </div>
  );
};

export default Login;
