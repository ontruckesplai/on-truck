import { Routes, Route, Navigate } from "react-router-dom";
import { FleetProvider } from "./context/FleetContext";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import VehiculosPage from "./pages/VehiculosPage";
import RutasPage from "./pages/RutasPage";
import ConductoresPage from "./pages/ConductoresPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import "./App.css";

function App() {
  return (
    <FleetProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
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
