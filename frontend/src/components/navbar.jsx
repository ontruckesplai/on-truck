import { useEffect, useRef, useState } from "react";
import logoImage from "../assets/on-truck_logo_black.png";
import avatarImage from "../assets/navbar_login_icon.png";
import "./Navbar.css";

const navItems = [
  { label: "Vehículos", href: "#vehiculos" },
  { label: "Rutas", href: "#rutas" },
  { label: "Estadísticas", href: "#estadisticas" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

    return document.body.classList.contains("theme-dark");
  });
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.classList.toggle("theme-dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <header className="navbar">
      <a
        href="/"
        className="navbar__brand"
        aria-label="Volver al inicio"
        onClick={() => setActivePath(null)}
      >
        <img src={logoImage} alt="Logo On Truck" className="navbar__logo" />
      </a>

      <nav className="navbar__links">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`navbar__link ${
              activePath === item.href ? "navbar__link--active" : ""
            }`}
            onClick={() => setActivePath(item.href)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="navbar__user" ref={menuRef}>
        <button
          type="button"
          className="navbar__avatar-button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          <img src={avatarImage} alt="Perfil" className="navbar__avatar" />
        </button>

        {isMenuOpen && (
          <div className="navbar__dropdown" role="menu">
            {[
              { label: "Login", action: () => console.log("Ir a login") },
              { label: "Registro", action: () => console.log("Ir a registro") },
              {
                label: isDarkMode ? "Modo claro" : "Modo oscuro",
                action: () => setIsDarkMode((prev) => !prev),
              },
            ].map((menuItem) => (
              <button
                key={menuItem.label}
                type="button"
                className="navbar__dropdown-item"
                onClick={() => {
                  menuItem.action();
                  setIsMenuOpen(false);
                }}
              >
                {menuItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
