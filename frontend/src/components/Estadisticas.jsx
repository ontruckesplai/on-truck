import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useFleet } from "../context/FleetContext";
import "./Estadisticas.css";

function Estadisticas() {
    const { vehiculos, rutas } = useFleet();

    // --- KPIs ---
    const totalVehiculos = vehiculos.length;
    const enRuta = vehiculos.filter((v) => v.estado === "En Ruta").length;
    const enTaller = vehiculos.filter((v) => v.estado === "Taller").length;
    const disponibles = vehiculos.filter((v) => v.estado === "Disponible").length;

    // --- Datos Gráficos ---
    const dataEstado = [
        { name: "En Ruta", value: enRuta, color: "#3b82f6" },
        { name: "Taller", value: enTaller, color: "#ef4444" },
        { name: "Disponible", value: disponibles, color: "#10b981" },
    ];

    // Mock data for fuel costs (last 6 months)
    const dataCombustible = [
        { name: "Jun", gasto: 4000 },
        { name: "Jul", gasto: 3000 },
        { name: "Ago", gasto: 2000 },
        { name: "Sep", gasto: 2780 },
        { name: "Oct", gasto: 1890 },
        { name: "Nov", gasto: 2390 },
    ];

    const StatCard = ({ title, value, color, icon }) => (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-info">
                <span className="stat-title">{title}</span>
                <span className="stat-value" style={{ color: color }}>
                    {value}
                </span>
            </div>
            <div
                className="stat-icon"
                style={{ backgroundColor: `${color}20`, color: color }}
            >
                {icon}
            </div>
        </div>
    );

    return (
        <div className="estadisticas-container">
            {/* KPIs */}
            <div className="estadisticas-grid">
                <StatCard
                    title="Total Vehículos"
                    value={totalVehiculos}
                    color="var(--accent-primary)"
                    icon="🚛"
                />
                <StatCard
                    title="En Ruta"
                    value={enRuta}
                    color="var(--info-text)"
                    icon="🛣️"
                />
                <StatCard
                    title="Disponibles"
                    value={disponibles}
                    color="var(--success-text)"
                    icon="✅"
                />
                <StatCard
                    title="En Taller"
                    value={enTaller}
                    color="var(--danger-text)"
                    icon="🔧"
                />
            </div>

            {/* Gráficos */}
            <div className="charts-grid">
                {/* Gráfico de Barras: Gastos Combustible */}
                <div className="chart-card">
                    <h3>Gastos Mensuales Combustible (€)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataCombustible}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--bg-secondary)",
                                    borderColor: "var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="gasto" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico Circular: Estado de Flota */}
                <div className="chart-card">
                    <h3>Estado de la Flota</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dataEstado}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataEstado.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;
