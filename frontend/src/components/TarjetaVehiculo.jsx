import { useFleet } from "../context/FleetContext";
import "./TarjetaVehiculo.css";

// // --- Iconos ---
// const IconoFurgoneta = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.34a1 1 0 0 0-.2-.62l-1.4-1.4A1 1 0 0 0 19.34 11H13V6" /><circle cx="6.5" cy="18.5" r="2.5" /><circle cx="16.5" cy="18.5" r="2.5" /></svg>
// );
// // const IconoCamion = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M3 15h18" /><path d="M12 9v12" /><circle cx="7.5" cy="18.5" r="2.5" /><circle cx="16.5" cy="18.5" r="2.5" /></svg>
// // );
// const IconoRemolque = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H12" /><path d="M2 12H12" /><path d="M17 17H7" /><path d="M12 12v5" /><path d="M12 12V7" /><circle cx="5" cy="17" r="2" /><circle cx="19" cy="17" r="2" /></svg>
// );

const IconoFurgoneta = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cuerpo de la furgoneta */}
    <rect x="2" y="7" width="20" height="11" rx="2" ry="2" />
    {/* Cabina/Ventana */}
    <path d="M14 7v5h8" />
    <path d="M17 7v5" />
    {/* Ruedas */}
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const IconoCamion = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cabina del camión */}
    <rect x="16" y="5" width="6" height="13" rx="1" />
    {/* Caja de carga grande */}
    <rect x="2" y="5" width="12" height="13" rx="1" />
    {/* Conexión y detalles */}
    <path d="M14 14h2" />
    {/* Ruedas (más separadas para dar sensación de largo) */}
    <circle cx="5.5" cy="18" r="2" />
    <circle cx="18.5" cy="18" r="2" />
  </svg>
);

const IconoRemolque = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* La Caja del remolque */}
    <rect x="8" y="5" width="14" height="13" rx="1" />
    {/* El enganche frontal */}
    <path d="M8 15H3v2" />
    <path d="M5 15v-2" />
    {/* Ruedas (situadas atrás, típico de remolques) */}
    <circle cx="15" cy="18" r="2" />
    <circle cx="19" cy="18" r="2" />
  </svg>
);

const tiposVehiculo = {
  camion: { icono: <IconoCamion />, nombre: "Camión" },
  furgoneta: { icono: <IconoFurgoneta />, nombre: "Furgoneta" },
  remolque: { icono: <IconoRemolque />, nombre: "Remolque" },
};

function TarjetaVehiculo({ vehiculo, onEdit }) {
  // --- Lógica de Negocio ---
  const kms = vehiculo.kms || 0;
  const kmUltimaRevision = vehiculo.km_ultima_revision;

  const kmParaRevision = (kmUltimaRevision !== undefined && kmUltimaRevision !== null)
    ? (kmUltimaRevision + 40000) - kms
    : null;

  // --- Lógica de Alerta Mantenimiento ---
  let claseAlertaMantenimiento = "";
  if (kmParaRevision !== null) {
    if (kmParaRevision <= 10000) {
      claseAlertaMantenimiento = "alerta-roja";
    } else if (kmParaRevision <= 20000) {
      claseAlertaMantenimiento = "alerta-naranja";
    }
  }

  // --- Lógica de Alerta ITV ---
  let claseAlertaITV = "";
  let diasParaITV = null;

  if (vehiculo.fecha_itv) {
    const hoy = new Date();
    const fechaUltimaITV = new Date(vehiculo.fecha_itv);

    // La ITV caduca 1 año después de la última fecha
    const fechaCaducidadITV = new Date(fechaUltimaITV);
    fechaCaducidadITV.setFullYear(fechaCaducidadITV.getFullYear() + 1);

    const diferenciaTiempo = fechaCaducidadITV - hoy;
    diasParaITV = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (diasParaITV <= 30) {
      claseAlertaITV = "alerta-roja";
    } else if (diasParaITV <= 60) {
      claseAlertaITV = "alerta-naranja";
    }
  }

  // Determinar la clase de borde final (la roja tiene prioridad)
  let claseBorde = "";
  if (claseAlertaMantenimiento === "alerta-roja" || claseAlertaITV === "alerta-roja") {
    claseBorde = "borde-rojo";
  } else if (claseAlertaMantenimiento === "alerta-naranja" || claseAlertaITV === "alerta-naranja") {
    claseBorde = "borde-naranja";
  }

  // --- Lógica de Estado ---
  // Por ahora siempre "Disponible" si no hay lógica de taller/ruta
  const estado = "Disponible";
  const claseEstado = "estado-disponible";

  return (
    <div
      className={`tarjeta-vehiculo ${claseBorde}`}
      onClick={() => onEdit(vehiculo)}
    >
      {/* Cabecera: Icono + Tipo + Estado */}
      <div className="tarjeta-header">
        <div className="tipo-info">
          <span className="icono-vehiculo">{tiposVehiculo[vehiculo.tipo || 'camion']?.icono || <IconoCamion />}</span>
          <span className="tipo-texto">{tiposVehiculo[vehiculo.tipo || 'camion']?.nombre || "Vehículo"}</span>
        </div>
        <span className={`estado-badge ${claseEstado}`}>{estado}</span>
      </div>

      {/* Cuerpo: Matrícula + Modelo */}
      <div className="tarjeta-body">
        <h3 className="matricula">{vehiculo.matricula}</h3>
        <p className="modelo">{vehiculo.modelo || "Modelo no especificado"}</p>
      </div>

      {/* Sección de Alertas */}
      <div className="alertas-container">
        {claseAlertaMantenimiento && (
          <div className={`alerta-badge ${claseAlertaMantenimiento}`}>
            <span className="alerta-icono"></span>
            <span>Revisión en <strong>{kmParaRevision.toLocaleString()} km</strong></span>
          </div>
        )}
        {claseAlertaITV && (
          <div className={`alerta-badge ${claseAlertaITV}`}>
            <span className="alerta-icono"></span>
            <span>ITV en <strong>{diasParaITV} días</strong></span>
          </div>
        )}
      </div>

      {/* Footer: Grid de Información (Simplificado) */}
      <div className="tarjeta-footer-grid">
        <div className="dato-item">
          <span className="dato-label">Kilómetros</span>
          <span className="dato-valor">{vehiculo.kms ? vehiculo.kms.toLocaleString() : "0"}</span>
        </div>
        <div className="dato-item">
          <span className="dato-label">Consumo</span>
          <span className="dato-valor">{vehiculo.consumo_medio ? `${vehiculo.consumo_medio} L` : "-"}</span>
        </div>
      </div>

      {/* Notas (Máximo 2 líneas) */}
      {vehiculo.notas && (
        <div className="notas-preview">
          <span className="notas-label">Notas:</span> {vehiculo.notas}
        </div>
      )}
    </div>
  );
}

export default TarjetaVehiculo;
