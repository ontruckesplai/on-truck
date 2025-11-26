import { useFleet } from "../context/FleetContext";
import TarjetaRuta from "../components/TarjetaRuta";

function RutasPage() {
    const { rutas } = useFleet();

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                {rutas.map((ruta) => (
                    <TarjetaRuta key={ruta.id} ruta={ruta} />
                ))}
            </div>
        </div>
    );
}

export default RutasPage;
