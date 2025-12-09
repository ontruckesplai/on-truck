import { useState } from "react";
import MapaRuta from "./MapaRuta";
import { useFleet } from "../context/FleetContext";
import "./TarjetaContrato.css";
import "./MapaRuta.css"; // Ensure map modal styles are available

const IconoContrato = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

function TarjetaContrato({ contract, onClick, onAssign }) {
    const { vehiculos } = useFleet();
    const [showMap, setShowMap] = useState(false);

    const statusColors = {
        pending: { bg: "rgba(249, 115, 22, 0.1)", text: "#f97316", label: "Pendiente" },
        in_progress: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", label: "En Progreso" },
        completed: { bg: "rgba(34, 197, 94, 0.1)", text: "#16a34a", label: "Completado" },
    };

    const statusStyle = statusColors[contract.status] || statusColors["pending"];

    // Check for active assignment
    const activeAssignment = contract.asignaciones?.find(a => a.estado !== 'COMPLETADO');
    const linkedTruckName = activeAssignment ? (activeAssignment.camion_id || "Camión Asignado") : null;
    // Note: The backend serialization of CamionContrato returns camion_id. 
    // ideally we want the plate or model. Let's assume we might need to fetch it or context has it.
    // Actually, FleetContext has all trucks. We can look it up.

    // However, to keep it simple and fast without extra lookups if not needed:
    // We will trust 'activeAssignment' exists. 
    // To get the truck details properly, we might need to look into 'vehiculos' from context if we want the plate.
    // usage of useFleet inside the item component is fine.




    // Prepare data for MapaRuta
    const mapData = {
        origen: contract.origin_address,
        destino: contract.destination_address,
        coordenadas: {
            origen: [parseFloat(contract.origin_lat), parseFloat(contract.origin_lon)],
            destino: [parseFloat(contract.destination_lat), parseFloat(contract.destination_lon)]
        }
    };

    const handleMapClick = (e) => {
        e.stopPropagation();
        // Only show map if we have valid coordinates
        if (mapData.coordenadas.origen[0] && mapData.coordenadas.origen[1] &&
            mapData.coordenadas.destino[0] && mapData.coordenadas.destino[1]) {
            setShowMap(true);
        } else {
            alert("Este contrato no tiene coordenadas válidas para mostrar el mapa.");
        }
    };

    return (
        <>
            <div className="tarjeta-contrato" onClick={() => onClick(contract)}>
                <div className="tarjeta-header">
                    <div className="client-info">
                        <span className="icono-contrato"><IconoContrato /></span>
                        <span className="client-texto">{contract.client_name}</span>
                    </div>
                    <span
                        className="estado-badge"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                        {statusStyle.label}
                    </span>
                </div>

                <div className="tarjeta-body">
                    <div className="ruta-point">
                        <div className="point-dot origin"></div>
                        <div className="point-info">
                            <span className="point-label">Origen</span>
                            <span className="point-value" title={contract.origin_address}>
                                {contract.origin_address ? contract.origin_address.split(',')[0] : "-"}
                            </span>
                        </div>
                    </div>
                    <div className="ruta-line"></div>
                    <div className="ruta-point">
                        <div className="point-dot destination"></div>
                        <div className="point-info">
                            <span className="point-label">Destino</span>
                            <span className="point-value" title={contract.destination_address}>
                                {contract.destination_address ? contract.destination_address.split(',')[0] : "-"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="tarjeta-footer-grid">
                    <div className="dato-item">
                        <span className="dato-label">Distancia</span>
                        <span className="dato-valor">{contract.distance_km ? `${Math.round(contract.distance_km)} km` : "-"}</span>
                    </div>
                    <div className="dato-item">
                        <span className="dato-label">Producto</span>
                        <span className="dato-valor">{contract.product_type}</span>
                    </div>
                </div>

                {/* Progress Bars Section */}
                <div className="progress-section">
                    {/* Time Progress */}
                    <div className="progress-group">
                        <div className="progress-header">
                            <span className="progress-label">Tiempo Restante</span>
                            <span className="progress-value">
                                {(() => {
                                    if (!contract.deadline) return "-";
                                    const deadlineDate = new Date(contract.deadline);
                                    deadlineDate.setHours(0, 0, 0, 0);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const diffTime = deadlineDate.getTime() - today.getTime();
                                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                                    if (diffDays < 0) return <span style={{ color: '#ef4444' }}>Vencido ({Math.abs(diffDays)} días)</span>;
                                    if (diffDays === 0) return <span style={{ color: '#f97316' }}>Hoy</span>;
                                    return `${diffDays} días`;
                                })()}
                            </span>
                        </div>
                        <div className="aesthetic-bar-container">
                            <div
                                className={`aesthetic-bar-fill time ${(() => {
                                    if (!contract.deadline) return '';
                                    const deadlineDate = new Date(contract.deadline);
                                    const today = new Date();
                                    const diffTime = deadlineDate.getTime() - today.getTime();
                                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                    if (diffDays < 0) return 'danger';
                                    if (diffDays <= 2) return 'warning';
                                    return '';
                                })()}`}
                                style={{
                                    width: (() => {
                                        // If no deadline, no progress bar
                                        if (!contract.deadline) return '0%';

                                        // If no creation date (old contracts), assume 0% progress or handle differently
                                        // Here we default to 0% to avoid confusion
                                        if (!contract.created_at) return '0%';

                                        const start = new Date(contract.created_at).getTime();
                                        const end = new Date(contract.deadline).getTime();
                                        const now = new Date().getTime();

                                        // Safety check for invalid dates
                                        if (isNaN(start) || isNaN(end)) return '0%';

                                        if (now >= end) return '100%';
                                        if (now <= start) return '0%';

                                        const total = end - start;
                                        const current = now - start;

                                        // Prevent division by zero
                                        if (total <= 0) return '100%';

                                        return `${Math.min(100, Math.max(0, (current / total) * 100))}%`;
                                    })(),
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Cargo Progress */}
                    <div className="progress-group">
                        <div className="progress-header">
                            <span className="progress-label">Progreso Carga</span>
                            <span className="progress-value">
                                {contract.delivered_quantity ? Math.round((contract.delivered_quantity / contract.total_quantity) * 100) : 0}%
                            </span>
                        </div>
                        <div className="aesthetic-bar-container">
                            <div
                                className="aesthetic-bar-fill cargo"
                                style={{
                                    width: `${Math.min(100, ((contract.delivered_quantity || 0) / contract.total_quantity) * 100)}%`
                                }}
                            ></div>
                        </div>
                        <div style={{ fontSize: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {contract.delivered_quantity?.toLocaleString('es-ES') || 0} / {contract.total_quantity?.toLocaleString('es-ES')} kg
                        </div>
                    </div>
                </div>

                <div className="tarjeta-actions">
                    {activeAssignment ? (
                        <div className="linked-truck-info">
                            <span className="truck-icon">🚛</span>
                            <div className="truck-details">
                                <span className="truck-label">Vehículo Asignado</span>
                                <span className="truck-value">
                                    {/* Try to find truck in context, else show ID */}
                                    {vehiculos.find(v => v.id === activeAssignment.camion_id)?.matricula || `ID: ${activeAssignment.camion_id}`}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <button className="btn-action secondary" onClick={(e) => { e.stopPropagation(); onAssign(contract); }}>
                            <span>🚛</span> Asignar Camión
                        </button>
                    )}

                    <button className="btn-action primary" onClick={handleMapClick}>
                        <span>🗺️</span> Ver Mapa
                    </button>
                </div>
            </div >

            {showMap && <MapaRuta ruta={mapData} onClose={() => setShowMap(false)} />
            }
        </>
    );
}

export default TarjetaContrato;
