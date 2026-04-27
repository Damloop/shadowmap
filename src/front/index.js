import React from "react";
import ReactDOM from "react-dom/client";
import injectContext from "./store/appContext.jsx";
import Layout from "../layout.jsx";

const App = injectContext(Layout);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
