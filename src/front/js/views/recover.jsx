import React, { useState } from "react";
import "../../styles/recover.css";

const Recover = () => {
  const [email, setEmail] = useState("");

  const handleRecover = e => {
    e.preventDefault();
    console.log("Recovery request:", email);
  };

  return (
    <div className="recover-page">

      <h1 className="recover-title">Restore Access</h1>

      <form onSubmit={handleRecover}>
        <input
          type="email"
          className="recover-input"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="recover-btn">
          Send Request
        </button>
      </form>

      <div className="recover-return">
        <a href="/login">← Return to Login</a>
      </div>

    </div>
  );
};

export default Recover;
