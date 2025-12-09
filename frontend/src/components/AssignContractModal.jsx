import { useState, useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import './AssignContractModal.css';

const AssignContractModal = ({ vehiculo, onClose }) => {
    const { contracts, assignContract } = useFleet();
    const [selectedContractId, setSelectedContractId] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Filter available contracts (pending or in_progress, maybe?)
    const availableContracts = contracts.filter(c => c.status !== 'completed');

    const selectedContract = contracts.find(c => c.id == selectedContractId);

    // Calculation Logic
    const estimation = useMemo(() => {
        if (!vehiculo || !selectedContract) return null;

        const trailerCapacity = vehiculo.remolque ? vehiculo.remolque.capacidad : 0;

        if (!trailerCapacity) return { error: "El vehículo no tiene remolque o capacidad definida." };

        const totalQty = selectedContract.totalQuantity || selectedContract.total_quantity || 0; // handle case naming

        if (totalQty <= 0) return { error: "El contrato no tiene cantidad definida." };

        const trips = Math.ceil(totalQty / trailerCapacity);

        // Distance
        const distanceOneWay = selectedContract.distanceKm || selectedContract.distance_km || 500;
        const totalDistance = (trips > 1) ? ((distanceOneWay * 2 * (trips - 1)) + distanceOneWay) : distanceOneWay;

        // Time: 32.5 km/h
        const hoursNeeded = totalDistance / 32.5;
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + (hoursNeeded * 60));

        // Deadline check
        const deadline = selectedContract.deadline ? new Date(selectedContract.deadline) : null;
        const isLate = deadline && endDate > deadline;

        return {
            trips,
            totalDistance,
            hoursNeeded,
            endDate,
            isLate
        };
    }, [vehiculo, selectedContract, startDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await assignContract({
            camion_id: vehiculo.id,
            contract_id: selectedContractId,
            fecha_inicio: startDate
        });

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Close after 2 seconds
        }
    };

    if (success) {
        return (
            <div className="modal-overlay">
                <div className="modal-content success">
                    <h3>¡Asignación Completada!</h3>
                    <p>El camión ha sido asignado al contrato correctamente.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2>Asignar Contrato</h2>
                <p className="subtitle">Vehículo: {vehiculo.matricula} ({vehiculo.modelo})</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Contrato</label>
                        <select
                            value={selectedContractId}
                            onChange={(e) => setSelectedContractId(e.target.value)}
                            required
                        >
                            <option value="">-- Seleccionar Contrato --</option>
                            {availableContracts.map(c => (
                                <option key={c.id} value={c.id}>
                                    #{c.id} - {c.client_name || c.clientName} ({c.origin_address || c.originAddress} a {c.destination_address || c.destinationAddress})
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

                    {selectedContract && estimation && !estimation.error && (
                        <div className={`estimation-box ${estimation.isLate ? 'late' : 'ontime'}`}>
                            <h4>Estimación</h4>
                            <ul>
                                <li><strong>Viajes necesarios:</strong> {estimation.trips}</li>
                                <li><strong>Distancia Total:</strong> {estimation.totalDistance.toFixed(0)} km</li>
                                <li><strong>Tiempo Estimado:</strong> {estimation.hoursNeeded.toFixed(1)} horas</li>
                                <li>
                                    <strong>Fin Estimado:</strong><br />
                                    {estimation.endDate.toLocaleString()}
                                </li>
                                {estimation.isLate && (
                                    <li className="warning-text">⚠️ ¡Supera el Deadline!</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {estimation?.error && (
                        <div className="error-msg">{estimation.error}</div>
                    )}

                    {error && <div className="error-msg">{error}</div>}

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={!selectedContractId || estimation?.error}
                        >
                            Confirmar Asignación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignContractModal;
