import { useFleet } from "../context/FleetContext";
import "./TarjetaVehiculo.css";

// --- Iconos ---
const IconoFurgoneta = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.34a1 1 0 0 0-.2-.62l-1.4-1.4A1 1 0 0 0 19.34 11H13V6" /><circle cx="6.5" cy="18.5" r="2.5" /><circle cx="16.5" cy="18.5" r="2.5" /></svg>
);
const IconoCamion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M3 15h18" /><path d="M12 9v12" /><circle cx="7.5" cy="18.5" r="2.5" /><circle cx="16.5" cy="18.5" r="2.5" /></svg>
);
const IconoRemolque = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H12" /><path d="M2 12H12" /><path d="M17 17H7" /><path d="M12 12v5" /><path d="M12 12V7" /><circle cx="5" cy="17" r="2" /><circle cx="19" cy="17" r="2" /></svg>
);

const tiposVehiculo = {
  camion: { icono: <IconoCamion />, nombre: "Camión" },
  furgoneta: { icono: <IconoFurgoneta />, nombre: "Furgoneta" },
  remolque: { icono: <IconoRemolque />, nombre: "Remolque" },
};

function TarjetaVehiculo({ vehiculo, onEdit }) {
  // --- Lógica de Negocio ---
  const kmParaRevision = vehiculo.km_ultima_revision
    ? (vehiculo.km_ultima_revision + 10000) - vehiculo.kms
    : null;

  const alertaMantenimiento = kmParaRevision !== null && kmParaRevision < 1000;

  return (
    <div
      className={`tarjeta-vehiculo ${alertaMantenimiento ? "alerta-mantenimiento" : ""}`}
      onClick={() => onEdit(vehiculo)}
      style={{ cursor: 'pointer' }}
    >
      {/* Cabecera */}
      <div className="tarjeta-header">
        <span className="tipo-badge">
          <IconoCamion />
          Camión
        </span>
      </div>

      {/* Centro: Info Principal */}
      <div className="tarjeta-body">
        <h3 className="matricula">{vehiculo.matricula}</h3>
        <p className="modelo">{vehiculo.cv ? `${vehiculo.cv} CV` : "Sin potencia especificada"}</p>
      </div>

      {/* Alerta Mantenimiento */}
      {alertaMantenimiento && (
        <div className="mantenimiento-badge">
          ⚠️ Revisión en {kmParaRevision} km
        </div>
      )}

      {/* Info extra y Kilómetros */}
      <div className="tarjeta-footer">
        <div className="info-item">
          <span className="info-label">Kilometraje</span>
          <p className="info-value">{vehiculo.kms.toLocaleString()} km</p>
        </div>
        <div className="separator"></div>
        <div className="info-item">
          <span className="info-label">Consumo</span>
          <p className="info-value">
            {vehiculo.consumo_medio ? `${vehiculo.consumo_medio} L/100` : "-"}
          </p>
        </div>
      </div>

      {/* Info adicional */}
      <div className="tarjeta-extra">
        {vehiculo.notas && (
          <p className="notas-info">📝 {vehiculo.notas}</p>
        )}
      </div>
    </div>
  );
}

export default TarjetaVehiculo;
