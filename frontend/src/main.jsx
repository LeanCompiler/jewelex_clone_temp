import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { GlobalDataProvider } from "./context/GlobalDataProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GlobalDataProvider>
    <Router>
      <App />
    </Router>
  </GlobalDataProvider>
);
