import { createContext, useState, useContext, useEffect } from "react";
import { authFetch } from "../services/api"; // Import centralized authFetch

// Creamos el contexto para compartir los datos en toda la app
const FleetContext = createContext();

// Hook personalizado para usar el contexto más fácilmente
export const useFleet = () => {
    const context = useContext(FleetContext);
    if (!context) {
        throw new Error("useFleet debe usarse dentro de un FleetProvider");
    }
    return context;
};

export const FleetProvider = ({ children }) => {
    // --- ESTADOS (Donde guardamos los datos) ---

    // Listas de datos que vienen del servidor (Backend)
    const [vehiculos, setVehiculos] = useState([]);
    const [remolques, setRemolques] = useState([]);
    const [contracts, setContracts] = useState([]);

    // Estado para saber si estamos cargando los datos
    const [loading, setLoading] = useState(true);

    // Listas de datos de prueba (Mock data) - Estas no vienen del servidor por ahora
    const [rutas, setRutas] = useState([
        {
            id: "R001",
            origen: "Madrid",
            destino: "Barcelona",
            estado: "Activa",
            camion_id: 1,
            fecha: "2025-11-24",
            distancia_km: 620,
            consumo_estimado: 30,
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


    // Estado para el tema oscuro
    const [darkMode, setDarkMode] = useState(false);

    // --- EFECTOS (Cosas que pasan automáticamente) ---

    // Al cargar la página, pedimos los datos al servidor
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1. Pedimos los camiones
                const respuestaCamiones = await authFetch('/camiones');
                const datosCamiones = await respuestaCamiones.json();

                if (datosCamiones) {
                    // A veces el servidor devuelve un array directo o un objeto con 'data'
                    const listaCamiones = Array.isArray(datosCamiones) ? datosCamiones : datosCamiones.data;

                    // Transformamos los datos para que sean fáciles de usar en el frontend
                    const camionesListos = listaCamiones.map(transformarDatosCamion);
                    setVehiculos(camionesListos);
                }

                // 2. Pedimos los remolques
                const respuestaRemolques = await authFetch('/remolques');
                const datosRemolques = await respuestaRemolques.json();

                if (datosRemolques) {
                    const listaRemolques = Array.isArray(datosRemolques) ? datosRemolques : datosRemolques.data;
                    setRemolques(listaRemolques);
                }

                // 3. Pedimos los contratos
                const respuestaContracts = await authFetch('/contracts');
                const datosContracts = await respuestaContracts.json();
                if (datosContracts) {
                    setContracts(datosContracts);
                }


            } catch (error) {
                console.error('Hubo un error al cargar los datos:', error);
            } finally {
                // Terminamos de cargar, haya error o no
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Efecto para cambiar la clase del body cuando cambia el modo oscuro
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // --- FUNCIONES AUXILIARES ---

    // Esta función decide si un camión está disponible o en taller
    const calcularEstadoCamion = (camion) => {
        // Si no tiene revisión registrada o es 0, asumimos que está al día (usamos sus kms actuales)
        const kmUltima = camion.kmUltimaRevision ? camion.kmUltimaRevision : camion.kms;
        // Intervalo de mantenimiento estimado: 50.000 km
        const kmParaRevision = (kmUltima + 50000) - camion.kms;

        if (kmParaRevision < 1000) {
            return "Taller";
        }
        if (camion.combustible && camion.combustible > 50) {
            return "Disponible";
        }
        return "Disponible";
    };

    // Esta función convierte los datos "feos" del servidor a datos "bonitos" para nosotros
    const transformarDatosCamion = (camion) => {
        return {
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
            remolque: camion.remolque || null, // Preserve full trailer object for capacity info
            modelo: camion.modelo,
            fecha_itv: camion.fechaItv,
            tipo: "camion",
            estado: calcularEstadoCamion(camion),
            asignaciones: camion.asignaciones || []
        };
    };

    // --- ACCIONES (Funciones que llamamos desde los componentes) ---

    // CAMIONES
    const addVehicle = async (nuevoVehiculo) => {
        try {
            const respuesta = await authFetch('/camiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoVehiculo)
            });
            const resultado = await respuesta.json();

            if (resultado.success) {
                const vehiculoListo = transformarDatosCamion(resultado.data);
                // Añadimos el nuevo vehículo a la lista que ya tenemos
                setVehiculos(prev => [...prev, vehiculoListo]);
                return vehiculoListo;
            }
        } catch (error) {
            console.error('Error al crear vehículo:', error);
        }
        return null;
    };

    const updateVehicle = async (id, datosActualizados) => {
        try {
            const respuesta = await authFetch(`/camiones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });
            const resultado = await respuesta.json();

            if (resultado.success) {
                const vehiculoActualizado = transformarDatosCamion(resultado.data);
                // Buscamos el vehículo en la lista y lo cambiamos por el nuevo
                setVehiculos(prev => prev.map(v => v.id === id ? vehiculoActualizado : v));
                return vehiculoActualizado;
            }
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
        }
    };

    const deleteVehicle = async (id) => {
        try {
            const respuesta = await authFetch(`/camiones/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                // Quitamos el vehículo de la lista filtrando los que NO sean ese id
                setVehiculos(prev => prev.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    // REMOLQUES
    const addRemolque = async (nuevoRemolque) => {
        try {
            const respuesta = await authFetch('/remolques', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoRemolque)
            });
            const remolqueCreado = await respuesta.json();

            if (remolqueCreado) {
                setRemolques(prev => [...prev, remolqueCreado]);
                return remolqueCreado;
            }
        } catch (error) {
            console.error('Error al crear remolque:', error);
        }
        return null;
    };

    const updateRemolque = async (id, datosActualizados) => {
        try {
            const respuesta = await authFetch(`/remolques/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });
            const remolqueActualizado = await respuesta.json();

            if (remolqueActualizado) {
                setRemolques(prev => prev.map(r => r.id === id ? remolqueActualizado : r));
            }
        } catch (error) {
            console.error('Error al actualizar remolque:', error);
        }
    };

    const deleteRemolque = async (id) => {
        try {
            const respuesta = await authFetch(`/remolques/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                setRemolques(prev => prev.filter((r) => r.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar remolque:', error);
        }
    };

    // CONTRATOS
    const addContract = async (nuevoContrato) => {
        try {
            const respuesta = await authFetch('/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoContrato)
            });
            const resultado = await respuesta.json(); // Assuming backend returns the created object directly or inside data

            // Adjust based on typical backend response. Usually $this->jsonSuccess($contract) returns { success: true, data: {...} } or just JSON.
            // Looking at CamionController it returns jsonSuccess.
            // Let's assume standard response format.
            if (resultado && (resultado.id || resultado.data)) {
                 const contractData = resultado.data || resultado;
                 setContracts(prev => [...prev, contractData]);
                 return contractData;
            }
        } catch (error) {
            console.error('Error al crear contrato:', error);
        }
        return null;
    };

    const updateContract = async (id, datosActualizados) => {
        // 1. Optimistic Update: Update UI immediately
        const previousContracts = [...contracts]; // Snapshot for rollback
        
        setContracts(prev => prev.map(c => 
            c.id === id ? { ...c, ...datosActualizados } : c
        ));

        try {
            console.log(`[FleetContext] Updating contract ${id} (Optimistic)`, datosActualizados);
            const respuesta = await authFetch(`/contracts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });
            
            const resultado = await respuesta.json();

            if (resultado && (resultado.id || resultado.data)) {
                // 2. Success: Update with confirm server data (in case server calculated something extra)
                const contractData = resultado.data || resultado;
                setContracts(prev => prev.map(c => c.id === id ? contractData : c));
                return contractData;
            } else {
                 console.warn("[FleetContext] Update success check failed", resultado);
                 // Revert on soft failure
                 setContracts(previousContracts);
                 return null;
            }
        } catch (error) {
            console.error('Error al actualizar contrato:', error);
            // Revert on hard failure
            setContracts(previousContracts);
            return null;
        }
    };

    const deleteContract = async (id) => {
        try {
            const respuesta = await authFetch(`/contracts/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                setContracts(prev => prev.filter((c) => c.id !== id));
            }
        } catch (error) {
            console.error('Error al eliminar contrato:', error);
        }
    };

    // ASIGNAR CONTRATO A CAMIÓN
    // ASIGNAR CONTRATO A CAMIÓN
    const assignContract = async (assignmentData) => {
        try {
            const respuesta = await authFetch('/assign-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignmentData)
            });
            const resultado = await respuesta.json();

            if (resultado.success) {
                // Update local contracts state
                setContracts(prevContracts => prevContracts.map(contract => {
                    // Use loose equality (==) or parseInt to skip type issues
                    if (contract.id == assignmentData.contract_id) {
                        const newAssignment = resultado.assignment || resultado.data;
                        const existingAssignments = contract.asignaciones || [];
                        // Avoid duplicates if any
                        if (existingAssignments.some(a => a.id === newAssignment.id)) {
                             return contract;
                        }
                        const newAssignmentsList = [...existingAssignments, newAssignment];
                        return { ...contract, asignaciones: newAssignmentsList };
                    }
                    return contract;
                }));
                
                // Update local vehicles state if needed (optional)
                 setVehiculos(prev => prev.map(v => {
                    if (v.id == assignmentData.camion_id) {
                        return v; 
                    }
                    return v;
                }));

                return resultado.assignment || resultado.data;
            } else {
                return { error: resultado.message };
            }
        } catch (error) {
            console.error('Error al asignar contrato:', error);
            return { error: "Error de conexión" };
        }
    };

    const deleteAssignment = async (assignmentId, contractId) => {
        try {
            const respuesta = await authFetch(`/assign-contract/${assignmentId}`, {
                method: 'DELETE'
            });
            const data = await respuesta.json();

            if (data.success) {
                // Update local contracts state
                 setContracts(prevContracts => prevContracts.map(contract => {
                    if (contract.id === contractId) {
                        return { 
                            ...contract, 
                            asignaciones: contract.asignaciones.filter(a => a.id !== assignmentId) 
                        };
                    }
                    return contract;
                }));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            return false;
        }
    };


    // VINCULAR REMOLQUES A CAMIONES
    const linkRemolque = async (camionId, remolqueId) => {
        try {
            const respuesta = await authFetch(`/camiones/${camionId}/link-trailer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ remolque_id: remolqueId })
            });
            const resultado = await respuesta.json();

            if (resultado.success) {
                const camionActualizado = transformarDatosCamion(resultado.data);
                setVehiculos(prev => prev.map(v => v.id === camionId ? camionActualizado : v));
            }
        } catch (error) {
            console.error('Error al vincular remolque:', error);
        }
    };

    const unlinkRemolque = async (camionId) => {
        try {
            const respuesta = await authFetch(`/camiones/${camionId}/unlink-trailer`, {
                method: 'POST'
            });
            const resultado = await respuesta.json();

            if (resultado.success) {
                const camionActualizado = transformarDatosCamion(resultado.data);
                setVehiculos(prev => prev.map(v => v.id === camionId ? camionActualizado : v));
            }
        } catch (error) {
            console.error('Error al desvincular remolque:', error);
        }
    };

    // TEMA OSCURO
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <FleetContext.Provider
            value={{
                // Datos
                vehiculos,
                remolques,
                contracts, // Export contracts
                rutas,
                loading,
                darkMode,

                // Funciones para Camiones
                addVehicle,
                updateVehicle,
                deleteVehicle,

                // Funciones para Remolques
                addRemolque,
                updateRemolque,
                deleteRemolque,

                // Funciones para Vincular
                linkRemolque,
                unlinkRemolque,
                assignContract, // Export assignment function
                deleteAssignment, // Export delete assignment function
                addContract,
                updateContract,
                deleteContract,


                // Funciones varias
                toggleTheme
            }}
        >
            {children}
        </FleetContext.Provider>
    );
};
