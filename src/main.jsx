import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./front/layout.jsx";
import StoreWrapper from "./front/js/store/appContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./front/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreWrapper>
        <Layout />
      </StoreWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
