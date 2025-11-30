import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { RouteMap } from "./MapaRuta";
import "./ContractForm.css"; // Reusing VehicleForm styles for the drawer

function ContractForm({ onClose, initialData = null }) {
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
        }
    }, [initialData]);

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
            ? `http://localhost:8000/api/contracts/${initialData.id}`
            : "http://localhost:8000/api/contracts";

        const method = initialData ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
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
            const response = await fetch(`http://localhost:8000/api/contracts/${initialData.id}`, {
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
        </div>
    );
}

export default ContractForm;
