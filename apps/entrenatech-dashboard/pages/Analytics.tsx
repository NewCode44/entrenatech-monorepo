import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    AreaChart,
    BarChart,
    PieChart,
    LineChart,
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
import { PredictiveAnalyticsAI, ChurnPrediction, TrendInsight, AIInsight } from '../services/ai/predictiveAnalytics';

const Analytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('30d');
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [churnPredictions, setChurnPredictions] = useState<ChurnPrediction[]>([]);
    const [trends, setTrends] = useState<TrendInsight[]>([]);
    const [businessHealth, setBusinessHealth] = useState<any>(null);
    const [loadingAI, setLoadingAI] = useState(false);

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
                                    ? `$${pld.value.toLocaleString()}`
                                    : pld.value.toLocaleString()
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

    // Cargar insights de IA al montar
    useEffect(() => {
        loadAIInsights();
    }, []);

    const loadAIInsights = async () => {
        setLoadingAI(true);
        try {
            const [insights, churn, trendData, health] = await Promise.all([
                PredictiveAnalyticsAI.generateInsights(),
                PredictiveAnalyticsAI.predictChurnRisk(),
                PredictiveAnalyticsAI.analyzeTrends(),
                PredictiveAnalyticsAI.calculateBusinessHealth()
            ]);
            setAiInsights(insights);
            setChurnPredictions(churn);
            setTrends(trendData);
            setBusinessHealth(health);
        } catch (error) {
            console.error('Error loading AI insights:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const getInsightColor = (type: string) => {
        switch(type) {
            case 'opportunity': return 'border-green-500/50 bg-green-500/10';
            case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
            case 'info': return 'border-blue-500/50 bg-blue-500/10';
            default: return 'border-gray-700';
        }
    };

    const getChurnRiskColor = (risk: string) => {
        switch(risk) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

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

            {/* Business Health Score - AI */}
            {businessHealth && (
                <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-primary/30">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Icon name="Brain" className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Health Score IA</h3>
                                <p className="text-sm text-gray-400">Análisis predictivo del negocio</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-black gradient-text">{businessHealth.grade}</div>
                            <p className="text-sm text-gray-400">{businessHealth.score}/100</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {businessHealth.factors.map((factor: any, i: number) => (
                            <div key={i} className="bg-gray-900/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">{factor.name}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${factor.score}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white">{factor.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

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

            {/* AI Insights */}
            {aiInsights.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Icon name="Sparkles" className="w-6 h-6 text-primary" />
                            Insights Predictivos IA
                        </h2>
                        <button
                            onClick={loadAIInsights}
                            disabled={loadingAI}
                            className="text-sm px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Icon name={loadingAI ? "Loader" : "RefreshCw"} className={`w-4 h-4 ${loadingAI ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aiInsights.map(insight => (
                            <Card key={insight.id} className={`border ${getInsightColor(insight.type)}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        insight.type === 'opportunity' ? 'bg-green-500/20' :
                                        insight.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                                    }`}>
                                        <Icon name={insight.icon as any} className={`w-5 h-5 ${
                                            insight.type === 'opportunity' ? 'text-green-500' :
                                            insight.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-1">{insight.title}</h4>
                                        <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                                        {insight.action && (
                                            <button className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors">
                                                {insight.action}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Churn Risk Predictions */}
            {churnPredictions.length > 0 && (
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <Icon name="AlertTriangle" className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Predicción de Churn (IA)</h3>
                            <p className="text-sm text-gray-400">Miembros en riesgo de cancelación</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {churnPredictions.map(prediction => (
                            <div key={prediction.memberId} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getChurnRiskColor(prediction.churnRisk)}`} />
                                        <h4 className="font-bold text-white">{prediction.memberName}</h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-white">{prediction.riskScore}%</span>
                                        <p className="text-xs text-gray-500">Riesgo</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 mb-2">Razones:</p>
                                        <ul className="text-xs text-gray-300 space-y-1">
                                            {prediction.reasons.map((reason, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-0.5">•</span>
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 mb-2">Acciones sugeridas:</p>
                                        <ul className="text-xs text-gray-300 space-y-1">
                                            {prediction.recommendations.slice(0, 3).map((rec, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-green-400 mt-0.5">✓</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Trend Analysis */}
            {trends.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trends.map((trend, i) => (
                        <Card key={i} className="bg-gray-900/50">
                            <div className="flex items-center justify-between mb-3">
                                <Icon name={trend.icon as any} className={`w-6 h-6 ${
                                    trend.impact === 'positive' ? 'text-green-500' :
                                    trend.impact === 'negative' ? 'text-red-500' : 'text-gray-500'
                                }`} />
                                <div className={`flex items-center gap-1 text-sm font-bold ${
                                    trend.trend === 'up' ? 'text-green-500' :
                                    trend.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                                }`}>
                                    <Icon name={trend.trend === 'up' ? 'TrendingUp' : trend.trend === 'down' ? 'TrendingDown' : 'Minus'} className="w-4 h-4" />
                                    {trend.change > 0 ? '+' : ''}{trend.change}%
                                </div>
                            </div>
                            <h4 className="font-bold text-white mb-2">{trend.metric}</h4>
                            <p className="text-xs text-gray-400">{trend.prediction}</p>
                        </Card>
                    ))}
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visión General Financiera */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Visión General Financiera</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={REVENUE_CHART_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis dataKey="name" stroke="#4A5568" fontSize={12} />
                                <YAxis stroke="#4A5568" fontSize={12} tickFormatter={(value: number) => `$${(value/1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip isCurrency={true} />} />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Bar dataKey="Gastos" fill="#4A5568" barSize={30} />
                                <Line type="monotone" dataKey="Ingresos" stroke="#2196F3" strokeWidth={3} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Crecimiento de Miembros */}
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Crecimiento de Miembros</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MEMBER_GROWTH_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis dataKey="name" stroke="#4A5568" fontSize={12} />
                                <YAxis stroke="#4A5568" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "14px"}} />
                                <Area type="monotone" dataKey="Nuevos" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Bajas" stackId="1" stroke="#F44336" fill="#F44336" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Popularidad de Clases */}
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Popularidad de Clases</h3>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CLASS_POPULARITY_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                                <CartesianGrid stroke="#2D3748" strokeDasharray="3 3"/>
                                <XAxis type="number" stroke="#4A5568" fontSize={12} />
                                <YAxis type="category" dataKey="name" stroke="#D1D5DB" fontSize={12} width={70}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="asistencia" fill="#64B5F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Demografía de Miembros */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Demografía de Miembros</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold text-gray-400 mb-2">Por Plan</h4>
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MEMBER_DEMOGRAPHICS_DATA.byPlan}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {MEMBER_DEMOGRAPHICS_DATA.byPlan.map((entry, index) => (
                                            <Cell key={`cell-plan-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold text-gray-400 mb-2">Por Estado</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={MEMBER_DEMOGRAPHICS_DATA.byStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {MEMBER_DEMOGRAPHICS_DATA.byStatus.map((entry, index) => (
                                            <Cell key={`cell-status-${index}`} fill={entry.fill} />
                                        ))}
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