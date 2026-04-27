import React from "react";
import ReactDOM from "react-dom/client";
import StoreWrapper from "./store/appContext";
import Layout from "../layout.jsx";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <StoreWrapper>
    <Layout />
  </StoreWrapper>
);
