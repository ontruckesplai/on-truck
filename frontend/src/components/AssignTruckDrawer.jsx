import { useState, useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import './VehicleForm.css'; // Reusing Drawer styles

const AssignTruckDrawer = ({ contract, onClose }) => {
    const { vehiculos, assignContract } = useFleet();
    const [selectedTruckId, setSelectedTruckId] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Filter available trucks (Available or In Garage, but not currently occupied ideally, though user might want to queue)
    const availableTrucks = vehiculos.filter(v =>
        (v.tipo === 'camion') // Only trucks
    );

    const selectedTruck = vehiculos.find(v => v.id == selectedTruckId);

    // Calculation Logic (Reused)
    const estimation = useMemo(() => {
        if (!selectedTruck || !contract) return null;

        const trailerCapacity = selectedTruck.remolque ? selectedTruck.remolque.capacidad : 0;

        if (!trailerCapacity) return { error: "El camión seleccionado no tiene remolque o capacidad definida." };

        const totalQty = contract.totalQuantity || contract.total_quantity || 0;

        if (totalQty <= 0) return { error: "El contrato no tiene cantidad definida." };

        const trips = Math.ceil(totalQty / trailerCapacity);

        const distanceOneWay = contract.distanceKm || contract.distance_km || 500;
        const totalDistance = (trips > 1) ? ((distanceOneWay * 2 * (trips - 1)) + distanceOneWay) : distanceOneWay;

        const hoursNeeded = totalDistance / 32.5;
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + (hoursNeeded * 60));

        const deadline = contract.deadline ? new Date(contract.deadline) : null;
        const isLate = deadline && endDate > deadline;

        return {
            trips,
            totalDistance,
            hoursNeeded,
            endDate,
            isLate
        };
    }, [selectedTruck, contract, startDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await assignContract({
            camion_id: selectedTruckId,
            contract_id: contract.id,
            fecha_inicio: startDate
        });

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    return (
        <div className="vehicle-drawer-overlay" onClick={onClose}>
            <div className="vehicle-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <h3>Asignar Camión</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {success ? (
                    <div className="success-message p-6 text-center">
                        <div className="mb-4 text-green-500 text-5xl">✓</div>
                        <h4 className="text-xl font-bold mb-2">¡Asignado!</h4>
                        <p>El camión ha sido vinculado al contrato.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="vehicle-form">
                        <div className="contract-summary-card">
                            <div className="summary-header">
                                <span className="summary-icon">📄</span>
                                <div>
                                    <h4 className="summary-title">{contract.client_name}</h4>
                                    <span className="summary-subtitle">{contract.product_type}</span>
                                </div>
                            </div>

                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="label">Origen</span>
                                    <span className="value">{contract.origin_address.split(',')[0]}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Destino</span>
                                    <span className="value">{contract.destination_address.split(',')[0]}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Carga Total</span>
                                    <span className="value highlight">{contract.total_quantity?.toLocaleString()} kg</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Fecha Límite</span>
                                    <span className="value danger">
                                        {contract.deadline ? new Date(contract.deadline).toLocaleDateString() : 'Sin fecha'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="form-section-title">Asignación</div>

                        <div className="form-group">
                            <label>Seleccionar Camión</label>
                            <select
                                value={selectedTruckId}
                                onChange={(e) => setSelectedTruckId(e.target.value)}
                                required
                            >
                                <option value="">-- Elegir Camión --</option>
                                {availableTrucks.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.matricula} - {v.modelo} {v.tiene_remolque ? '(Con Remolque)' : '(Sin Remolque)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha de Inicio</label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        {estimation && !estimation.error && (
                            <div className={`estimation-box ${estimation.isLate ? 'late' : 'ontime'}`}>
                                <h4>Estimación de Viaje</h4>
                                <ul>
                                    <li><strong>Viajes:</strong> {estimation.trips}</li>
                                    <li><strong>Tiempo:</strong> {estimation.hoursNeeded.toFixed(1)}h ({estimation.totalDistance.toFixed(0)} km)</li>
                                    <li><strong>Fin:</strong> {estimation.endDate.toLocaleString()}</li>
                                    {estimation.isLate && <li className="warning-text">⚠️ Llegará Tarde</li>}
                                </ul>
                            </div>
                        )}

                        {estimation?.error && (
                            <div className="error-msg p-3 bg-red-100 text-red-700 rounded mb-4 text-sm border border-red-200">
                                {estimation.error}
                            </div>
                        )}

                        {error && <div className="error-msg">{error}</div>}

                        <div className="form-actions mt-auto">
                            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={!selectedTruckId || estimation?.error}
                            >
                                Confirmar Asignación
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AssignTruckDrawer;
