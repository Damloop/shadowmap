import React from "react";
import ReactDOM from "react-dom/client";
import injectContext from "./front/js/store/appContext.jsx";
import Layout from "./front/layout.jsx";
import "./front/styles/index.css";

// Envolver Layout con el Context correctamente
const App = injectContext(Layout);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
