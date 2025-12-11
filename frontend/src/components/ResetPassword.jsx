import { useState } from "react";

function ResetPassword({ email, code, onFinished }) {
  const [password1, setP1] = useState("");
  const [password2, setP2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password1 !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/reset/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          password: password1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al actualizar contraseña");
      } else {
        setSuccess("Contraseña actualizada correctamente");
        setTimeout(() => {
          onFinished(); // regresar a login u otra acción
        }, 1500);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h3>Restablecer contraseña</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password1}
        onChange={(e) => setP1(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Repetir contraseña"
        value={password2}
        onChange={(e) => setP2(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Actualizando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}

export default ResetPassword;
