import { useState } from "react";
import MapaRuta from "./MapaRuta";
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

function TarjetaContrato({ contract, onClick }) {
    const [showMap, setShowMap] = useState(false);

    const statusColors = {
        pending: { bg: "rgba(249, 115, 22, 0.1)", text: "#f97316", label: "Pendiente" },
        in_progress: { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6", label: "En Progreso" },
        completed: { bg: "rgba(34, 197, 94, 0.1)", text: "#16a34a", label: "Completado" },
    };

    const statusStyle = statusColors[contract.status] || statusColors["pending"];

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
                            <span className="point-value" title={contract.origin_address}>{contract.origin_address}</span>
                        </div>
                    </div>
                    <div className="ruta-line"></div>
                    <div className="ruta-point">
                        <div className="point-dot destination"></div>
                        <div className="point-info">
                            <span className="point-label">Destino</span>
                            <span className="point-value" title={contract.destination_address}>{contract.destination_address}</span>
                        </div>
                    </div>
                </div>

                <div className="tarjeta-footer-grid">
                    <div className="dato-item">
                        <span className="dato-label">Distancia</span>
                        <span className="dato-valor">{contract.distance_km ? `${Math.round(contract.distance_km)} km` : "-"}</span>
                    </div>
                    <div className="dato-item">
                        <span className="dato-label">Carga</span>
                        <span className="dato-valor">{contract.total_quantity?.toLocaleString('es-ES')} kg</span>
                    </div>
                    <div className="dato-item">
                        <span className="dato-label">Producto</span>
                        <span className="dato-valor">{contract.product_type}</span>
                    </div>
                    <div className="dato-item">
                        <span className="dato-label">Fecha</span>
                        <span className="dato-valor">{contract.deadline}</span>
                    </div>
                </div>

                <div className="ruta-footer mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="ruta-truck flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="truck-icon">🚛</span>
                        <span>Sin asignar</span>
                    </div>
                    <button className="btn-map text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1" onClick={handleMapClick}>
                        Ver Mapa 🗺️
                    </button>
                </div>
            </div>

            {showMap && <MapaRuta ruta={mapData} onClose={() => setShowMap(false)} />}
        </>
    );
}

export default TarjetaContrato;
