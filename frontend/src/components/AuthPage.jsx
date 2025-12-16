import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
// Asegúrate de tener estos archivos o comenta estas líneas si aún no los has creado:
import VerifyResetCode from "./VerifyResetCode.jsx";
import ResetPassword from "./ResetPassword.jsx";

import "./AuthPage.css";

// Importación correcta de assets (del código que te funcionaba)
import logo from "../assets/logo_On-Truck_500x200-removebg-preview.png";
import videoCamion from "../assets/video-camion.mp4";

function AuthPage({ setUser }) {
  // Usamos 'currentForm' para manejar todas las vistas en una sola variable
  // Valores posibles: "login", "register", "forgot", "verify-reset", "reset-password"
  const [currentForm, setCurrentForm] = useState("login");

  // Estados para el flujo de recuperación de contraseña
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  return (
    <div className="auth-container">
      {/* VIDEO DE FONDO */}
      <video autoPlay muted loop className="auth-video">
        <source src={videoCamion} type="video/mp4" />
      </video>

      {/* CAJA PRINCIPAL */}
      <div className="auth-box">

        {/* LOGO */}
        <div className="auth-header">
          <img src={logo} alt="On Truck Logo" className="auth-logo" />
        </div>

        {/* ZONA DE FORMULARIOS DINÁMICOS */}
        <div className="auth-form">

          {/* 1. LOGIN */}
          {currentForm === "login" && (
            <Login
              setUser={setUser}
              onForgot={() => setCurrentForm("forgot")} // Pasamos la función para cambiar a forgot
            />
          )}

          {/* 2. REGISTRO */}
          {currentForm === "register" && (
            <Register
              onRegistered={() => setCurrentForm("login")}
            />
          )}

          {/* 3. OLVIDÉ CONTRASEÑA (Pide Email) */}
          {currentForm === "forgot" && (
            <ForgotPassword
              onBack={() => setCurrentForm("login")}
              onCodeSent={(email) => {
                setResetEmail(email);
                setCurrentForm("verify-reset");
              }}
            />
          )}

          {/* 4. VERIFICAR CÓDIGO */}
          {currentForm === "verify-reset" && (
            <VerifyResetCode
              email={resetEmail}
              onVerified={(code) => {
                setResetCode(code);
                setCurrentForm("reset-password");
              }}
            />
          )}

          {/* 5. NUEVA CONTRASEÑA */}
          {currentForm === "reset-password" && (
            <ResetPassword
              email={resetEmail}
              code={resetCode}
              onFinished={() => setCurrentForm("login")}
            />
          )}
        </div>

        {/* BOTÓN EXTRA: OLVIDÉ CONTRASEÑA EN LOGIN */}
        {/* Solo se muestra si estamos en login y si el componente Login no tiene ya este botón dentro */}


        {/* FOOTER: CAMBIAR ENTRE LOGIN Y REGISTRO */}
        <div className="auth-footer">
          {currentForm === "login" && (
            <p>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setCurrentForm("register")} className="auth-link">
                Regístrate
              </button>
            </p>
          )}

          {currentForm === "register" && (
            <p>
              ¿Tienes cuenta?{" "}
              <button onClick={() => setCurrentForm("login")} className="auth-link">
                Inicia sesión
              </button>
            </p>
          )}

          {/* Botón de volver para los procesos de recuperación */}
          {(currentForm === "forgot" || currentForm === "verify-reset" || currentForm === "reset-password") && (
            <p>
              <button onClick={() => setCurrentForm("login")} className="auth-link">
                Volver al login
              </button>
            </p>
          )}
        </div>

        {/* FOOTER INFERIOR CON LINKS LEGALES */}
        <div className="auth-bottom-footer">
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">Privacidad</a>
          <span>•</span>
          <a href="/seguridad" target="_blank" rel="noopener noreferrer">Seguridad</a>
          <span>•</span>
          <a href="/contacto" target="_blank" rel="noopener noreferrer">Contacto</a>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;