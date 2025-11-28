import { createContext, useState, useContext, useEffect } from "react";

const FleetContext = createContext();

export const useFleet = () => {
    const context = useContext(FleetContext);
    if (!context) {
        throw new Error("useFleet must be used within a FleetProvider");
    }
    return context;
};

export const FleetProvider = ({ children }) => {
    // --- Estado Inicial ---
    const [vehiculos, setVehiculos] = useState([]);
    const [remolques, setRemolques] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar vehículos y remolques desde el backend al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Camiones
                const responseCamiones = await fetch('http://127.0.0.1:8000/api/camiones');
                const resultCamiones = await responseCamiones.json();

                if (resultCamiones) { // Array directo o {success: true, data: []}
                    const data = Array.isArray(resultCamiones) ? resultCamiones : resultCamiones.data;
                    const transformedData = data.map(transformBackendToFrontend);
                    setVehiculos(transformedData);
                }

                // Fetch Remolques
                const responseRemolques = await fetch('http://127.0.0.1:8000/api/remolques');
                const resultRemolques = await responseRemolques.json();

                if (resultRemolques) {
                    const data = Array.isArray(resultRemolques) ? resultRemolques : resultRemolques.data;
                    setRemolques(data);
                }

            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función auxiliar para determinar el estado basado en los datos
    const determinarEstado = (camion) => {
        const kmHastaRevision = (camion.kmUltimaRevision + 10000) - camion.kms;
        if (kmHastaRevision < 1000) return "Taller";
        if (camion.combustible && camion.combustible > 50) return "Disponible";
        return "Disponible";
    };

    const [rutas, setRutas] = useState([
        {
            id: "R001",
            origen: "Madrid",
            destino: "Barcelona",
            estado: "Activa",
            camion_id: 1,
            fecha: "2025-11-24",
            distancia_km: 620,
            consumo_estimado: 30, // L/100km
            precio_gasolina: 1.5,
            coordenadas: {
                origen: [40.416775, -3.70379],
                destino: [41.385064, 2.173404],
            },
        },
        {
            id: "R002",
            origen: "Valencia",
            destino: "Sevilla",
            estado: "Pendiente",
            camion_id: null,
            fecha: "2025-11-25",
            distancia_km: 650,
            consumo_estimado: 28,
            precio_gasolina: 1.5,
            coordenadas: {
                origen: [39.469907, -0.376288],
                destino: [37.389092, -5.984459],
            },
        },
    ]);

    const [conductores, setConductores] = useState([
        {
            id: 1,
            nombre: "Juan Pérez",
            carnet_valido: true,
            fecha_caducidad: "2026-05-20",
            estado: "Ocupado", // Ocupado, Disponible, Baja
        },
        {
            id: 2,
            nombre: "Ana García",
            carnet_valido: true,
            fecha_caducidad: "2025-12-10",
            estado: "Disponible",
        },
        {
            id: 3,
            nombre: "Carlos López",
            carnet_valido: false, // Caducado
            fecha_caducidad: "2024-10-01",
            estado: "Disponible",
        },
    ]);

    // --- Acciones ---

    // --- Acciones ---

    // Función auxiliar para transformar datos de backend a frontend
    const transformBackendToFrontend = (camion) => ({
        id: camion.id,
        matricula: camion.matricula,
        kms: camion.kms,
        km_ultima_revision: camion.kmUltimaRevision,
        combustible: camion.combustible,
        cv: camion.cv,
        consumo_medio: camion.consumoMedio,
        inicio: camion.inicio,
        fin: camion.fin,
        notas: camion.notas,
        tiene_remolque: camion.tieneRemolque,
        remolque_id: camion.remolque?.id || null,
        modelo: camion.modelo,
        fecha_itv: camion.fechaItv,
        tipo: "camion",
        estado: determinarEstado(camion)
    });

    const addVehicle = async (vehiculo) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/camiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculo)
            });
            const result = await response.json();
            if (result.success) {
                const newVehicle = transformBackendToFrontend(result.data);
                setVehiculos(prev => [...prev, newVehicle]);
                return newVehicle;
            }
            return null;
        } catch (error) {
            console.error('Error al crear vehículo:', error);
            return null;
        }
    };

    const updateVehicle = async (id, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/camiones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();
            if (result.success) {
                const updatedVehicle = transformBackendToFrontend(result.data);
                setVehiculos(prev => prev.map(v => v.id === id ? updatedVehicle : v));
                return updatedVehicle;
            }
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
        }
    };

    const deleteVehicle = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/camiones/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setVehiculos(prev => prev.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    // --- Acciones Remolques ---

    const addRemolque = async (remolque) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/remolques', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(remolque)
            });
            const newRemolque = await response.json();
            if (newRemolque) {
                setRemolques(prev => [...prev, newRemolque]);
                return newRemolque;
            }
            return null;
        } catch (error) {
            console.error('Error al crear remolque:', error);
            return null;
        }
    };

    const updateRemolque = async (id, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/remolques/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const updatedRemolque = await response.json();
            if (updatedRemolque) {
                setRemolques(prev => prev.map(r => r.id === id ? updatedRemolque : r));
            }
        } catch (error) {
            console.error('Error al actualizar remolque:', error);
        }
    };

    const deleteRemolque = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/remolques/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setRemolques(prev => prev.filter((r) => r.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar remolque:', error);
        }
    };

    // --- Acciones Linking ---

    const linkRemolque = async (camionId, remolqueId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/camiones/${camionId}/link-trailer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ remolque_id: remolqueId })
            });
            const result = await response.json();
            if (result.success) {
                const transformed = transformBackendToFrontend(result.data);
                setVehiculos(prev => prev.map(v => v.id === camionId ? transformed : v));
            }
        } catch (error) {
            console.error('Error al vincular remolque:', error);
        }
    };

    const unlinkRemolque = async (camionId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/camiones/${camionId}/unlink-trailer`, {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                const transformed = transformBackendToFrontend(result.data);
                setVehiculos(prev => prev.map(v => v.id === camionId ? transformed : v));
            }
        } catch (error) {
            console.error('Error al desvincular remolque:', error);
        }
    };

    const assignDriver = (vehiculoId, conductorId) => {
        const conductor = conductores.find((c) => c.id === parseInt(conductorId));
        if (!conductor) return;

        if (!conductor.carnet_valido) {
            alert("Error: El carnet del conductor está caducado.");
            return;
        }

        // Desasignar conductor anterior si lo hubiera
        const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
        if (vehiculo.conductor_id) {
            updateDriverStatus(vehiculo.conductor_id, "Disponible");
        }

        // Asignar nuevo
        updateVehicle(vehiculoId, { conductor_id: parseInt(conductorId) });
        updateDriverStatus(parseInt(conductorId), "Ocupado");
    };

    const updateDriverStatus = (id, status) => {
        setConductores(
            conductores.map((c) => (c.id === id ? { ...c, estado: status } : c))
        );
    };

    const addRoute = (ruta) => {
        setRutas([...rutas, { ...ruta, id: `R${Date.now()}` }]);
    };

    // --- Theme (Dark Mode) ---
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    return (
        <FleetContext.Provider
            value={{
                vehiculos,
                remolques,
                rutas,
                conductores,
                addVehicle,
                updateVehicle,
                deleteVehicle,
                addRemolque,
                updateRemolque,
                deleteRemolque,
                linkRemolque,
                unlinkRemolque,
                rutas,
                conductores,
                addVehicle,
                updateVehicle,
                deleteVehicle,
                assignDriver,
                addRoute,
                darkMode,
                toggleTheme,
            }}
        >
            {children}
        </FleetContext.Provider>
    );
};
