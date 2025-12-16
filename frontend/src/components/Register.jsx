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
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Paso 1: registrar usuario
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
        firstName: nombre,
        lastName: apellido
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
        setMessage("Usuario registrado. Revisa tu correo para el código de verificación");
        setMessageColor("green");
        setShowVerification(true);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setMessage("Error al conectar con el servidor");
      setMessageColor("red");
    }
  };

  // Paso 2: verificar código
  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = { email, code: verificationCode };
      const res = await fetch("http://localhost:8000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Verificación backend:", data);

      if (!res.ok) {
        setMessage(data.error || "Código incorrecto");
        setMessageColor("red");
      } else {
        setMessage(data.message || "Cuenta verificada correctamente");
        setMessageColor("green");

        // limpiar formulario
        setNombre("");
        setApellido("");
        setEmail("");
        setPassword("");
        setAccepted(false);
        setShowTerms(false);
        setVerificationCode("");
        setShowVerification(false);

        setTimeout(() => {
          setMessage("");
          setIsLogin(true); // redirigir a login
        }, 1000);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setMessage("Error al conectar con el servidor");
      setMessageColor("red");
    }
  };

  return (
    <form onSubmit={showVerification ? handleVerify : handleRegister}>
      {message && <p style={{ color: messageColor, marginBottom: "1rem" }}>{message}</p>}

      {!showVerification && (
        <>
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
            <div className="terms-box expanded">
              <p>
                Al registrarte en <strong>OnTruck Esplai</strong>, aceptas los presentes términos y condiciones.
                El servicio está destinado a la gestión y control de flotas de camiones.
              </p>

              <p>
                El usuario se compromete a proporcionar información veraz y a utilizar la plataforma
                de forma responsable y conforme a la ley.
              </p>

              <p>
                Los datos personales facilitados serán tratados de acuerdo con nuestra política de
                privacidad y utilizados únicamente para la prestación del servicio.
              </p>

              <p>
                OnTruck Esplai no se hace responsable de errores derivados de información incorrecta
                proporcionada por el usuario ni de interrupciones técnicas del servicio.
              </p>

              <p>
                La empresa se reserva el derecho de modificar estos términos cuando sea necesario.
                El uso continuado del servicio implica la aceptación de dichas modificaciones.
              </p>
            </div>
          )}


          <button type="submit">Registrarse</button>
        </>
      )}

      {showVerification && (
        <div className="verification-group">
          <input
            type="text"
            placeholder="Introduce el código de verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type="submit">Verificar cuenta</button>
        </div>
      )}
    </form>
  );
}

export default Register;
