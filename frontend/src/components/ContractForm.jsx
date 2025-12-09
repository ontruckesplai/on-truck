import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { authFetch } from "../services/api";
import ConfirmModal from "./ConfirmModal";
import { RouteMap } from "./MapaRuta";
import { useFleet } from "../context/FleetContext";
import "./ContractForm.css";

function ContractForm({ onClose, initialData = null }) {
    const navigate = useNavigate(); // Initialize hook
    const { vehiculos, assignContract } = useFleet();
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        camion_id: "",
        fecha_inicio: ""
    });
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        client_name: "",
        total_quantity: "",
        product_type: "",
        deadline: "",
        origin_address: "",
        origin_lat: "",
        origin_lon: "",
        destination_address: "",
        destination_lat: "",
        destination_lon: "",
        status: "pending"
    });
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null); // 'origin' or 'destination'
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                deadline: initialData.deadline ? initialData.deadline.split('T')[0] : ""
            });
            // Fetch assignments for this contract
            // Fetch assignments for this contract
            authFetch(`/assign-contract/contract/${initialData.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setAssignments(data);
                })
                .catch(err => console.error("Error fetching assignments:", err));
        }
    }, [initialData]);

    const handleAssignmentChange = (e) => {
        setNewAssignment(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrorMsg("");
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!newAssignment.camion_id || !newAssignment.fecha_inicio) {
            setErrorMsg("Selecciona camión y fecha.");
            return;
        }

        const result = await assignContract({
            contract_id: initialData.id,
            camion_id: newAssignment.camion_id,
            fecha_inicio: newAssignment.fecha_inicio
        });

        if (result.error) {
            setErrorMsg(result.error); // Show backend duplicate error
        } else {
            // Success, reload assignments
            const res = await authFetch(`/assign-contract/contract/${initialData.id}`);
            const data = await res.json();
            setAssignments(data);
            // Clear form
            setNewAssignment({ camion_id: "", fecha_inicio: "" });
        }
    };

    const [assignmentToDelete, setAssignmentToDelete] = useState(null);

    const confirmDeleteAssignment = async () => {
        if (!assignmentToDelete) return;

        try {
            const response = await authFetch(`/assign-contract/${assignmentToDelete.id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete));
                setAssignmentToDelete(null);
            } else {
                alert(data.message || "Error al eliminar asignación");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "origin_address") {
            setActiveField("origin");
            // fetchSuggestions handled by useEffect
        } else if (name === "destination_address") {
            setActiveField("destination");
            // fetchSuggestions handled by useEffect
        }
    };

    // Debounce logic for geocoding
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (activeField === 'origin' && formData.origin_address.length >= 3) {
                fetchSuggestions(formData.origin_address);
            } else if (activeField === 'destination' && formData.destination_address.length >= 3) {
                fetchSuggestions(formData.destination_address);
            } else {
                setSuggestions([]);
            }
        }, 100); // Wait 300ms after typing stops

        return () => clearTimeout(timerId);
    }, [formData.origin_address, formData.destination_address, activeField]);

    const formatAddress = (address) => {
        const city = address.city || address.town || address.village || address.hamlet || address.municipality;
        const province = address.state || address.county || address.province;
        const postcode = address.postcode;
        const country = address.country;

        const parts = [city, province, postcode, country].filter(Boolean);
        return parts.join(", ");
    };

    const fetchSuggestions = async (query) => {
        try {
            // Add addressdetails=1 and limit=5 for better results
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();

            const formattedData = data.map(item => ({
                ...item,
                display_name: formatAddress(item.address) || item.display_name // Fallback to original if formatting fails
            }));

            setSuggestions(formattedData);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        console.log("Selected suggestion:", suggestion);
        if (activeField === "origin") {
            setFormData(prev => ({
                ...prev,
                origin_address: suggestion.display_name,
                origin_lat: suggestion.lat,
                origin_lon: suggestion.lon
            }));
        } else if (activeField === "destination") {
            setFormData(prev => ({
                ...prev,
                destination_address: suggestion.display_name,
                destination_lat: suggestion.lat,
                destination_lon: suggestion.lon
            }));
        }
        setSuggestions([]);
        setActiveField(null); // Prevent debounce from firing again
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting contract data:", formData);
        const url = initialData
            ? `/contracts/${initialData.id}`
            : "/contracts";

        const method = initialData ? "PUT" : "POST";

        try {
            const response = await authFetch(url, {
                method: method,
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onClose(); // Close drawer and refresh list
            } else {
                alert("Error al guardar el contrato");
            }
        } catch (error) {
            console.error("Error saving contract:", error);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;

        try {
            const response = await authFetch(`/contracts/${initialData.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onClose();
            } else {
                alert("Error al eliminar el contrato");
            }
        } catch (error) {
            console.error("Error deleting contract:", error);
        }
    };

    return (
        <div className="contract-drawer-overlay" onClick={onClose}>
            <div className="contract-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <h3>{initialData ? "Editar Contrato" : "Nuevo Contrato"}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="contract-form">
                    <div className="form-group">
                        <label>Cliente</label>
                        <input
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            required
                            placeholder="Nombre del cliente"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Carga Total (kg)</label>
                            <input
                                type="number"
                                name="total_quantity"
                                value={formData.total_quantity}
                                onChange={handleChange}
                                required
                                placeholder="Ej: 24000"
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo de Producto</label>
                            <input
                                type="text"
                                name="product_type"
                                value={formData.product_type}
                                onChange={handleChange}
                                required
                                placeholder="Ej: Fruta, Electrónica..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Fecha Límite</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group relative">
                        <label>Dirección Origen</label>
                        <input
                            type="text"
                            name="origin_address"
                            value={formData.origin_address}
                            onChange={handleChange}
                            required
                            placeholder="Buscar dirección..."
                            autoComplete="off"
                        />
                        {activeField === "origin" && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((s) => (
                                    <li key={s.place_id} onClick={() => handleSelectSuggestion(s)}>
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group relative">
                        <label>Dirección Destino</label>
                        <input
                            type="text"
                            name="destination_address"
                            value={formData.destination_address}
                            onChange={handleChange}
                            required
                            placeholder="Buscar dirección..."
                            autoComplete="off"
                        />
                        {activeField === "destination" && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((s) => (
                                    <li key={s.place_id} onClick={() => handleSelectSuggestion(s)}>
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="completed">Completado</option>
                        </select>
                    </div>

                    {/* Embedded Map */}
                    {formData.origin_lat && formData.origin_lon && formData.destination_lat && formData.destination_lon && (
                        <div className="form-group" style={{ height: '300px', marginTop: '1rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <RouteMap
                                origin={[formData.origin_lat, formData.origin_lon]}
                                destination={[formData.destination_lat, formData.destination_lon]}
                            />
                        </div>
                    )}

                    )}

                    {/* --- Assignment Section (Only for existing contracts) --- */}
                    {initialData && (
                        <div className="assignments-section" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                            <div className="form-section-title" style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 700 }}>Camiones Asignados</div>

                            {/* --- New Timeline & Estimation Section --- */}
                            <div className="timeline-section" style={{ marginBottom: '1.5rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                {/* Timeline Slider */}
                                {/* Logic Calculation (Lifted Up) */}
                                {(() => {
                                    // 1. Identify Valid Trucks
                                    const assignedTrucks = assignments.map(a => {
                                        const truck = vehiculos.find(v => v.id === a.camion_id);
                                        return truck ? { ...truck, fecha_inicio: new Date(a.fecha_inicio).getTime() } : null;
                                    }).filter(Boolean);

                                    const selectedTruckId = parseInt(newAssignment.camion_id);
                                    const selectedTruck = selectedTruckId ? vehiculos.find(v => v.id === selectedTruckId) : null;

                                    const activeFleet = [...assignedTrucks];
                                    if (selectedTruck && !assignedTrucks.some(v => v.id === selectedTruck.id)) {
                                        const startDate = newAssignment.fecha_inicio ? new Date(newAssignment.fecha_inicio).getTime() : Date.now();
                                        activeFleet.push({ ...selectedTruck, fecha_inicio: startDate });
                                    }

                                    // 2. Constants & Defaults
                                    const now = Date.now();
                                    const start = initialData.created_at ? new Date(initialData.created_at).getTime() : now;
                                    const deadline = initialData.deadline ? new Date(initialData.deadline).getTime() : (now + 86400000);

                                    // 3. Logic: If no active fleet, return empty timeline state
                                    if (activeFleet.length === 0) {
                                        return (
                                            <>
                                                <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    <span>Inicio: {new Date(start).toLocaleDateString()}</span>
                                                    <span>Límite: {new Date(deadline).toLocaleDateString()}</span>
                                                </div>
                                                <div className="timeline-slider" style={{ position: 'relative', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '1.5rem' }}>
                                                    {/* Empty Bar */}
                                                </div>
                                                <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Asigna camiones para ver la estimación.</div>
                                            </>
                                        );
                                    }

                                    // 4. Full Calculation (Existing logic)
                                    const remainingCargo = Math.max(0, initialData.total_quantity - (initialData.delivered_quantity || 0));
                                    const distance = initialData.distance_km || 500;
                                    const speed = 60; // km/h
                                    const roundTripDistance = distance * 2;
                                    const roundTripHours = roundTripDistance / speed; // hours per trip
                                    const tripTimeMs = roundTripHours * 3600000 + 7200000; // Trip + 2h load/unload in ms

                                    // 5. Capacities per ms
                                    const trucks = activeFleet.map(t => {
                                        const nominalCap = (t.remolque && t.remolque.capacidad) ? t.remolque.capacidad : 24000;
                                        return {
                                            start: t.fecha_inicio,
                                            capacityPerMs: nominalCap / tripTimeMs
                                        };
                                    }).sort((a, b) => a.start - b.start);

                                    // 6. Solve for T_end
                                    // TotalDelivered(T) = Sum_i [ max(0, T - max(Now, Si)) * Ci ] = RemainingCargo
                                    // Note: "Now" is relevant if truck started in past, it can only contribute to *Future* cargo from Now.
                                    // But if we use RemainingCargo, we represent work FROM NOW. 
                                    // If a truck started in the past, its capacity is available from NOW.
                                    // If a truck starts in the future, its capacity is available from START_i.

                                    // We need to find T_end such that:
                                    // RemainingCargo = Sum ( (T_end - EffectiveStart_i) * rate_i )
                                    // Where EffectiveStart_i = max(now, truck.start)
                                    // And (T_end - EffectiveStart_i) must be > 0.

                                    // Iterative approach: Assume T_end > Last Truck Start using cumulative calculation
                                    // or check intervals.

                                    let solvedEnd = now;
                                    let cargoToMove = remainingCargo;

                                    // Group by effective start times to find intervals
                                    const distinctStarts = [...new Set(trucks.map(t => Math.max(now, t.start)))].sort((a, b) => a - b);

                                    let currentStart = distinctStarts[0] || now;
                                    let activeRate = 0; // kg per ms
                                    let cargoCleared = 0;

                                    // Walk through intervals
                                    for (let i = 0; i < distinctStarts.length; i++) {
                                        const nextStart = distinctStarts[i + 1];
                                        // Add trucks that start at currentStart
                                        const newTrucks = trucks.filter(t => Math.max(now, t.start) === currentStart);
                                        newTrucks.forEach(t => activeRate += t.capacityPerMs);

                                        if (!nextStart) break; // Last interval, extend to infinity

                                        const duration = nextStart - currentStart;
                                        const capacityInInterval = activeRate * duration;

                                        if (cargoCleared + capacityInInterval >= cargoToMove) {
                                            // Finish within this interval
                                            const remaining = cargoToMove - cargoCleared;
                                            const timeNeeded = remaining / activeRate;
                                            solvedEnd = currentStart + timeNeeded;
                                            cargoCleared = cargoToMove;
                                            break;
                                        } else {
                                            cargoCleared += capacityInInterval;
                                            currentStart = nextStart;
                                        }
                                    }

                                    // If not finished after all starts
                                    if (cargoCleared < cargoToMove && activeRate > 0) {
                                        const remaining = cargoToMove - cargoCleared;
                                        const timeNeeded = remaining / activeRate;
                                        solvedEnd = currentStart + timeNeeded;
                                    }

                                    const estimatedFinishTime = solvedEnd;

                                    // Timeline Logic
                                    const totalAvailableDuration = deadline - start;
                                    const estimatedTotalDuration = estimatedFinishTime - start;

                                    let progressPercent = 0;
                                    if (totalAvailableDuration > 0) {
                                        progressPercent = (estimatedTotalDuration / totalAvailableDuration) * 100;
                                    }
                                    const isOverdue = progressPercent > 100;
                                    const displayPercent = Math.min(100, Math.max(0, progressPercent));

                                    const estimatedDaysLeft = (estimatedFinishTime - now) / 86400000;
                                    const estimatedDeliveryDate = new Date(estimatedFinishTime);

                                    const isImproved = selectedTruck ? true : false;
                                    const activeFleetCount = activeFleet.length;
                                    const totalPayloadKg = activeFleet.reduce((sum, v) => sum + (v.remolque?.capacidad || 24000), 0);

                                    // Format capacity: if < 1000kg show kg, else show tons with 1 decimal
                                    const activeFleetCapDisplay = totalPayloadKg < 1000
                                        ? `${totalPayloadKg} kg`
                                        : `${(totalPayloadKg / 1000).toFixed(1).replace(/\.0$/, '')}t`;

                                    return (
                                        <>
                                            {/* Timeline Slider */}
                                            <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <span>Inicio: {new Date(start).toLocaleDateString()}</span>
                                                <span style={{ color: isOverdue ? '#ef4444' : 'var(--text-secondary)', fontWeight: isOverdue ? 'bold' : 'normal' }}>
                                                    Límite: {new Date(deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="timeline-slider" style={{ position: 'relative', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '1.5rem' }}>
                                                {/* Projected Progress Bar */}
                                                <div className="timeline-progress" style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    background: isOverdue ? '#ef4444' : 'var(--accent-primary)',
                                                    borderRadius: '4px',
                                                    width: `${displayPercent}%`,
                                                    transition: 'width 0.5s ease, background 0.3s'
                                                }}></div>

                                                {/* Marker for Projected Finish */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: `${displayPercent}%`,
                                                    top: '-6px',
                                                    bottom: '-6px',
                                                    width: '2px',
                                                    background: isOverdue ? '#ef4444' : 'var(--accent-primary)',
                                                    zIndex: 2,
                                                    transition: 'left 0.5s ease'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '-24px',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        color: isOverdue ? '#ef4444' : 'var(--accent-primary)',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {Math.max(0, Math.ceil(estimatedDaysLeft))} días est.
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dynamic Estimation Box */}
                                            <div className="estimation-box" style={{
                                                background: isImproved ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: isImproved ? '1px solid #10b981' : 'none',
                                                transition: 'all 0.3s'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isImproved ? '#059669' : 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                                        {isImproved ? '🚀 Estimación Mejorada' : '⏱️ Estimación Actual'}
                                                    </span>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, whiteSpace: 'nowrap', display: 'block', color: isOverdue ? '#ef4444' : 'var(--text-primary)' }}>
                                                            {estimatedDaysLeft * 24 < 24 ? Math.ceil(estimatedDaysLeft * 24) + " horas" : Math.ceil(estimatedDaysLeft) + " días"}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: isImproved ? '#059669' : 'var(--text-secondary)' }}>
                                                            Entrega: {estimatedDeliveryDate.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                                    <span style={{ whiteSpace: 'nowrap' }}>Flota Activa: <strong>{activeFleetCount} camiones</strong></span>
                                                    <span style={{ whiteSpace: 'nowrap' }}>Capacidad: <strong>{activeFleetCapDisplay} / viaje</strong></span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* List of assignments */}
                            <div className="assignments-list" style={{ display: 'grid', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                {assignments.length === 0 && <span className="text-gray-500 italic text-sm">No hay camiones asignados aún.</span>}
                                {assignments.map(a => {
                                    const truck = vehiculos.find(v => v.id === a.camion_id);
                                    return (
                                        <div
                                            key={a.id}
                                            className="assignment-card"
                                            onClick={() => {
                                                if (truck) navigate('/vehiculos', { state: { openVehicleId: truck.id } });
                                            }}
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>🚛</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{truck ? truck.matricula : `ID: ${a.camion_id}`}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Inicio: {new Date(a.fecha_inicio).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                                                <div className="badge" style={{
                                                    background: a.estado === 'COMPLETADO' ? 'var(--green-soft)' : 'var(--blue-soft)',
                                                    color: a.estado === 'COMPLETADO' ? 'var(--green-text)' : 'var(--blue-text)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    {a.estado}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent navigation when deleting
                                                    setAssignmentToDelete(a);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-secondary)',
                                                    padding: '4px',
                                                    marginLeft: '8px'
                                                }}
                                                title="Eliminar asignación"
                                                className="delete-assignment-btn"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Assignment Form */}
                            <div className="add-assignment-box" style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Añadir Camión</label>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <select
                                        name="camion_id"
                                        value={newAssignment.camion_id}
                                        onChange={handleAssignmentChange}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {vehiculos
                                            .filter(v => v.tipo === 'camion')
                                            // Filter out trucks already assigned to this contract? Backend handles it, but nice to have.
                                            // User requested "que no puedas ponerlo con el mismo camion".
                                            // Filtering visually suggests availability.
                                            .filter(v => !assignments.some(a => a.camion_id === v.id))
                                            .map(v => (
                                                <option key={v.id} value={v.id}>
                                                    {v.matricula} {v.remolque ? '(Con Remolque)' : '(Sin Remolque)'}
                                                </option>
                                            ))}
                                    </select>
                                    <input
                                        type="datetime-local"
                                        name="fecha_inicio"
                                        value={newAssignment.fecha_inicio}
                                        onChange={handleAssignmentChange}
                                        style={{ flex: '0 0 200px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAssignment}
                                        style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0 0.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        + Añadir
                                    </button>
                                </div>
                                {errorMsg && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{errorMsg}</div>}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        {initialData && (
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Eliminar
                            </button>
                        )}
                        <button type="button" className="btn-cancel" onClick={onClose}>Atrás</button>
                        <button type="submit" className="btn-save">
                            {initialData ? "Guardar Cambios" : "Crear Contrato"}
                        </button>
                    </div>
                </form>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="¿Eliminar Contrato?"
                message={`Estás a punto de eliminar el contrato de "${formData.client_name}". Esta acción no se puede deshacer.`}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isDanger={true}
            />

            <ConfirmModal
                isOpen={!!assignmentToDelete}
                onClose={() => setAssignmentToDelete(null)}
                onConfirm={confirmDeleteAssignment}
                title="¿Desvincular Camión?"
                message="¿Estás seguro de que quieres quitar este camión de la ruta? La asignación se eliminará permanentemente."
                confirmText="Sí, desvincular"
                cancelText="Cancelar"
                isDanger={true}
            />
        </div>
    );
}

export default ContractForm;
