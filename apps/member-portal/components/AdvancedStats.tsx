import React from 'react';
import { TrendingUp, TrendingDown, Activity, Target, Flame, Zap } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const AdvancedStats: React.FC = () => {
  const stats: Stat[] = [
    {
      label: 'Calorías Totales',
      value: '12,450',
      change: 12.5,
      unit: 'kcal',
      icon: <Flame className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Volumen de Carga',
      value: '45,230',
      change: 8.3,
      unit: 'kg',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Tiempo Total',
      value: '18.5',
      change: 15.2,
      unit: 'hrs',
      icon: <Target className="h-5 w-5" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    {
      label: 'Intensidad Avg',
      value: '78',
      change: 5.7,
      unit: '%',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900">Estadísticas Avanzadas</h2>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
          >
            {/* Icon */}
            <div className={`mb-3 inline-flex items-center justify-center rounded-xl ${stat.bgColor} p-2.5 ${stat.color}`}>
              {stat.icon}
            </div>

            {/* Value */}
            <div className="mb-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-zinc-900">{stat.value}</span>
                <span className="text-sm font-medium text-zinc-500">{stat.unit}</span>
              </div>
            </div>

            {/* Label */}
            <p className="mb-2 text-xs font-medium text-zinc-600">{stat.label}</p>

            {/* Change Indicator */}
            <div className={`flex items-center gap-1 text-xs font-semibold ${
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{Math.abs(stat.change)}%</span>
              <span className="text-zinc-400">vs mes anterior</span>
            </div>

            {/* Background Decoration */}
            <div className={`absolute -bottom-2 -right-2 h-16 w-16 rounded-full ${stat.bgColor} opacity-20`} />
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900">Actividad Semanal</h3>
          <select className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20">
            <option>Esta semana</option>
            <option>Mes actual</option>
            <option>Último mes</option>
          </select>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => {
            const heights = [65, 80, 45, 90, 70, 55, 85];
            const height = heights[i];
            const isToday = i === 3;

            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg'
                        : 'bg-gradient-to-t from-zinc-200 to-zinc-300'
                    }`}
                    style={{ height: `${height}px` }}
                  >
                    {isToday && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        Hoy
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${isToday ? 'text-cyan-600' : 'text-zinc-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              <span className="text-zinc-600">Entrenamientos completados</span>
            </div>
            <span className="font-bold text-zinc-900">5/7 días</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStats;
