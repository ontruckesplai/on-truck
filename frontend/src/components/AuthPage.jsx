import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import "./AuthPage.css";

import logo from "../assets/on-truck_logo_black.png";
import videoCamion from "../assets/video-camion.mp4";

function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      {/* VIDEO DE FONDO */}
      <video autoPlay muted loop className="auth-video">
        <source src={videoCamion} type="video/mp4" />
      </video>

      {/* CAJA DE LOGIN/REGISTER */}
      <div className="auth-box">
        {/* LOGO */}
        <div className="auth-header">
          <img src={logo} alt="On Truck Logo" className="auth-logo" />
        </div>

        {/* FORMULARIOS */}
        <div className="auth-form">
          {isLogin ? <Login setUser={setUser} /> : <Register setUser={setUser} />}
        </div>

        {/* TEXTO INFERIOR */}
        <div className="auth-footer">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setIsLogin(false)} className="auth-link">
                Regístrate
              </button>
            </p>
          ) : (
            <p>
              ¿Tienes cuenta?{" "}
              <button onClick={() => setIsLogin(true)} className="auth-link">
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
