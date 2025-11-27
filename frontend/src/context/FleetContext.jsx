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
    const [loading, setLoading] = useState(true);

    // Cargar vehículos desde el backend al montar el componente
    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/camiones');
                const result = await response.json();

                if (result.success && result.data) {
                    // Mapear datos del backend usando SOLO los campos que existen en MySQL
                    const transformedData = result.data.map(camion => ({
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
                        // Campos calculados para el frontend
                        tipo: "camion",
                        estado: determinarEstado(camion)
                    }));
                    setVehiculos(transformedData);
                }
            } catch (error) {
                console.error('Error al cargar vehículos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehiculos();
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
                setVehiculos([...vehiculos, newVehicle]);
            }
        } catch (error) {
            console.error('Error al crear vehículo:', error);
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
                setVehiculos(vehiculos.map(v => v.id === id ? updatedVehicle : v));
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
            const result = await response.json();
            if (result.success) {
                setVehiculos(vehiculos.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
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
