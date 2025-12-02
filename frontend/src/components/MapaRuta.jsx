import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export function RouteMap({ origin, destination }) {
    const [routePositions, setRoutePositions] = useState(null);
    const [isFallback, setIsFallback] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Ensure coordinates are valid numbers
    const originLat = parseFloat(origin[0]);
    const originLon = parseFloat(origin[1]);
    const destLat = parseFloat(destination[0]);
    const destLon = parseFloat(destination[1]);

    const isValid = !isNaN(originLat) && !isNaN(originLon) && !isNaN(destLat) && !isNaN(destLon);

    const center = isValid ? [
        (originLat + destLat) / 2,
        (originLon + destLon) / 2,
    ] : [40.4168, -3.7038]; // Default to Madrid if invalid

    useEffect(() => {
        if (!isValid) return;

        const fetchRoute = async () => {
            setIsFallback(false);
            setErrorMessage(null);

            // Primary: OSRM Demo (User confirmed this worked before)
            const primaryUrl = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;
            // Secondary: OpenStreetMap Germany (Backup)
            const secondaryUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;

            try {
                // Try primary
                let response = await fetch(primaryUrl);
                if (!response.ok) throw new Error(`Primary failed: ${response.status}`);
                let data = await response.json();

                if (data.routes && data.routes[0]) {
                    const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoutePositions(coordinates);
                    return;
                }
            } catch (err) {
                console.warn("Primary OSRM failed, trying secondary...", err);
            }

            try {
                // Try secondary
                let response = await fetch(secondaryUrl);
                if (!response.ok) throw new Error(`Secondary failed: ${response.status}`);
                let data = await response.json();

                if (data.routes && data.routes[0]) {
                    const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoutePositions(coordinates);
                    return;
                }
            } catch (err) {
                console.error("All routing services failed:", err);
                // Fallback: Straight line
                setRoutePositions([[originLat, originLon], [destLat, destLon]]);
                setIsFallback(true);
                setErrorMessage("No se pudo calcular la ruta real (Servidores saturados)");
            }
        };

        fetchRoute();
    }, [originLat, originLon, destLat, destLon, isValid]);

    if (!isValid) return <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">Coordenadas incompletas</div>;

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[originLat, originLon]}>
                    <Popup>Origen</Popup>
                </Marker>
                <Marker position={[destLat, destLon]}>
                    <Popup>Destino</Popup>
                </Marker>
                {routePositions && <Polyline positions={routePositions} color={isFallback ? "red" : "blue"} dashArray={isFallback ? "10, 10" : null} />}
            </MapContainer>
            {isFallback && (
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    zIndex: 1000,
                    pointerEvents: "none",
                    fontWeight: "500"
                }}>
                    {errorMessage || "Ruta estimada (recta)"}
                </div>
            )}
        </div>
    );
}

function MapaRuta({ ruta, onClose }) {
    if (!ruta || !ruta.coordenadas) return null;

    const { origen, destino } = ruta.coordenadas;

    return (
        <div className="map-modal-overlay" onClick={onClose}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>
                <div className="map-header">
                    <h3>Ruta: {ruta.origen} - {ruta.destino}</h3>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="map-container">
                    <RouteMap origin={origen} destination={destino} />
                </div>
            </div>
        </div>
    );
}

export default MapaRuta;
