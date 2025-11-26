import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useFleet } from "../context/FleetContext";
import "./MainLayout.css";

function MainLayout() {
    const { darkMode, toggleTheme } = useFleet();
    const location = useLocation(); // Obtener la ubicación actual

    // Diccionario de títulos
    const titles = {
        "/": "Panel de Control",
        "/vehiculos": "Vehículos",
        "/rutas": "Rutas",
        "/conductores": "Conductores",
        "/configuracion": "Configuración"
    };

    // Si la ruta existe en el objeto, usa ese valor, si no, usa el defecto
    const currentTitle = titles[location.pathname] || "OnTruck App";

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content-wrapper">
                <header className="top-header">
                    <h1 className="page-title">{currentTitle}</h1>
                    <div className="header-actions">
                        <button onClick={toggleTheme} className="theme-toggle">
                            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                        </button>
                        <div className="user-profile">
                            <span>Admin</span>
                        </div>
                    </div>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
