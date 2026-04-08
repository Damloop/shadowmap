import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import StoreWrapper from "./js/store/appContext";
import Layout from "./layout.jsx";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <StoreWrapper>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StoreWrapper>,
);
