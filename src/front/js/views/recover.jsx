import React, { useState } from "react";

const Recover = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        alert("Si el correo existe, enviaremos instrucciones.");
    };

    return (
        <div>
            <h1>Recuperar contraseña</h1>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Recover;
