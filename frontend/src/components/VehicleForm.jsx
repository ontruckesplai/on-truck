import { useState, useEffect } from "react";
import { useFleet } from "../context/FleetContext";
import ConfirmModal from "./ConfirmModal";
import "./VehicleForm.css";

function VehicleForm({ onClose, initialData = null }) {
  const {
    vehiculos,
    remolques,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addRemolque,
    updateRemolque,
    deleteRemolque,
    linkRemolque,
    unlinkRemolque
  } = useFleet();

  const [formData, setFormData] = useState(initialData || {
    matricula: "",
    tipo: "camion",
    modelo: "",
    kms: "",
    km_ultima_revision: "",
    cv: "",
    consumo_medio: "",
    fecha_itv: "",
    notas: "",
    capacidad: "", // Para remolques
    tipo_remolque: "", // Para remolques (string manual)
    remolque_id: "", // Para vincular remolque a camión
    camion_id: "" // Para vincular camión a remolque (bidireccional)
  });

  // Si estamos editando un camión, inicializar remolque_id
  // Inicializar datos al editar
  useEffect(() => {
    if (initialData) {
      if (initialData.tipo === 'camion' && initialData.remolque_id) {
        setFormData(prev => ({ ...prev, remolque_id: initialData.remolque_id }));
      } else if (initialData.tipo === 'remolque') {
        // Buscar si este remolque está vinculado a algún camión
        const camionVinculado = vehiculos.find(v => v.remolque_id === initialData.id);
        if (camionVinculado) {
          setFormData(prev => ({ ...prev, camion_id: camionVinculado.id }));
        }
      }
    }
  }, [initialData, vehiculos]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ... (existing useEffect and other handlers)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filtrar opciones disponibles para vincular
  const availableRemolques = remolques.filter(r =>
    !vehiculos.some(v => v.remolque_id === r.id && v.id !== initialData?.id)
  );

  // Filtrar camiones disponibles (que no tengan remolque o que tengan ESTE remolque)
  const availableCamiones = vehiculos.filter(v =>
    !v.tiene_remolque || (initialData && v.remolque_id === initialData.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.matricula) return;

    if (formData.tipo === 'remolque') {
      const remolqueData = {
        matricula: formData.matricula,
        tipo: formData.tipo_remolque,
        capacidad: formData.capacidad ? Number(formData.capacidad) : null
      };

      if (initialData) {
        await updateRemolque(initialData.id, remolqueData);

        // Manejar Vinculación desde Remolque
        const newCamionId = formData.camion_id ? parseInt(formData.camion_id, 10) : null;
        // Buscar el camión que estaba vinculado antes (si lo había)
        const oldCamion = vehiculos.find(v => v.remolque_id === initialData.id);
        const oldCamionId = oldCamion ? oldCamion.id : null;

        if (newCamionId && newCamionId !== oldCamionId) {
          // Si había uno antes, desvincularlo primero
          if (oldCamionId) await unlinkRemolque(oldCamionId);
          // Vincular el nuevo
          await linkRemolque(newCamionId, initialData.id);
        } else if (!newCamionId && oldCamionId) {
          // Solo desvincular
          await unlinkRemolque(oldCamionId);
        }

      } else {
        addRemolque(remolqueData);
      }
    } else {
      // Lógica para Camiones
      const vehiculoData = {
        ...formData,
        kms: Number(formData.kms),
        km_ultima_revision: formData.km_ultima_revision ? Number(formData.km_ultima_revision) : null,
        cv: formData.cv ? Number(formData.cv) : null,
        consumo_medio: formData.consumo_medio ? Number(formData.consumo_medio) : null,
      };

      let savedVehicle = null;
      if (initialData) {
        savedVehicle = await updateVehicle(initialData.id, vehiculoData);
      } else {
        savedVehicle = await addVehicle(vehiculoData);
      }

      // Manejar Vinculación
      if (savedVehicle) {
        const newRemolqueId = formData.remolque_id ? parseInt(formData.remolque_id, 10) : null;
        const oldRemolqueId = initialData?.remolque_id;

        if (newRemolqueId && newRemolqueId !== oldRemolqueId) {
          await linkRemolque(savedVehicle.id, newRemolqueId);
        } else if (!newRemolqueId && oldRemolqueId) {
          await unlinkRemolque(savedVehicle.id);
        }
      }
    }
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (formData.tipo === 'remolque') {
      await deleteRemolque(initialData.id);
    } else {
      await deleteVehicle(initialData.id);
    }
    setShowDeleteModal(false);
    onClose();
  };

  return (
    <div className="vehicle-drawer-overlay" onClick={onClose}>
      <div className="vehicle-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>{initialData ? "Editar Vehículo" : "Nuevo Vehículo"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="vehicle-form">
          {/* ... existing form fields ... */}

          <div className="form-group">
            <label>Tipo de Vehículo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              disabled={!!initialData}
            >
              <option value="camion">Camión</option>
              <option value="remolque">Remolque</option>
              <option value="furgoneta" disabled>Furgoneta (Próximamente)</option>
            </select>
          </div>

          {formData.tipo === 'remolque' ? (
            <>
              <div className="form-group">
                <label>Matrícula *</label>
                <input
                  name="matricula"
                  type="text"
                  value={formData.matricula}
                  onChange={handleInputChange}
                  required
                  placeholder="R-0000-BBB"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Remolque</label>
                <input
                  name="tipo_remolque"
                  type="text"
                  value={formData.tipo_remolque}
                  onChange={handleInputChange}
                  placeholder="Ej: Frigorífico, Lona, Plataforma..."
                />
              </div>

              <div className="form-group">
                <label>Capacidad (kg/litros)</label>
                <input
                  name="capacidad"
                  type="number"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  placeholder="Ej: 24000"
                />
              </div>

              <div className="form-group">
                <label>Vincular a Camión</label>
                <select
                  name="camion_id"
                  value={formData.camion_id || ""}
                  onChange={handleInputChange}
                >
                  <option value="">-- Sin Camión --</option>
                  {availableCamiones.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.matricula} {c.modelo ? `(${c.modelo})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
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
                    placeholder="R-0000-XXX"
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

              <div className="form-group">
                <label>Vincular Remolque</label>
                <select
                  name="remolque_id"
                  value={formData.remolque_id || ""}
                  onChange={handleInputChange}
                >
                  <option value="">-- Sin Remolque --</option>
                  {availableRemolques.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.matricula} {r.tipo ? `(${r.tipo})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

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

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="¿Eliminar Vehículo?"
          message={`Estás a punto de eliminar el vehículo con matrícula "${formData.matricula}". Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          isDanger={true}
        />
      </div>
    </div>
  );
}

export default VehicleForm;
