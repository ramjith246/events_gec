import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import InternshipsPage from "./pages/internships";
import FestsPage from "./pages/fests"

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log("Service Worker registered: ", registration);
      },
      (error) => {
        console.log("Service Worker registration failed: ", error);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/fests" element={<FestsPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
