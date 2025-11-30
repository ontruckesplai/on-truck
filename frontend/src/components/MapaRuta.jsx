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
            try {
                // OSRM expects lon,lat
                const url = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.routes && data.routes[0]) {
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoutePositions(coordinates);
                }
            } catch (error) {
                console.error("Error fetching route:", error);
                setRoutePositions([[originLat, originLon], [destLat, destLon]]);
            }
        };

        fetchRoute();
    }, [originLat, originLon, destLat, destLon, isValid]);

    if (!isValid) return <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">Coordenadas incompletas</div>;

    return (
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
            {routePositions && <Polyline positions={routePositions} color="blue" />}
        </MapContainer>
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
