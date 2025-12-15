import { useState } from "react";
import './AuthPage.css';

function Login({ setUser, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error de login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Correo o contraseña incorrecto");
      } else {
        localStorage.setItem("token", data.token);
        setUser({ email });
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: "0.8rem" }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: "0.5rem" }}
      />

      <button type="submit">Iniciar sesión</button>

      {/* Botón “Olvidé mi contraseña” */}
      <button 
        type="button" 
        onClick={onForgot} 
        style={{ 
          marginTop: "0.8rem", 
          background: "none", 
          color: "#1e90ff", 
          border: "none", 
          cursor: "pointer",
          textDecoration: "underline"
        }}
      >
        Olvidé mi contraseña
      </button>
    </form>
  );
}

export default Login;
