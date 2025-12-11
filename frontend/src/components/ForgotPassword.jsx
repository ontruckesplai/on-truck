import { useState } from "react";

function ForgotPassword({ onBack, onCodeSent }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Código no enviado");
        setMessageColor("red");
      } else {
        // ✅ Aquí ponemos el mensaje "Código enviado"
        setMessage("Código enviado");
        setMessageColor("green");

        onCodeSent(email); // para pasar el email a la siguiente pantalla
      }
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión");
      setMessageColor("red");
    }
  };

  return (
    <form onSubmit={handleSendCode}>
      <h3>Restablecer contraseña</h3>

      {message && <p style={{ color: messageColor, marginBottom: "1rem" }}>{message}</p>}

      <input
        type="email"
        placeholder="Tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: "1rem" }}
      />

      <button type="submit">Enviar código</button>

      <button 
        type="button" 
        className="auth-link" 
        onClick={onBack}
        style={{ marginTop: "10px" }}
      >
        Volver
      </button>
    </form>
  );
}

export default ForgotPassword;
