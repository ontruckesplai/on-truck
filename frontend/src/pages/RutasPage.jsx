import { useState, useEffect } from "react";
import TarjetaRuta from "../components/TarjetaRuta";

function RutasPage() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/contracts");
            if (!response.ok) throw new Error("Error fetching contracts");
            const data = await response.json();
            setContracts(data);
        } catch (error) {
            console.error("Error loading contracts:", error);
        } finally {
            setLoading(false);
        }
    };

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
