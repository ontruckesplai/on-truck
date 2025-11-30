import { RouteMap } from "./MapaRuta";
import "./TarjetaRuta.css";

function TarjetaRuta({ contract }) {
    const hasCoordinates = contract.origin_lat && contract.origin_lon && contract.destination_lat && contract.destination_lon;

    return (
        <div className="tarjeta-ruta-visual">
            <div className="map-background">
                {hasCoordinates ? (
                    <RouteMap
                        origin={[contract.origin_lat, contract.origin_lon]}
                        destination={[contract.destination_lat, contract.destination_lon]}
                    />
                ) : (
                    <div className="no-map-placeholder">
                        <span>Sin coordenadas</span>
                    </div>
                )}
            </div>

            <div className="ruta-minimal-footer">
                <span className="distance-label">
                    {contract.distance_km ? `${Math.round(contract.distance_km)} km` : '-'}
                </span>
                <button className="btn-assign-minimal">
                    Asignar 🚛
                </button>
            </div>
        </div>
    );
}

export default TarjetaRuta;
