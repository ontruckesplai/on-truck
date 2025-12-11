import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FleetProvider } from "./context/FleetContext";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import VehiculosPage from "./pages/VehiculosPage";
import RutasPage from "./pages/RutasPage";
import ConductoresPage from "./pages/ConductoresPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import ContractsPage from "./pages/ContractsPage";
import AuthPage from "./components/AuthPage.jsx";
import "./App.css";
import "./components/CookieBanner.css";
 // Importar estilos del banner

function App() {
  const [user, setUser] = useState(null);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    // Comprobar token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
      }
    }

    // Comprobar cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowCookies(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookies(false);
  };

  const handleRejectCookies = () => {
    alert("No puedes continuar sin aceptar las cookies");
    window.location.href = "about:blank";
  };

  if (!user) {
    // Login / Register + Banner de cookies
    return (
      <>
        <AuthPage setUser={setUser} />

        {showCookies && (
          <div className="cookie-overlay">
            <div className="cookie-box">
              <h2>🍪 Usamos cookies</h2>
              <p>
                Esta web utiliza cookies para mejorar tu experiencia. Debes aceptarlas para continuar.
              </p>
              <div className="cookie-buttons">
                <button className="accept-btn" onClick={handleAcceptCookies}>
                  Aceptar
                </button>
                <button className="reject-btn" onClick={handleRejectCookies}>
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Usuario logueado -> app principal
  return (
    <FleetProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
          <Route path="contratos" element={<ContractsPage />} />
          <Route path="rutas" element={<RutasPage />} />
          <Route path="conductores" element={<ConductoresPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </FleetProvider>
  );
}

export default App;
