import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import "./VehicleForm.css";

function VehicleForm({ onClose, initialData = null }) {
  const { addVehicle, updateVehicle, deleteVehicle } = useFleet();

  const [formData, setFormData] = useState(initialData || {
    matricula: "",
    tipo: "camion",
    modelo: "",
    kms: "",
    km_ultima_revision: "",
    cv: "",
    consumo_medio: "",
    fecha_itv: "",
    notas: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.matricula) return;

    // Convertir a números donde sea necesario
    const vehiculoData = {
      ...formData,
      kms: Number(formData.kms),
      km_ultima_revision: formData.km_ultima_revision ? Number(formData.km_ultima_revision) : null,
      cv: formData.cv ? Number(formData.cv) : null,
      consumo_medio: formData.consumo_medio ? Number(formData.consumo_medio) : null,
    };

    if (initialData) {
      updateVehicle(initialData.id, vehiculoData);
    } else {
      addVehicle(vehiculoData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${initialData.matricula}?`)) {
      deleteVehicle(initialData.id);
      onClose();
    }
  };

  return (
    <div className="vehicle-drawer-overlay" onClick={onClose}>
      <div className="vehicle-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>{initialData ? "Editar Vehículo" : "Nuevo Vehículo"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>



        <form onSubmit={handleSubmit} className="vehicle-form">

          <div className="form-group">
            <label>Tipo de Vehículo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
            >
              <option value="camion">Camión</option>
              <option value="furgoneta" disabled>Furgoneta (Próximamente)</option>
              <option value="remolque" disabled>Remolque (Próximamente)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Modelo</label>
              <input
                name="modelo"
                type="text"
                value={formData.modelo}
                onChange={handleInputChange}
                placeholder="Ej: Volvo FH 500"
              />
            </div>
            <div className="form-group">
              <label>Matrícula *</label>
              <input
                name="matricula"
                type="text"
                value={formData.matricula}
                onChange={handleInputChange}
                required
                placeholder="0000-XXX"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kilómetros</label>
              <input
                name="kms"
                type="number"
                value={formData.kms}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Última Revisión (km)</label>
              <input
                name="km_ultima_revision"
                type="number"
                value={formData.km_ultima_revision}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Potencia (CV)</label>
              <input
                name="cv"
                type="number"
                value={formData.cv}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Consumo Medio (L/100km)</label>
              <input
                name="consumo_medio"
                type="number"
                step="0.1"
                value={formData.consumo_medio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fecha ITV</label>
            <input
              name="fecha_itv"
              type="date"
              value={formData.fecha_itv}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              name="notas"
              rows="3"
              value={formData.notas}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-actions">
            {initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="btn-delete-form"
              >
                Eliminar
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-cancel">
              Atrás
            </button>
            <button type="submit" className="btn-save">
              {initialData ? "Guardar Cambios" : "Crear Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;
