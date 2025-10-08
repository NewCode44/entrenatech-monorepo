import React, { useState } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    AreaChart,
    BarChart,
    PieChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Pie,
    Cell
} from 'recharts';
import Card from '@/ui/Card';
import Icon from '@/ui/Icon';
import {
    ANALYTICS_KPIS,
    REVENUE_CHART_DATA,
    MEMBER_GROWTH_DATA,
    CLASS_POPULARITY_DATA,
    MEMBER_DEMOGRAPHICS_DATA
} from '../constants';

const Analytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('30d');

    const CustomTooltip = ({ active, payload, label, isCurrency = false }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
                    <p className="font-bold text-white">{label}</p>
                    {payload.map((pld: any, index: number) => (
                        <p key={index} style={{ color: pld.color || pld.fill }}>
                            {`${pld.name}: `}
                            <span className="font-bold">
                                {isCurrency
                                    ? pld.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : pld.value.toLocaleString('en-US')
                                }
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const DATE_RANGES = [
        { key: '7d', label: 'Últimos 7 días' },
        { key: '30d', label: 'Últimos 30 días' },
        { key: '90d', label: 'Últimos 90 días' },
        { key: '1y', label: 'Este Año' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
                <div>
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                        <Icon name="BarChart" className="w-10 h-10 text-primary"/>
                        <span className="gradient-text">Analíticas & BI</span>
                    </h1>
                    <p className="text-lg text-gray-500">
                        Insights y métricas clave para la toma de decisiones estratégicas.
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-4 md:mt-0 bg-gray-900 p-1 rounded-lg border border-gray-700">
                     {DATE_RANGES.map(range => (
                        <button key={range.key} onClick={() => setDateRange(range.key)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${dateRange === range.key ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                            {range.label}
                        </button>
                     ))}
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ANALYTICS_KPIS.map(kpi => (
                    <Card key={kpi.title} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-sm text-gray-400">{kpi.title}</p>
                           <Icon name={kpi.icon} className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="text-3xl font-bold text-white">{kpi.value}</p>
                        <p className={`text-sm font-semibold ${kpi.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>{kpi.change}</p>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Visión General Financiera</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={REVENUE_CHART_DATA}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis dataKey="name" stroke="#4A5568" fontSize={12} />
                                <YAxis stroke="#4A5568" fontSize={12} tickFormatter={(value: number) => `$${value/1000}k`} />
                                <Tooltip content={<CustomTooltip isCurrency={true} />} />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Bar dataKey="Gastos" fill="#4A5568" barSize={30} />
                                <Line type="monotone" dataKey="Ingresos" stroke="#2196F3" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Crecimiento de Miembros</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MEMBER_GROWTH_DATA}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis dataKey="name" stroke="#4A5568" fontSize={12} />
                                <YAxis stroke="#4A5568" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Area type="monotone" dataKey="Nuevos" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />
                                <Area type="monotone" dataKey="Bajas" stackId="1" stroke="#F44336" fill="#F44336" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Popularidad de Clases</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CLASS_POPULARITY_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis type="number" stroke="#4A5568" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="#D1D5DB" fontSize={12} width={70}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="asistencia" fill="#64B5F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                 <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Demografía de Miembros</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold text-gray-400 mb-2">Por Plan</h4>
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={MEMBER_DEMOGRAPHICS_DATA.byPlan} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {MEMBER_DEMOGRAPHICS_DATA.byPlan.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold text-gray-400 mb-2">Por Estado</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={MEMBER_DEMOGRAPHICS_DATA.byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {MEMBER_DEMOGRAPHICS_DATA.byStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;