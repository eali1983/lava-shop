// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import "./styles/normalize.css";
import "./styles/theme.css";
import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
