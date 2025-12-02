import { NavLink } from "react-router-dom";
import { useFleet } from "../context/FleetContext";
import "./Sidebar.css";
import logo from "../assets/logo_On-Truck_500x200-removebg-preview.png";

function Sidebar() {
    const { darkMode } = useFleet();

    return (
        <aside className={`sidebar ${darkMode ? "dark" : ""}`}>
            <div className="sidebar-header">
                <img src={logo} alt="OnTruck Logo" className="sidebar-logo" />
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                    Panel de Control
                </NavLink>
                <NavLink to="/vehiculos" className={({ isActive }) => (isActive ? "active" : "")}>
                    Vehículos
                </NavLink>
                <NavLink to="/contratos" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contratos
                </NavLink>
                <NavLink to="/rutas" className={({ isActive }) => (isActive ? "active" : "")}>
                    Rutas
                </NavLink>
                <NavLink to="/conductores" className={({ isActive }) => (isActive ? "active" : "")}>
                    Conductores
                </NavLink>
                <NavLink to="/configuracion" className={({ isActive }) => (isActive ? "active" : "")}>
                    Configuración
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
