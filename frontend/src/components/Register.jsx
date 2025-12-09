import { useState } from "react";

function Register({ setUser, setIsLogin }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!accepted) {
      setMessage("Debes aceptar los términos y condiciones");
      setMessageColor("red");
      return;
    }

    try {
      const payload = {
        email,
        password,
        firstName: nombre,   // <-- clave exacta que espera tu backend
        lastName: apellido   // <-- clave exacta que espera tu backend
      };

      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (!res.ok) {
        setMessage(data.error || "Registro incorrecto");
        setMessageColor("red");
      } else {
        setMessage("Registrado correctamente");
        setMessageColor("green");
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
        setAccepted(false);
        setShowTerms(false);

        setTimeout(() => {
          setMessage("");
          setIsLogin(true);
        }, 1000);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setMessage("Error al conectar con el servidor");
      setMessageColor("red");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {message && <p style={{ color: messageColor, marginBottom: "1rem" }}>{message}</p>}

      <div className="form-group">
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>

      <div className="form-group">
        <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
      </div>

      <div className="form-group">
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="form-group">
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="terms-row">
        <label className="terms-label">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>
            Acepto los{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer">
              términos y condiciones
            </a>
          </span>
        </label>

        <button type="button" className="toggle-terms" onClick={() => setShowTerms(!showTerms)}>
          <span>{showTerms ? "▲" : "▼"}</span>
        </button>
      </div>

      {!accepted && messageColor === "red" && (
        <p className="terms-error">Debes aceptar los términos para continuar</p>
      )}

      {showTerms && (
        <div className="terms-box">
          <p>
            Aquí van los términos y condiciones del servicio. Puedes incluir cualquier texto legal, cláusulas de uso,
            protección de datos, etc.
          </p>
        </div>
      )}

      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;
