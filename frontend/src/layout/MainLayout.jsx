import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useFleet } from "../context/FleetContext";
import "./MainLayout.css";



import ThemeToggle from "../components/ThemeToggle";

function MainLayout() {
    const { darkMode, toggleTheme } = useFleet();
    const location = useLocation(); // Obtener la ubicación actual
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Diccionario de títulos
    const titles = {
        "/": "Panel de Control",
        "/vehiculos": "Vehículos",
        "/rutas": "Rutas",
        "/conductores": "Conductores",
        "/configuracion": "Configuración",
        "/contratos": "Contratos",
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
                        <ThemeToggle />
                        <div
                            className="user-profile"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>Admin</span>
                            {isDropdownOpen && (
                                <div className="user-dropdown">
                                    <button onClick={() => {
                                        localStorage.removeItem('token');
                                        window.location.reload();
                                    }}>
                                        Log out
                                    </button>
                                </div>
                            )}
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
