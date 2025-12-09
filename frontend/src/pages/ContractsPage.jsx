import React, { useState, useEffect } from 'react';
import ContractForm from '../components/ContractForm';
import TarjetaContrato from '../components/TarjetaContrato';
import './ContractsPage.css';


//AUTOFECTH, LUEGO HAY QUE QUITAR EL CONTENT TYPE ETC!
const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
};

const ContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("todos");

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await authFetch('http://localhost:8000/api/contracts');
            const data = await response.json();
            setContracts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contracts:', error);
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingContract(null);
        setShowForm(true);
    };

    const handleEditClick = (contract) => {
        setEditingContract(contract);
        setShowForm(true);
    };

    // Filter Logic
    const filteredContracts = contracts.filter(contract => {
        const matchesSearch =
            (contract.client_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (contract.origin_address?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (contract.destination_address?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "todos" || contract.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleCloseForm = () => {
        setShowForm(false);
        fetchContracts(); // Refresh list after add/edit/delete
    };

    return (
        <div className="contracts-page">
            <div className="contracts-header-actions">
                <div className="search-filters">
                    <input
                        type="text"
                        placeholder="Buscar por cliente, origen o destino..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                    </select>
                </div>
                <button className="btn-add" onClick={handleAddClick}>
                    + Nuevo Contrato
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Cargando contratos...</div>
            ) : (
                <div className="contracts-grid">
                    {filteredContracts.map((contract) => (
                        <TarjetaContrato
                            key={contract.id}
                            contract={contract}
                            onClick={handleEditClick}
                        />
                    ))}

                    {filteredContracts.length === 0 && !loading && (
                        <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">
                                {contracts.length === 0 ? "No hay contratos registrados aún." : "No se encontraron contratos con los filtros actuales."}
                            </p>
                            {contracts.length === 0 && (
                                <button
                                    onClick={handleAddClick}
                                    className="btn-add mt-3"
                                >
                                    Crear el primero
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <ContractForm
                    onClose={handleCloseForm}
                    initialData={editingContract}
                />
            )}
        </div>
    );
};

export default ContractsPage;
