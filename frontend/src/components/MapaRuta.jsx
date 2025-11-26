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

function MapaRuta({ ruta, onClose }) {
    if (!ruta || !ruta.coordenadas) return null;

    const { origen, destino } = ruta.coordenadas;
    const center = [
        (origen[0] + destino[0]) / 2,
        (origen[1] + destino[1]) / 2,
    ];

    return (
        <div className="map-modal-overlay" onClick={onClose}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>
                <div className="map-header">
                    <h3>Ruta: {ruta.origen} - {ruta.destino}</h3>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="map-container">
                    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={origen}>
                            <Popup>Origen: {ruta.origen}</Popup>
                        </Marker>
                        <Marker position={destino}>
                            <Popup>Destino: {ruta.destino}</Popup>
                        </Marker>
                        <Polyline positions={[origen, destino]} color="blue" />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default MapaRuta;
