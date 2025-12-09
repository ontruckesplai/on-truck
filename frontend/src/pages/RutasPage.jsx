import { useFleet } from "../context/FleetContext";
import TarjetaRuta from "../components/TarjetaRuta";

function RutasPage() {
    const { contracts, loading } = useFleet();

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando rutas...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Rutas</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "24px" }}>
                {contracts.map((contract) => (
                    <TarjetaRuta key={contract.id} contract={contract} />
                ))}
            </div>
        </div>
    );
}

export default RutasPage;
