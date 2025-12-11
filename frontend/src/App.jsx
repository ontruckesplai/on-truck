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

function App() {
  const [user, setUser] = useState(null);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
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
    window.location.href = "about:blank"; // redirigir o cerrar
  };

  if (!user) {
    return (
      <>
        <AuthPage setUser={setUser} />

        {showCookies && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                color: "#333",
                borderRadius: "15px",
                padding: "40px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <h2 style={{ color: "#007bff", marginBottom: "20px" }}>🍪 Usamos cookies</h2>
              <p style={{ marginBottom: "30px" }}>
                Esta web utiliza cookies para mejorar tu experiencia. Debes aceptarlas para continuar.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                <button
                  onClick={handleAcceptCookies}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    padding: "10px 25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = 0.8)}
                  onMouseOut={(e) => (e.target.style.opacity = 1)}
                >
                  Aceptar
                </button>
                <button
                  onClick={handleRejectCookies}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    border: "none",
                    borderRadius: "25px",
                    padding: "10px 25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = 0.8)}
                  onMouseOut={(e) => (e.target.style.opacity = 1)}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

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
