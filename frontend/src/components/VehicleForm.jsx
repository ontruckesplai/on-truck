import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import "./VehicleForm.css";

function VehicleForm({ onClose }) {
  const { addVehicle, conductores } = useFleet();
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    tipo: "camion",
    matricula: "",
    modelo: "",
    kilometros: "",
    proxima_revision: "",
    potencia: "",
    capacidad_carga: "",
    estado: "Disponible",
    conductor_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoVehiculo({ ...nuevoVehiculo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoVehiculo.matricula || !nuevoVehiculo.modelo) return;

    // Convertir a números
    const vehiculoData = {
      ...nuevoVehiculo,
      kilometros: Number(nuevoVehiculo.kilometros),
      proxima_revision: Number(nuevoVehiculo.proxima_revision),
      conductor_id: nuevoVehiculo.conductor_id ? Number(nuevoVehiculo.conductor_id) : null,
    };

    addVehicle(vehiculoData);
    onClose();
  };

  return (
    <div className="vehicle-drawer-overlay" onClick={onClose}>
      <div className="vehicle-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Nuevo Vehículo</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="vehicle-form">
          {/* Selector de tipo */}
          <div className="form-group">
            <label>Tipo de Vehículo</label>
            <select
              name="tipo"
              value={nuevoVehiculo.tipo}
              onChange={handleInputChange}
            >
              <option value="camion">Camión</option>
              <option value="furgoneta">Furgoneta</option>
              <option value="remolque">Remolque</option>
            </select>
          </div>

          {/* Campos comunes */}
          <div className="form-group">
            <label>Matrícula</label>
            <input
              name="matricula"
              type="text"
              value={nuevoVehiculo.matricula}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input
              name="modelo"
              type="text"
              value={nuevoVehiculo.modelo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kilometraje Actual</label>
              <input
                name="kilometros"
                type="number"
                value={nuevoVehiculo.kilometros}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Próxima Revisión (km)</label>
              <input
                name="proxima_revision"
                type="number"
                value={nuevoVehiculo.proxima_revision}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Asignación de Conductor */}
          {nuevoVehiculo.tipo !== "remolque" && (
            <div className="form-group">
              <label>Conductor Asignado</label>
              <select
                name="conductor_id"
                value={nuevoVehiculo.conductor_id}
                onChange={handleInputChange}
              >
                <option value="">-- Sin asignar --</option>
                {conductores.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    disabled={!c.carnet_valido || (c.estado === "Ocupado" && c.id !== nuevoVehiculo.conductor_id)}
                  >
                    {c.nombre} {c.estado === "Ocupado" ? "(Ocupado)" : ""} {!c.carnet_valido ? "(Carnet Caducado)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campos condicionales */}
          {(nuevoVehiculo.tipo === "camion" ||
            nuevoVehiculo.tipo === "furgoneta") && (
              <div className="form-group">
                <label>Potencia</label>
                <input
                  name="potencia"
                  type="text"
                  placeholder="ej: 450cv"
                  value={nuevoVehiculo.potencia}
                  onChange={handleInputChange}
                />
              </div>
            )}

          {nuevoVehiculo.tipo === "remolque" && (
            <div className="form-group">
              <label>Capacidad de Carga</label>
              <input
                name="capacidad_carga"
                type="text"
                placeholder="ej: 24t"
                value={nuevoVehiculo.capacidad_carga}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Botones */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Guardar Vehículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
