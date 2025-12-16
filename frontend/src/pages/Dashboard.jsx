import React, { useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import { useNavigate } from 'react-router-dom';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#10B981', '#f59e0b', '#ef4444', '#8b5cf6'];

function Dashboard() {
    const { vehiculos, contracts, loading, darkMode } = useFleet();
    const navigate = useNavigate();

    // --- KPI CALCULATIONS ---
    const stats = useMemo(() => {
        if (!vehiculos || !contracts) return { 
            totalTrucks: 0, availableTrucks: 0, activeContracts: 0, totalCargoInfo: 0 
        };

        const totalTrucks = vehiculos?.length || 0;
        const availableTrucks = vehiculos?.filter(v => 
            v.estado === "Disponible" && 
            (!v.asignaciones || !v.asignaciones.some(a => a.estado !== "COMPLETADO" && a.estado !== "CANCELADO"))
        ).length || 0;
        
        const activeContracts = contracts?.filter(c => c.status !== "completed" && c.status !== "cancelled").length || 0;
        
        // Sum of delivered vs total
        let totalDelivered = 0;
        let totalPlanned = 0;
        contracts?.forEach(c => {
            totalDelivered += Number(c.delivered_quantity || 0);
            totalPlanned += Number(c.total_quantity || 0);
        });

        const cargoProgress = totalPlanned > 0 ? ((totalDelivered / totalPlanned) * 100).toFixed(1) : 0;

        return {
            totalTrucks,
            availableTrucks,
            activeContracts,
            totalDelivered,
            totalPlanned,
            cargoProgress
        };
    }, [vehiculos, contracts]);

    // --- DATA FOR CHARTS ---
    const fleetStatusData = useMemo(() => {
        if (!vehiculos) return [];
        const statusCounts = { 'Disponible': 0, 'Asignado': 0, 'Taller': 0, 'En Ruta': 0 };
        
        vehiculos.forEach(v => {
            // Check if assigned in contracts (more robust)
            const isAssigned = v.asignaciones && v.asignaciones.some(a => a.estado !== "COMPLETADO" && a.estado !== "CANCELADO");
            
            if (v.estado === 'Taller') statusCounts['Taller']++;
            else if (isAssigned) statusCounts['Asignado']++;
            else statusCounts['Disponible']++;
        });

        return Object.keys(statusCounts)
            .filter(key => statusCounts[key] > 0)
            .map(key => ({ name: key, value: statusCounts[key] }));
    }, [vehiculos]);

    const contractProgressData = useMemo(() => {
        if (!contracts) return [];
        // Sort by progress desc and take top 5 active
        return contracts
            .filter(c => c.status !== 'completed' && c.status !== 'cancelled')
            .map(c => ({
                id: c.id, // Included for navigation
                name: c.client_name?.substring(0, 15) || 'Sin Nombre',
                Entregado: Number(c.delivered_quantity || 0),
                Restante: Math.max(0, Number(c.total_quantity || 0) - Number(c.delivered_quantity || 0))
            }))
            .slice(0, 5);
    }, [contracts]);

    const handleNavigateToContract = (contractId) => {
        if (contractId) {
            navigate('/contratos', { state: { contractId } });
        }
    };

    if (loading) return <div className="p-4" style={{color: 'var(--text-primary)'}}>Cargando datos...</div>;

    // Dynamic styles for chart text
    const axisColor = darkMode ? '#94a3b8' : '#64748b';
    const gridColor = darkMode ? '#334155' : '#e2e8f0';
    const tooltipStyle = {
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    };

    return (
        <div className="dashboard-container">
            {/* Header / Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{color: 'var(--text-primary)'}}>Hola, Admin 👋</h2>
                <span className="text-sm" style={{color: 'var(--text-secondary)'}}>
                    Última actualización: {new Date().toLocaleTimeString()}
                </span>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <span className="kpi-title">Contratos Activos</span>
                    <span className="kpi-value">{stats.activeContracts}</span>
                    <span className="kpi-trend trend-neutral">
                        En curso
                    </span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Flota Disponible</span>
                    <span className="kpi-value">
                        {stats.availableTrucks} <span style={{fontSize: '1rem', color:'var(--text-tertiary)'}}>/ {stats.totalTrucks}</span>
                    </span>
                    <span className={`kpi-trend ${stats.availableTrucks > 0 ? 'trend-up' : 'trend-down'}`}>
                        {stats.availableTrucks === 0 ? '⚠ Sin camiones libres' : 'Camiones listos'}
                    </span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-title">Progreso Global de Carga</span>
                    <span className="kpi-value">{stats.cargoProgress}%</span>
                    <div style={{width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '4px', marginTop: '5px'}}>
                        <div style={{
                            width: `${stats.cargoProgress}%`, 
                            height: '100%', 
                            background: 'var(--accent-primary)', 
                            borderRadius: '4px',
                            transition: 'width 1s ease'
                        }}></div>
                    </div>
                </div>
                 <div className="kpi-card">
                    <span className="kpi-title">Toneladas Movidas</span>
                    <span className="kpi-value">
                        {(stats.totalDelivered / 1000).toFixed(1)}k
                    </span>
                    <span className="kpi-trend text-sm" style={{color: 'var(--text-secondary)'}}>
                        de {(stats.totalPlanned / 1000).toFixed(1)}k Totales
                    </span>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Chart 1: Contract Progress */}
                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Progreso de Contratos (Top 5)</span>
                    </div>
                    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart 
                                data={contractProgressData} 
                                margin={{top: 20, right: 30, left: 20, bottom: 5}}
                                onClick={(data) => {
                                    if (data && data.activePayload && data.activePayload[0]) {
                                        handleNavigateToContract(data.activePayload[0].payload.id);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: axisColor}} stroke={axisColor} />
                                <YAxis tick={{fontSize: 12, fill: axisColor}} stroke={axisColor} />
                                <Tooltip 
                                    contentStyle={tooltipStyle} 
                                    cursor={{fill: 'var(--bg-tertiary)'}}
                                />
                                <Legend />
                                <Bar dataKey="Entregado" stackId="a" fill="var(--accent-primary)" radius={[0, 0, 0, 0]} barSize={40} />
                                <Bar dataKey="Restante" stackId="a" fill="var(--bg-tertiary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Fleet Status */}
                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Estado de la Flota</span>
                    </div>
                    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={fleetStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="var(--card-bg)"
                                >
                                    {fleetStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Urgent Contracts */}
            <div className="recent-activity">
                 <div className="recent-header">
                    <span className="recent-title">Contratos Recientes</span>
                 </div>
                 <ul className="activity-list">
                    {contracts && contracts.slice(0, 5).map(contract => (
                        <li 
                            key={contract.id} 
                            className="activity-item" 
                            onClick={() => handleNavigateToContract(contract.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="activity-info">
                                <span className="activity-main">{contract.client_name}</span>
                                <span className="activity-sub">{contract.origin_address} ➝ {contract.destination_address}</span>
                            </div>
                            <div className="activity-status">
                                <span style={{
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.8rem',
                                    background: contract.status === 'completed' ? 'var(--success-bg)' : 'var(--info-bg)',
                                    color: contract.status === 'completed' ? 'var(--success-text)' : 'var(--info-text)'
                                }}>
                                    {contract.status === 'completed' ? 'Completado' : 'En curso'}
                                </span>
                            </div>
                        </li>
                    ))}
                    {(!contracts || contracts.length === 0) && (
                        <li className="activity-item" style={{justifyContent: 'center', color: 'var(--text-tertiary)'}}>
                            No hay actividad reciente
                        </li>
                    )}
                 </ul>
            </div>
        </div>
    );
}

export default Dashboard;
