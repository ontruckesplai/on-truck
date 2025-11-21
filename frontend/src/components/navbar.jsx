import { useEffect, useRef, useState } from 'react'
import logoImage from '../assets/on-truck_logo_black.png'
import avatarImage from '../assets/navbar_login_icon.png'
import './Navbar.css'

const navItems = [
  { label: 'Vehículos', href: '#vehiculos' },
  { label: 'Rutas', href: '#rutas' },
  { label: 'Estadísticas', href: '#estadisticas' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDarkMode)
  }, [isDarkMode])

  const handleLogin = () => {
    setIsAuthenticated(true)
    console.log('Usuario autenticado (demo)')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    console.log('Sesión cerrada (demo)')
  }

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev)
  }

  const userMenuItems = [
    isAuthenticated
      ? { label: 'Logout', action: handleLogout }
      : { label: 'Login', action: handleLogin },
    { label: 'Registro', action: () => console.log('Ir a registro') },
    {
      label: isDarkMode ? 'Modo claro' : 'Modo oscuro',
      action: handleToggleTheme,
    },
  ]

  return (
    <header className="navbar">
      <a href="/" className="navbar__brand" aria-label="Volver al inicio">
        <img src={logoImage} alt="Logo On Truck" className="navbar__logo" />
      </a>

      <nav className="navbar__links">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className="navbar__link">
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
            {userMenuItems.map((menuItem) => (
              <button
                key={menuItem.label}
                type="button"
                className="navbar__dropdown-item"
                onClick={() => {
                  menuItem.action()
                  setIsMenuOpen(false)
                }}
              >
                {menuItem.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
