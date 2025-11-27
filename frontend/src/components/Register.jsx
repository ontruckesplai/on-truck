import { useState } from "react";

function Register({ setUser, setIsLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Mensaje de éxito/error
  const [messageColor, setMessageColor] = useState(""); // Color del mensaje

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registro incorrecto");
        setMessageColor("red");
      } else {
        setMessage("Registrado correctamente");
        setMessageColor("green");
        setEmail("");
        setPassword("");

        // Después de un segundo, cambiar al login
        setTimeout(() => {
          setMessage("");
          setIsLogin(true);
        }, 1000);
      }
    } catch (err) {
      setMessage("Error al conectar con el servidor");
      setMessageColor("red");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {message && <p style={{ color: messageColor, marginBottom: "1rem" }}>{message}</p>}
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
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
