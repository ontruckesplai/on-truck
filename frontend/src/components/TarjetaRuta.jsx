import { useState } from "react";
import MapaRuta from "./MapaRuta";
import "./TarjetaRuta.css";
import "./MapaRuta.css"; // Import styles for the map modal

function TarjetaRuta({ ruta }) {
    const [showMap, setShowMap] = useState(false);

    const statusColors = {
        Activa: { bg: "var(--info-bg)", text: "var(--info-text)" },
        Pendiente: { bg: "var(--warning-bg)", text: "var(--warning-text)" },
        Completada: { bg: "var(--success-bg)", text: "var(--success-text)" },
    };

    const statusStyle = statusColors[ruta.estado] || statusColors["Pendiente"];

    // Cálculo de Coste Estimado
    const costeEstimado = (ruta.distancia_km * ruta.consumo_estimado / 100 * ruta.precio_gasolina).toFixed(2);

    return (
        <>
            <div className="tarjeta-ruta">
                <div className="ruta-header">
                    <span className="ruta-id">#{ruta.id}</span>
                    <span
                        className="ruta-estado"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                        {ruta.estado}
                    </span>
                </div>

                <div className="ruta-body">
                    <div className="ruta-point">
                        <div className="point-dot origin"></div>
                        <div className="point-info">
                            <span className="point-label">Origen</span>
                            <span className="point-value">{ruta.origen}</span>
                        </div>
                    </div>
                    <div className="ruta-line"></div>
                    <div className="ruta-point">
                        <div className="point-dot destination"></div>
                        <div className="point-info">
                            <span className="point-label">Destino</span>
                            <span className="point-value">{ruta.destino}</span>
                        </div>
                    </div>
                </div>

                <div className="ruta-details">
                    <div className="detail-item">
                        <span className="detail-label">Distancia</span>
                        <span className="detail-value">{ruta.distancia_km} km</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Coste Est.</span>
                        <span className="detail-value">{costeEstimado} €</span>
                    </div>
                </div>

                <div className="ruta-footer">
                    <div className="ruta-truck">
                        <span className="truck-icon">🚛</span>
                        <span>{ruta.camion_id ? `Camión #${ruta.camion_id}` : "Sin asignar"}</span>
                    </div>
                    <button className="btn-map" onClick={() => setShowMap(true)}>
                        Ver Mapa 🗺️
                    </button>
                </div>
            </div>

            {showMap && <MapaRuta ruta={ruta} onClose={() => setShowMap(false)} />}
        </>
    );
}

export default TarjetaRuta;
