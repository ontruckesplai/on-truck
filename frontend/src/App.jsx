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

  // Comprobar token al iniciar
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
  }, []);

  if (!user) {
    // Si no hay usuario logueado, mostrar login/register
    return <AuthPage setUser={setUser} />;
  }

  // Usuario logueado, mostrar app principal
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
