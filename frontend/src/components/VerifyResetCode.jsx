import { useState } from "react";

function VerifyResetCode({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/reset/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError("Código incorrecto");
      return;
    }

    onVerified(code);
  };

  return (
    <form onSubmit={handleVerify}>
      <h3>Introduce el código</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Código de 6 dígitos"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button type="submit">Verificar</button>
    </form>
  );
}

export default VerifyResetCode;
