import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContractForm from '../components/ContractForm';
import TarjetaContrato from '../components/TarjetaContrato';
import AssignTruckDrawer from '../components/AssignTruckDrawer';
import { useFleet } from '../context/FleetContext';
import './ContractsPage.css';

const ContractsPage = () => {
    const { contracts, loading } = useFleet();
    const [showForm, setShowForm] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [assigningContract, setAssigningContract] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("todos");
    const location = useLocation();

    // Scroll to contract if passed in state
    useEffect(() => {
        if (!loading && location.state?.contractId) {
            const element = document.getElementById(`contract-${location.state.contractId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlight-contract');
                setTimeout(() => element.classList.remove('highlight-contract'), 2000);
            }
        }
    }, [loading, location.state, contracts]);

    // fetchContracts removed as it comes from context

    const handleAddClick = () => {
        setEditingContract(null);
        setShowForm(true);
    };

    const handleEditClick = (contract) => {
        setEditingContract(contract);
        setShowForm(true);
    };

    const handleAssignClick = (contract) => {
        // Reuse the Edit form for assignment
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
    };

    const handleCloseAssign = () => {
        setAssigningContract(null);
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
                        <div id={`contract-${contract.id}`} key={contract.id} className="contract-card-wrapper">
                            <TarjetaContrato
                                contract={contract}
                                onClick={handleEditClick}
                                onAssign={handleAssignClick}
                            />
                        </div>
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

            {assigningContract && (
                <AssignTruckDrawer
                    contract={assigningContract}
                    onClose={handleCloseAssign}
                />
            )}
        </div>
    );
};

export default ContractsPage;
