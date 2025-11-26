import { useState } from "react";
import { useFleet } from "../context/FleetContext";
import TarjetaVehiculo from "../components/TarjetaVehiculo";
import VehicleForm from "../components/VehicleForm";
import Paginacion from "../components/Paginacion";
import "./VehiculosPage.css";

function VehiculosPage() {
  const { vehiculos, deleteVehicle } = useFleet();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Pagination states
  const [pageMotor, setPageMotor] = useState(1);
  const [pageRemolques, setPageRemolques] = useState(1);

  const itemsPerPageMotor = 10;
  const itemsPerPageRemolques = 10;

  // Filtrado general (search + estado)
  const filteredVehiculos = vehiculos.filter((v) => {
    const matchesSearch =
      v.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado =
      filterEstado === "todos" || v.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Split into lists
  const motorVehicles = filteredVehiculos.filter(v =>
    v.tipo === 'camion' || v.tipo === 'furgoneta'
  );

  const trailers = filteredVehiculos.filter(v =>
    v.tipo === 'remolque'
  );

  // Pagination Logic
  const totalPagesMotor = Math.ceil(motorVehicles.length / itemsPerPageMotor);
  const paginatedMotor = motorVehicles.slice(
    (pageMotor - 1) * itemsPerPageMotor,
    pageMotor * itemsPerPageMotor
  );

  const totalPagesRemolques = Math.ceil(trailers.length / itemsPerPageRemolques);
  const paginatedRemolques = trailers.slice(
    (pageRemolques - 1) * itemsPerPageRemolques,
    pageRemolques * itemsPerPageRemolques
  );

  const handleAddClick = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditClick = (vehiculo) => {
    setEditingVehicle(vehiculo);
    setShowForm(true);
  };

  return (
    <div className="vehiculos-page">
      <div className="vehiculos-header-actions">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Buscar por matrícula o modelo..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="En Ruta">En Ruta</option>
            <option value="Taller">Taller</option>
          </select>
        </div>
        <button className="btn-add" onClick={handleAddClick}>
          + Añadir Vehículo
        </button>
      </div>

      {/* Section: Camiones y Furgones */}
      <div className="vehiculos-section">
        <h2 className="section-title">Camiones y Furgones</h2>
        <div className="vehiculos-grid">
          {paginatedMotor.length > 0 ? (
            paginatedMotor.map((v) => (
              <TarjetaVehiculo
                key={v.id}
                vehiculo={v}
                onEdit={handleEditClick}
              />
            ))
          ) : (
            <p>No se encontraron vehículos motorizados.</p>
          )}
        </div>
        {totalPagesMotor > 1 && (
          <Paginacion
            currentPage={pageMotor}
            totalPages={totalPagesMotor}
            onPageChange={setPageMotor}
          />
        )}
      </div>

      {/* Section: Remolques */}
      <div className="vehiculos-section">
        <h2 className="section-title">Remolques</h2>
        <div className="remolques-grid">
          {paginatedRemolques.length > 0 ? (
            paginatedRemolques.map((v) => (
              <TarjetaVehiculo
                key={v.id}
                vehiculo={v}
                onEdit={handleEditClick}
              />
            ))
          ) : (
            <p>No se encontraron remolques.</p>
          )}
        </div>
        {totalPagesRemolques > 1 && (
          <Paginacion
            currentPage={pageRemolques}
            totalPages={totalPagesRemolques}
            onPageChange={setPageRemolques}
          />
        )}
      </div>

      {showForm && (
        <VehicleForm
          onClose={() => setShowForm(false)}
          initialData={editingVehicle}
          onDelete={deleteVehicle}
        />
      )}
    </div>
  );
}

export default VehiculosPage;
