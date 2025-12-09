import { useState } from "react";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error de login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  // 🚨 BORRAR TOKEN ANTIGUO PARA EVITAR USO DE JWT CADUCADO

      localStorage.removeItem("token");

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
        const token_user =data.token;
        //localStorage.setItem("token", data.token);
        localStorage.setItem("token", token_user);
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
        style={{ marginBottom: "1rem" }}
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default Login;
