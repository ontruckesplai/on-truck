import { useState, useEffect } from "react";

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  const handleReject = () => {
    alert("Debes aceptar las cookies para continuar. Serás redirigido.");
    window.location.href = "https://www.google.com"; // o cualquier URL de salida
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#333",
      color: "#fff",
      padding: "1.5rem",
      textAlign: "center",
      zIndex: 1000,
      fontSize: "1.1rem"
    }}>
      <p>Esta página utiliza cookies para mejorar tu experiencia.</p>
      <button 
        onClick={handleAccept} 
        style={{ margin: "0 10px", padding: "0.5rem 1rem", backgroundColor: "green", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Aceptar
      </button>
      <button 
        onClick={handleReject} 
        style={{ margin: "0 10px", padding: "0.5rem 1rem", backgroundColor: "red", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Rechazar
      </button>
    </div>
  );
}

export default CookieBanner;
