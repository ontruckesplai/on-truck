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
    // --- Estado Inicial (Mock Data) ---
    const [vehiculos, setVehiculos] = useState([
        {
            id: 1,
            matricula: "1234-GJK",
            modelo: "Volvo FH16",
            estado: "En Ruta",
            kilometros: 120000,
            proxima_revision: 120500, // Alerta Mantenimiento (< 1000km)
            tipo: "camion",
            potencia: "750cv",
            remolque: "R-5432-BBB",
            conductor_id: 1,
        },
        {
            id: 2,
            matricula: "5678-LMN",
            modelo: "Scania R450",
            estado: "Taller",
            kilometros: 340500,
            proxima_revision: 350000,
            tipo: "camion",
            potencia: "450cv",
            conductor_id: null,
        },
        {
            id: 3,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 4,
            matricula: "1122-XYZ",
            modelo: "Renault Kangoo",
            estado: "Disponible",
            kilometros: 85000,
            proxima_revision: 90000,
            tipo: "furgoneta",
            potencia: "110cv",
            conductor_id: null,
        },
        {
            id: 5,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 6,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 5,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 6,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 7,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 8,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 9,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 10,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 11,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 12,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 13,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 14,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 15,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 16,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 17,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 18,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 19,
            matricula: "R-5432-BBB",
            modelo: "Lecitrailer",
            estado: "En Ruta",
            kilometros: 25000,
            proxima_revision: 30000,
            tipo: "remolque",
            capacidad_carga: "24t",
            conductor_id: null, // Remolques no tienen conductor directo, van con el camión
        },
        {
            id: 20,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },
        {
            id: 21,
            matricula: "9988-PPL",
            modelo: "Mercedes Actros",
            estado: "Disponible",
            kilometros: 15000,
            proxima_revision: 30000,
            tipo: "camion",
            potencia: "510cv",
            conductor_id: null,
        },

    ]);

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

    const addVehicle = (vehiculo) => {
        setVehiculos([...vehiculos, { ...vehiculo, id: Date.now() }]);
    };

    const updateVehicle = (id, updatedData) => {
        setVehiculos(
            vehiculos.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
        );
    };

    const deleteVehicle = (id) => {
        setVehiculos(vehiculos.filter((v) => v.id !== id));
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
